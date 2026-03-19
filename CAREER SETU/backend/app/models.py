from pydantic import BaseModel
from typing import List, Optional

class UserProfile(BaseModel):
    name: str
    email: str
    phone: str
    location: str
    education: str
    skills: List[str]
    interests: List[str]
    bio: Optional[str] = None

class UserRegistration(UserProfile):
    password: str
    otp: str

class SendOTPRequest(BaseModel):
    phone: str

class UserLogin(BaseModel):
    email: str
    password: str

class JobRole(BaseModel):
    id: str
    title: str
    category: str
    requiredSkills: List[str]
    avgSalary: str
    demandLevel: str
    growth: str
    description: str

class ResumeAnalysis(BaseModel):
    overall_score: int
    keyword_match: int
    extracted_skills: List[str]
    missing_keywords: List[str]
    suggestions: List[str]
    strengths: List[str]

class SkillGapReport(BaseModel):
    matching_skills: List[str]
    missing_skills: List[str]
    readiness_score: float
    status: str
