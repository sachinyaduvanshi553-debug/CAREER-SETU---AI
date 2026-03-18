from typing import List, Dict, Any

class LocalRoadmapGenerator:
    def __init__(self):
        # Database of skill learning paths
        self.skill_paths = {
            "python": [
                "Week 1: Python Basics & Syntax",
                "Week 2: Data Structures & Functions",
                "Week 3: Advanced Topics (Generators, Decorators)",
                "Week 4: Project: Web Scraper / Data Analysis"
            ],
            "react": [
                "Week 1: JS Essentials & React Basics (Hooks)",
                "Week 2: Advanced Hooks & Context API",
                "Week 3: State Management (Redux/Zustand)",
                "Week 4: Project: E-commerce Frontend"
            ],
            "docker": [
                "Week 1: Containers vs VMs, Docker Install",
                "Week 2: Dockerfiles & Image Management",
                "Week 3: Docker Compose & Orchestration",
                "Week 4: CI/CD with Docker"
            ],
            "default": [
                "Week 1: Introduction and Fundamentals",
                "Week 2: Intermediate Concepts and Tools",
                "Week 3: Advanced Application and Best Practices",
                "Week 4: Final Project and Certification"
            ]
        }

    def generate(self, missing_skills: List[str]) -> List[Dict[str, Any]]:
        roadmaps = []
        for skill in missing_skills:
            skill_lower = skill.lower()
            path = self.skill_paths.get(skill_lower, self.skill_paths["default"])
            roadmaps.append({
                "skill": skill,
                "steps": path
            })
        return roadmaps
