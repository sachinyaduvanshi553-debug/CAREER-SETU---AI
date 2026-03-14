from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ---- Configuration ----
PORT = int(os.getenv("PORT", 8000))
ALLOWED_ORIGINS_STR = os.getenv("ALLOWED_ORIGINS", "*")
ALLOWED_ORIGINS: List[str] = (
    ["*"] if ALLOWED_ORIGINS_STR == "*"
    else [o.strip() for o in ALLOWED_ORIGINS_STR.split(",")]
)

from .skill_extractor import SkillExtractor
from .skill_gap_analyzer import SkillGapAnalyzer
from .career_recommender import CareerRecommender
from .roadmap_generator import RoadmapGenerator
from .resume_scorer import ResumeScorer
from .interview_engine import InterviewEngine
from .analytics_engine import AnalyticsEngine
from .models import UserProfile, JobRole, ResumeAnalysis, SkillGapReport

app = FastAPI(title="SkillBridge AI API")

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

# Initialize engines
extractor = SkillExtractor()
gap_analyzer = SkillGapAnalyzer()
# Mock data for engines initialization
# Enhanced Data Models for AI Intelligence
MOCK_ROLES = [
    JobRole(id="1", title="Full Stack Developer", category="Web Development", requiredSkills=["JavaScript", "React", "Node.js", "MongoDB", "Tailwind CSS"], avgSalary="₹8-22 LPA", demandLevel="Very High", growth="+25%", description="Architect and build scalable web applications using modern stacks."),
    JobRole(id="2", title="Data Scientist", category="Data Science", requiredSkills=["Python", "Pandas", "PyTorch", "Scikit-learn", "SQL"], avgSalary="₹12-35 LPA", demandLevel="High", growth="+35%", description="Leverage machine learning and statistical modeling to solve complex business problems."),
    JobRole(id="3", title="DevOps Engineer", category="Infrastructure", requiredSkills=["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"], avgSalary="₹10-25 LPA", demandLevel="High", growth="+40%", description="Bridge the gap between development and operations with automated infrastructure."),
    JobRole(id="4", title="UI/UX Designer", category="Design", requiredSkills=["Figma", "Adobe XD", "User Research", "Prototyping"], avgSalary="₹6-18 LPA", demandLevel="Medium", growth="+15%", description="Create user-centric designs and intuitive interfaces.")
]

MOCK_COURSES = [
    {"id": "c1", "title": "Advanced Python Patterns", "skill": "Python", "platform": "Coursera", "url": "https://coursera.org", "duration": "4 weeks", "rating": "4.8", "language": "English", "price": "Standard"},
    {"id": "c2", "title": "React Performance Masterclass", "skill": "React", "platform": "Udemy", "url": "https://udemy.com", "duration": "6 weeks", "rating": "4.9", "language": "English", "price": "₹499"},
    {"id": "c3", "title": "Kubernetes in Production", "skill": "Kubernetes", "platform": "edX", "url": "https://edx.org", "duration": "8 weeks", "rating": "4.7", "language": "English", "price": "Professional"},
    {"id": "c4", "title": "Generative AI Fundamentals", "skill": "AI", "platform": "Google Cloud", "url": "https://cloud.google.com", "duration": "2 weeks", "rating": "5.0", "language": "English", "price": "Free"}
]

MOCK_DISTRICTS = [
    {"state": "Karnataka", "district": "Bangalore", "totalWorkers": 450000, "trainedWorkers": 180000, "placedWorkers": 145000, "trainingCenters": 120, "topSkillGaps": ["GenAI", "Cloud Native"], "demandRoles": ["Software Engineer", "Cloud Architect"]},
    {"state": "Maharashtra", "district": "Pune", "totalWorkers": 320000, "trainedWorkers": 110000, "placedWorkers": 95000, "trainingCenters": 85, "topSkillGaps": ["Automotive Tech", "EV Engineering"], "demandRoles": ["Mechanical Engineer", "Embedded Systems Dev"]}
]

career_recommender = CareerRecommender(MOCK_ROLES)
roadmap_generator = RoadmapGenerator(MOCK_COURSES)
resume_scorer = ResumeScorer()
interview_engine = InterviewEngine()
analytics_engine = AnalyticsEngine(MOCK_DISTRICTS)

@app.get("/")
async def root():
    return {"message": "Welcome to SkillBridge AI API"}

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "SkillBridge AI API"}

# Auth & Profile
@app.post("/api/auth/register")
async def register(profile: UserProfile):
    # In real app, save to DB
    return {"message": "User registered successfully", "user": profile}

@app.post("/api/auth/login")
async def login(credentials: Dict[str, str]):
    return {"access_token": "mock_token", "token_type": "bearer"}

@app.get("/api/profile")
async def get_profile():
    return {
        "name": "Sachin Sharma",
        "email": "sachin@example.com",
        "skills": ["React", "JavaScript", "Python"],
        "location": "Bangalore"
    }

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
        text = content.decode("utf-8", errors="ignore")
        
    if not text.strip():
        raise HTTPException(status_code=400, detail="Uploaded file is empty or unreadable.")
        
    print(f"Analyzing resume: {filename}")
    try:
        analysis = await resume_scorer.score_resume(text)
        print(f"Analysis completed successfully for {filename}")
        print(f"Analysis Result: {analysis}")
        return analysis
    except Exception as e:
        print(f"Error during resume analysis: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/skills/gap")
async def analyze_skill_gap(data: Dict[str, Any]):
    user_skills = data.get("user_skills", [])
    target_role_id = data.get("role_id")
    
    role = next((r for r in MOCK_ROLES if r.id == target_role_id), MOCK_ROLES[0])
    report = await gap_analyzer.analyze_gap(user_skills, role.requiredSkills)
    return report

@app.get("/api/career/recommend")
async def recommend_careers(skills: str):
    skill_list = skills.split(",")
    return await career_recommender.recommend(skill_list)

@app.get("/api/roadmap/{role_id}")
async def get_roadmap(role_id: str):
    role = next((r for r in MOCK_ROLES if r.id == role_id), MOCK_ROLES[0])
    # For demo, assuming these are missing skills
    return await roadmap_generator.generate(role.requiredSkills)

@app.get("/api/jobs")
async def get_jobs(location: Optional[str] = None):
    # Return mock jobs from matcher
    from .job_matcher import JobMatcher
    MOCK_JOBS = [{
        "id": "1",
        "title": "React Dev",
        "company": "Tech Corp",
        "location": "Bangalore",
        "state": "Karnataka",
        "skills": ["React", "JS"],
        "posted": "2 days ago",
        "applicants": 45,
        "type": "Full-time",
        "salary": "₹12-18 LPA",
        "description": "Looking for a seasoned React developer."
    }]
    matcher = JobMatcher(MOCK_JOBS)
    return matcher.match(["React"], location)

@app.post("/api/interview/start")
async def start_interview(data: Dict[str, str]):
    role_id = data.get("role_id")
    role = next((r for r in MOCK_ROLES if r.id == role_id), MOCK_ROLES[0])
    return await interview_engine.get_questions(role.title)

@app.post("/api/interview/evaluate")
async def evaluate_answer(data: Dict[str, str]):
    return await interview_engine.evaluate_answer(data.get("question", ""), data.get("answer", ""))

@app.get("/api/analytics/overview")
async def get_analytics_overview():
    return analytics_engine.get_overview()

@app.get("/api/analytics/districts")
async def get_district_analytics(state: Optional[str] = None):
    return analytics_engine.get_district_stats(state)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=False)
