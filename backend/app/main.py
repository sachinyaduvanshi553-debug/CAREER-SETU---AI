from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from dotenv import load_dotenv
import csv
import random
import json

import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# ---- Configuration ----
PORT = int(os.getenv("PORT", 8000))
ALLOWED_ORIGINS_STR = os.getenv("ALLOWED_ORIGINS", "*")
ALLOWED_ORIGINS: List[str] = (
    ["*"] if ALLOWED_ORIGINS_STR == "*"
    else [o.strip() for o in ALLOWED_ORIGINS_STR.split(",")]
)

try:
    print("Importing core models and database...")
    from .models import UserProfile, JobRole, ResumeAnalysis, SkillGapReport, JobListing, UserRegistration, UserLogin
    from .database import get_db
    from .auth import get_password_hash, verify_password, create_access_token, get_current_user_email, RoleChecker
except (ImportError, ValueError):
    from app.models import UserProfile, JobRole, ResumeAnalysis, SkillGapReport, JobListing, UserRegistration, UserLogin
    from app.database import get_db
    from app.auth import get_password_hash, verify_password, create_access_token, get_current_user_email, RoleChecker
from .routers import worker, customer, admin, chat
from datetime import datetime, timedelta

app = FastAPI(title="SkillBridge AI API")

# Register Routers
app.include_router(worker.router)
app.include_router(customer.router)
app.include_router(admin.router)
app.include_router(chat.router)

# CORS Configuration
# NOTE: allow_credentials=True is only valid when allow_origins is NOT ["*"].
# When ALLOWED_ORIGINS env var lists specific URLs (e.g. your frontend), credentials work.
# In development (wildcard), credentials are disabled to comply with the CORS spec.
_use_credentials = ALLOWED_ORIGINS != ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=_use_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_roles_from_dataset():
    roles = []
    data_path = os.path.join(os.path.dirname(__file__), "../data/skills_roles_dataset.csv")
    try:
        with open(data_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            seen = set()
            for idx, row in enumerate(reader, start=1):
                title = row["Role"]
                if title not in seen:
                    roles.append(JobRole(
                        id=str(idx),
                        title=title,
                        category=row["Category"],
                        requiredSkills=[s.strip() for s in row["Skills"].split(",")],
                        avgSalary=row["AverageSalary"],
                        demandLevel=row["DemandLevel"],
                        growth="High",
                        description=f"Professional {title} role in the {row['Category']} sector."
                    ))
                    seen.add(title)
    except Exception as e:
        logger.warning(f"Could not load roles dataset: {e}")
    return roles if roles else []

# Load authentic roles from the 6500-row dataset
ROLES_DB = load_roles_from_dataset()

# Lazy engine loaders
_extractor = None
_gap_analyzer = None
_career_recommender = None
_roadmap_generator = None
_resume_scorer = None
_interview_engine = None
_analytics_engine = None
_job_fetcher = None

def get_skill_extractor():
    global _extractor
    if _extractor is None:
        from .skill_extractor import SkillExtractor
        _extractor = SkillExtractor()
    return _extractor

def get_gap_analyzer():
    global _gap_analyzer
    if _gap_analyzer is None:
        from .skill_gap_analyzer import SkillGapAnalyzer
        _gap_analyzer = SkillGapAnalyzer()
    return _gap_analyzer

def get_career_recommender():
    global _career_recommender
    if _career_recommender is None:
        from .career_recommender import CareerRecommender
        _career_recommender = CareerRecommender(ROLES_DB)
    return _career_recommender

def get_roadmap_generator():
    global _roadmap_generator
    if _roadmap_generator is None:
        from .roadmap_generator import RoadmapGenerator
        _roadmap_generator = RoadmapGenerator([])
    return _roadmap_generator

def get_resume_scorer():
    global _resume_scorer
    if _resume_scorer is None:
        from .resume_scorer import ResumeScorer
        _resume_scorer = ResumeScorer()
    return _resume_scorer

def get_interview_engine():
    global _interview_engine
    if _interview_engine is None:
        from .interview_engine import InterviewEngine
        _interview_engine = InterviewEngine()
    return _interview_engine

def get_analytics_engine():
    global _analytics_engine
    if _analytics_engine is None:
        from .analytics_engine import AnalyticsEngine
        _analytics_engine = AnalyticsEngine([r.__dict__ for r in ROLES_DB])
    return _analytics_engine

def get_job_fetcher():
    global _job_fetcher
    if _job_fetcher is None:
        from .services.job_service import JobFetcherService
        _job_fetcher = JobFetcherService()
    return _job_fetcher

@app.get("/")
async def root():
    return {"message": "Welcome to SkillBridge AI API"}

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "SkillBridge AI API"}

# Auth & Profile
@app.post("/api/auth/register")
async def register(profile: UserRegistration):
    db = get_db()
    
    # 1. Assert Phone and Email Uniqueness
    existing_user = await db["users"].find_one({"$or": [{"email": profile.email}, {"phone": profile.phone}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or phone already registered")
    
    # 2. Securely pack and insert model
    user_dict = profile.model_dump()
    user_dict["password"] = get_password_hash(user_dict["password"])
    
    result = await db["users"].insert_one(user_dict)
    
    user_dict.pop("password", None)
    user_dict["_id"] = str(result.inserted_id)
    return {"message": "User registered successfully", "user": user_dict}

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    db = get_db()
    user = await db["users"].find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Include role in JWT payload
    access_token = create_access_token(data={
        "sub": user["email"],
        "role": user.get("role", "professional")
    })
    
    user.pop("password", None)
    user["_id"] = str(user["_id"])
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user
    }

@app.get("/api/profile")
async def get_profile(email: str = Depends(get_current_user_email)):
    db = get_db()
    user = await db["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.pop("password", None)
    user["_id"] = str(user["_id"])
    return user

# Core Features
import io
from pypdf import PdfReader

@app.post("/api/resume/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename.lower()
    
    text = ""
    if filename.endswith(".pdf"):
        try:
            pdf_reader = PdfReader(io.BytesIO(content))
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not parse PDF: {str(e)}")
    else:
        # Assume text/plain or similar
        text = content.decode("utf-8", errors="ignore")  # type: ignore
        
    if not text.strip():
        raise HTTPException(status_code=400, detail="Uploaded file is empty or unreadable.")
        
    logger.info(f"Analyzing resume: {filename}")
    try:
        analysis = await get_resume_scorer().score_resume(text)
        logger.info(f"Analysis completed successfully for {filename}")
        return analysis
    except Exception as e:
        logger.error(f"Error during resume analysis: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/skills/gap")
async def analyze_skill_gap(data: Dict[str, Any]):
    user_skills = data.get("user_skills", [])
    target_role_id = data.get("role_id")
    
    role = next((r for r in ROLES_DB if r.id == target_role_id), ROLES_DB[0] if ROLES_DB else None)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    report = await get_gap_analyzer().analyze_gap(user_skills, role.requiredSkills)
    return report

@app.get("/api/career/recommend")
async def recommend_careers(skills: str):
    skill_list = skills.split(",")
    return await get_career_recommender().recommend(skill_list)

@app.get("/api/roadmap/{role_id}")
async def get_roadmap(role_id: str):
    role = next((r for r in ROLES_DB if r.id == role_id), ROLES_DB[0] if ROLES_DB else None)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    # For demo, assuming these are missing skills
    return await get_roadmap_generator().generate(role.requiredSkills)

@app.get("/api/jobs", response_model=List[JobListing])
async def get_jobs(skills: str = "Python", location: Optional[str] = None):
    """
    Fetch jobs matching the user's skills and location.
    Combines live jobs from Adzuna API with high-quality local results.
    """
    try:
        skill_list = [s.strip() for s in skills.split(",")]
        
        # 1. Fetch live jobs from Adzuna (async)
        live_jobs = await get_job_fetcher().fetch_live_jobs(skills, location)
        
        # 2. Match against combined set (semantic ranking)
        try:
            from .job_matcher import JobMatcher
        except (ImportError, ValueError):
            from app.job_matcher import JobMatcher
        matcher = JobMatcher([r.__dict__ for r in ROLES_DB])
        results = await matcher.match(skill_list, location, live_jobs)
        
        return results[:30] # Return top 30 matches
    except Exception as e:
        logger.error(f"Error in get_jobs: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch jobs. Please try again later.")

@app.post("/api/interview/start")
async def start_interview(data: Dict[str, str]):
    role_id = data.get("role_id")
    role = next((r for r in ROLES_DB if r.id == role_id), ROLES_DB[0] if ROLES_DB else None)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return await get_interview_engine().get_questions(role.title)

@app.post("/api/interview/evaluate")
async def evaluate_answer(data: Dict[str, str]):
    return await get_interview_engine().evaluate_answer(data.get("question", ""), data.get("answer", ""))

@app.get("/api/analytics/overview")
async def get_analytics_overview():
    return get_analytics_engine().get_overview()

@app.get("/api/analytics/districts")
async def get_district_analytics(state: Optional[str] = None):
    return get_analytics_engine().get_district_stats(state)

if __name__ == "__main__":
    # Production configuration: Run with host 0.0.0.0 for public access, reload=True for development
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True, workers=1)
