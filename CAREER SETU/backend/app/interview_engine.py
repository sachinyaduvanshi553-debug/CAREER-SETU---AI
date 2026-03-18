from ml_models.interview_evaluation import LocalInterviewEvaluator
from typing import List, Dict, Any
import random
from .services.gemini_service import gemini_service

class InterviewEngine:
    def __init__(self, api_key: str = None):
        self.evaluator = LocalInterviewEvaluator()
        self.templates = {
            "Python": ["Explain Python decorators.", "What is the difference between list and tuple?", "How does memory management work in Python?"],
            "Java": ["What is JVM and how it works?", "Explain OOP concepts in Java.", "Difference between Interface and Abstract Class."],
            "React": ["What are React Hooks?", "Explain Virtual DOM.", "What is the difference between props and state?"],
            "General": ["Tell me about yourself.", "What are your greatest strengths?", "Why should we hire you?"]
        }

    async def get_questions(self, role: str) -> List[str]:
        # Try to get dynamic questions from Gemini
        prompt = f"""
        Generate 5 high-quality interview questions for a {role} position.
        The questions should be a mix of technical and behavioral.
        Return ONLY a JSON list of strings.
        Example: ["Question 1", "Question 2"]
        """
        
        ai_response = await gemini_service.generate_ai_response(prompt)
        if ai_response:
            try:
                questions = gemini_service.parse_json_response(ai_response)
                if isinstance(questions, list) and len(questions) > 0:
                    return questions
            except Exception as e:
                print(f"Error parsing Gemini response for questions: {e}")

        # Fallback to templates
        questions = []
        for skill, qs in self.templates.items():
            if skill.lower() in role.lower():
                questions.extend(qs)
        
        questions.extend(self.templates["General"])
        random.shuffle(questions)
        return questions[:5]

    async def evaluate_answer(self, question: str, answer: str) -> Dict[str, Any]:
        # Use Gemini for high-quality evaluation
        prompt = f"""
        Evaluate the following interview answer.
        
        Question: {question}
        User Answer: {answer}
        
        Provide the evaluation in JSON format with the following keys:
        - score: (0-100)
        - feedback: (Detailed feedback on the answer)
        - improvements: [List of specific points to improve]
        - ideal_answer: (A sample high-quality answer)
        
        ONLY return the JSON object.
        """
        
        ai_response = await gemini_service.generate_ai_response(prompt)
        if ai_response:
            try:
                ai_data = gemini_service.parse_json_response(ai_response)
                return {
                    "score": ai_data.get("score", 70),
                    "feedback": ai_data.get("feedback", "Good attempt."),
                    "improvements": ai_data.get("improvements", []),
                    "ideal_answer": ai_data.get("ideal_answer", "")
                }
            except Exception as e:
                print(f"Error parsing Gemini response for evaluation: {e}")

        # Fallback to local evaluator
        return self.evaluator.evaluate(answer, "This is a placeholder for ideal answer.")
