from ml_models.resume_scorer import LocalResumeScorer
from typing import List, Dict, Any
from .services.gemini_service import gemini_service

class ResumeScorer:
    def __init__(self, api_key: str = None):
        self.scorer = LocalResumeScorer()

    async def score_resume(self, resume_text: str, target_role: str = None) -> Dict[str, Any]:
        # Get local analysis first as a base
        local_analysis = self.scorer.analyze(resume_text)
        
        # Enhance with Gemini if available
        prompt = f"""
        Analyze this resume for the target role: {target_role if target_role else 'General'}.
        
        Resume Text:
        {resume_text}
        
        Provide your analysis in JSON format with the following keys:
        - overall_score: (0-100)
        - keyword_match: (0-100)
        - strengths: [list of strengths]
        - missing_keywords: [list of missing keywords or skills]
        - qualitative_feedback: [detailed suggestions for improvement]
        
        ONLY return the JSON object.
        """
        
        ai_response = await gemini_service.generate_ai_response(prompt)
        if ai_response:
            try:
                ai_data = gemini_service.parse_json_response(ai_response)
                return {
                    "overall_score": ai_data.get("overall_score", local_analysis["score"]),
                    "keyword_match": ai_data.get("keyword_match", local_analysis["score"] - 5),
                    "section_analysis": local_analysis.get("section_analysis", []),
                    "suggestions": [ai_data.get("qualitative_feedback")] if isinstance(ai_data.get("qualitative_feedback"), str) else ai_data.get("qualitative_feedback", local_analysis["feedback"]),
                    "strengths": ai_data.get("strengths", local_analysis.get("strengths", ["Clear structure"])),
                    "extracted_skills": local_analysis["skills"],
                    "missing_keywords": ai_data.get("missing_keywords", ["Review learning roadmap for suggestions"])
                }
            except Exception as e:
                print(f"Error parsing Gemini response for resume: {e}")
        
        # Fallback to local analysis
        return {
            "overall_score": local_analysis["score"],
            "keyword_match": local_analysis["score"] - 5,
            "section_analysis": local_analysis.get("section_analysis", []),
            "suggestions": local_analysis["feedback"],
            "strengths": local_analysis.get("strengths", ["Clear structure"]),
            "extracted_skills": local_analysis["skills"],
            "missing_keywords": ["Review learning roadmap for suggestions"]
        }
