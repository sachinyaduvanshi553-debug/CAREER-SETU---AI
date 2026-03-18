import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# Training Data: 
# Features: [skill_count, section_count, has_links, word_count]
# Target: score (0-100)
DATA = [
    [10, 5, 1, 500, 85],
    [5, 4, 1, 300, 65],
    [2, 3, 0, 150, 40],
    [15, 6, 1, 800, 95],
    [8, 5, 0, 450, 75],
]

def train_scorer():
    df = pd.DataFrame(DATA, columns=['skill_count', 'section_count', 'has_links', 'word_count', 'score'])
    
    X = df.drop('score', axis=1)
    y = df['score']
    
    model = RandomForestRegressor(n_estimators=50)
    model.fit(X, y)
    
    output_path = os.path.join(os.path.dirname(__file__), "../models")
    if not os.path.exists(output_path):
        os.makedirs(output_path)
        
    joblib.dump(model, os.path.join(output_path, "resume_scoring_model.joblib"))
    print(f"Resume scoring model saved to {output_path}")

if __name__ == "__main__":
    train_scorer()
