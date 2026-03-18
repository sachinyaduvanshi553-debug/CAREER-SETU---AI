import joblib
import os
import spacy
from typing import Dict, Any

class LocalResumeScorer:
    def __init__(self):
        models_dir = os.path.join(os.path.dirname(__file__), "../models")
        model_path = os.path.join(models_dir, "resume_scoring_model.joblib")
        try:
            self.model = joblib.load(model_path)
            print(f"Loaded resume scoring model from {model_path}")
        except Exception as e:
            print(f"Warning: Could not load resume scoring model: {e}")
            self.model = None

        try:
            self.nlp = spacy.load("en_core_web_sm")
            print("Loaded spacy model en_core_web_sm")
        except Exception as e:
            print(f"Warning: en_core_web_sm not found ({e}). Using blank 'en' model.")
            self.nlp = spacy.blank("en")

        from .skill_extractor import LocalSkillExtractor
        self.extractor = LocalSkillExtractor()

    def analyze(self, text: str) -> Dict[str, Any]:
        doc = self.nlp(text)
        
        # Feature extraction
        word_count = len(text.split())
        # Simplified section detection
        sections = ["experience", "education", "skills", "projects", "certifications"]
        section_count = sum(1 for s in sections if s in text.lower())
        has_links = 1 if ("http" in text or "www" in text) else 0
        
        # Skill count
        skills = self.extractor.extract_skills(text)
        skill_count = len(skills)
        
        # Predict score
        score = 75.0 # Default score
        if self.model:
            try:
                features = [[skill_count, section_count, has_links, word_count]]
                score = float(self.model.predict(features)[0])
            except Exception as e:
                print(f"Error during prediction: {e}")
        
        return {
            "score": round(score, 1),
            "skills": skills,
            "metrics": {
                "word_count": word_count,
                "section_count": section_count,
                "has_links": bool(has_links)
            },
            "section_analysis": self._analyze_sections(text),
            "feedback": self._generate_feedback(score, skill_count, section_count)
        }

    def _analyze_sections(self, text):
        text_lower = text.lower()
        sections = [
            {"section": "Contact Information", "keywords": ["phone", "email", "address", "linkedin", "github"]},
            {"section": "Professional Summary", "keywords": ["summary", "profile", "objective"]},
            {"section": "Work Experience", "keywords": ["experience", "employment", "history", "work"]},
            {"section": "Skills", "keywords": ["skills", "technologies", "competencies"]},
            {"section": "Education", "keywords": ["education", "university", "college", "degree"]}
        ]
        
        analysis = []
        for s in sections:
            found = any(k in text_lower for k in s["keywords"])
            analysis.append({
                "section": s["section"],
                "score": 100 if found else 0,
                "feedback": f"Great! {s['section']} found." if found else f"Missing {s['section']} section."
            })
        return analysis

    def _generate_feedback(self, score, skill_count, section_count):
        feedback = []
        if score < 70:
            feedback.append("Improve resume formatting and add more measurable achievements.")
        if skill_count < 5:
            feedback.append("Consider adding more technical skills relevant to your target role.")
        if section_count < 4:
            feedback.append("Ensure you have standard sections like Experience and Projects.")
        return feedback if feedback else ["Resume looks professional and complete."]
