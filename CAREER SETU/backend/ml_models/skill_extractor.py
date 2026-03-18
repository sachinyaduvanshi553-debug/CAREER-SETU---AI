import spacy
import os

class LocalSkillExtractor:
    def __init__(self):
        model_path = os.path.join(os.path.dirname(__file__), "../models/skill_extractor_model")
        try:
            self.nlp = spacy.load(model_path)
            print(f"Loaded local skill extraction model from {model_path}")
        except:
            print("Warning: Local skill extraction model not found. Using blank model.")
            self.nlp = spacy.blank("en")

    def extract_skills(self, text: str):
        doc = self.nlp(text)
        skills = [ent.text for ent in doc.ents if ent.label_ == "SKILL"]
        # Basic keyword matching as fallback
        if not skills:
            common_skills = ["python", "java", "react", "node", "sql", "aws", "docker"]
            skills = [s for s in common_skills if s.lower() in text.lower()]
        return list(set(skills))
