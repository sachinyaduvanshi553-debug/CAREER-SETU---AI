from ml_models.job_matching import LocalJobMatcher
from typing import List, Dict, Any

class JobMatcher:
    def __init__(self, job_listings: List[Dict[str, Any]]):
        self.listings = job_listings
        self.matcher = LocalJobMatcher()

    def match(self, user_skills: List[str], location: str = None) -> List[Dict[str, Any]]:
        user_text = " ".join(user_skills)
        job_texts = [f"{j['title']} {' '.join(j['skills'])} {j['description']}" for j in self.listings]
        
        # Filter by location first if provided
        filtered_indices = []
        for i, job in enumerate(self.listings):
            if location:
                if location.lower() in job["location"].lower() or location.lower() in job.get("state", "").lower():
                    filtered_indices.append(i)
            else:
                filtered_indices.append(i)
        
        if not filtered_indices:
            return []
            
        # Match using local semantic model
        match_results = self.matcher.match(user_text, [job_texts[i] for i in filtered_indices])
        
        results = []
        for res in match_results:
            original_index = filtered_indices[res["index"]]
            job = self.listings[original_index]
            results.append({
                **job,
                "match_score": round(res["score"] * 100, 1)
            })
            
        return results
