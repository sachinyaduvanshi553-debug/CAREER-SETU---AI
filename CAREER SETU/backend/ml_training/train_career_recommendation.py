import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
import joblib
import os

# Training Data
DATA = [
    {"skills": ["Python", "Pandas", "PyTorch", "SQL"], "role": "Data Scientist"},
    {"skills": ["JavaScript", "React", "Node.js", "Tailwind CSS"], "role": "Full Stack Developer"},
    {"skills": ["Docker", "Kubernetes", "AWS", "Terraform"], "role": "DevOps Engineer"},
    {"skills": ["Figma", "Adobe XD", "User Research"], "role": "UI/UX Designer"},
    {"skills": ["Python", "Django", "PostgreSQL", "Docker"], "role": "Backend Developer"},
    {"skills": ["React Native", "Swift", "Kotlin"], "role": "Mobile App Developer"},
]

def train_classifier():
    df = pd.DataFrame(DATA)
    mlb = MultiLabelBinarizer()
    
    X = mlb.fit_transform(df['skills'])
    y = df['role']
    
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X, y)
    
    output_path = os.path.join(os.path.dirname(__file__), "../models")
    if not os.path.exists(output_path):
        os.makedirs(output_path)
        
    joblib.dump(model, os.path.join(output_path, "career_recommendation_model.joblib"))
    joblib.dump(mlb, os.path.join(output_path, "skills_binarizer.joblib"))
    
    print(f"Career prediction model and binarizer saved to {output_path}")

if __name__ == "__main__":
    train_classifier()
