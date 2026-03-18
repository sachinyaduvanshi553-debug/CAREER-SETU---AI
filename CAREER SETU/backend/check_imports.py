import sys
import os

# Add the current directory to sys.path to allow relative imports from app
sys.path.append(os.getcwd())

try:
    from app.skill_extractor import SkillExtractor
    print("SkillExtractor imported")
    from app.skill_gap_analyzer import SkillGapAnalyzer
    print("SkillGapAnalyzer imported")
    from app.career_recommender import CareerRecommender
    print("CareerRecommender imported")
    from app.roadmap_generator import RoadmapGenerator
    print("RoadmapGenerator imported")
    from app.resume_scorer import ResumeScorer
    print("ResumeScorer imported")
    from app.interview_engine import InterviewEngine
    print("InterviewEngine imported")
    from app.analytics_engine import AnalyticsEngine
    print("AnalyticsEngine imported")
    print("All imports successful")
except Exception as e:
    print(f"Import failed: {e}")
    import traceback
    traceback.print_exc()
