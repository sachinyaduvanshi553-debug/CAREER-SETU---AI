from ml_models.roadmap_generator import LocalRoadmapGenerator
from typing import List, Dict, Any
from .services.gemini_service import gemini_service

class RoadmapGenerator:
    def __init__(self, courses: List[Dict[str, Any]], api_key: str = None):
        self.courses = courses
        self.generator = LocalRoadmapGenerator()

    async def generate(self, missing_skills: List[str]) -> List[Dict[str, Any]]:
        if not missing_skills:
            return []
            
        # Try to get a high-quality roadmap from Gemini
        prompt = f"""
        Generate a personalized 30-60-90 day career roadmap for someone missing these skills: {', '.join(missing_skills)}.
        
        Provide the roadmap in JSON format as a list of 3 phases:
        - title: (e.g., "Phase 1: Foundation (Days 1-30)")
        - skills: [List of skills focused on in this phase]
        - goals: [List of specific learning goals]
        - courses: [Leave this as an empty list for now]
        
        ONLY return the JSON list.
        """
        
        ai_response = await gemini_service.generate_ai_response(prompt)
        phases = []
        if ai_response:
            try:
                phases = gemini_service.parse_json_response(ai_response)
                # Ensure it's a list and has necessary structure
                if isinstance(phases, list):
                    # Attach courses from our local database to the AI-generated phases
                    for phase in phases:
                        phase_skills = [s.lower() for s in phase.get("skills", [])]
                        for course in self.courses:
                            if any(s in course["skill"].lower() or course["skill"].lower() in s for s in phase_skills):
                                if "courses" not in phase:
                                    phase["courses"] = []
                                phase["courses"].append(course)
                    return phases
            except Exception as e:
                print(f"Error parsing Gemini response for roadmap: {e}")

        # Fallback to local distribution
        local_roadmaps = self.generator.generate(missing_skills)
        phases = [
            {"title": "Phase 1: Foundation (Days 1-30)", "skills": [], "goals": [], "courses": []},
            {"title": "Phase 2: Intermediate (Days 31-60)", "skills": [], "goals": [], "courses": []},
            {"title": "Phase 3: Mastery (Days 61-90)", "skills": [], "goals": [], "courses": []}
        ]
        
        for i, roadmap in enumerate(local_roadmaps):
            phase_idx = i % 3
            phases[phase_idx]["skills"].append(roadmap["skill"])
            phases[phase_idx]["goals"].extend(roadmap["steps"][:2])
            
            for course in self.courses:
                if roadmap["skill"].lower() in course["skill"].lower() or course["skill"].lower() in roadmap["skill"].lower():
                    phases[phase_idx]["courses"].append(course)
                    break
                    
        return [p for p in phases if p["skills"]]
