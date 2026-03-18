from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any

class LocalSkillGapAnalyzer:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()

    def analyze(self, user_skills: List[str], target_skills: List[str]) -> Dict[str, Any]:
        if not target_skills:
            return {"matching_skills": [], "missing_skills": [], "readiness_score": 0, "status": "No target skills provided"}
            
        # Combine skills into text strings for semantic comparison
        user_text = " ".join(user_skills)
        target_text = " ".join(target_skills)
        
        # Calculate similarity
        tfidf = self.vectorizer.fit_transform([user_text, target_text])
        similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        
        # Literal matching for identifying missing skills
        user_skills_lower = [s.lower() for s in user_skills]
        matching = [s for s in target_skills if s.lower() in user_skills_lower]
        missing = [s for s in target_skills if s.lower() not in user_skills_lower]
        
        # We boost the similarity score if literal matches exist
        readiness_score = (similarity * 50) + (len(matching) / len(target_skills) * 50) if target_skills else 0
        
        return {
            "matching_skills": matching,
            "missing_skills": missing,
            "readiness_score": round(readiness_score, 1),
            "status": "Ready" if readiness_score > 80 else "Improving" if readiness_score > 50 else "Gap Identified"
        }
