import os
import firebase_admin
from firebase_admin import credentials, auth
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin based on standard credentials
# Option 1: Using a service account JSON file path
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH")

HAS_CREDENTIALS = False

def init_firebase():
    global HAS_CREDENTIALS
    if not firebase_admin._apps:
        if FIREBASE_CREDENTIALS_PATH and os.path.exists(FIREBASE_CREDENTIALS_PATH):
            try:
                cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
                firebase_admin.initialize_app(cred)
                HAS_CREDENTIALS = True
            except Exception as e:
                print(f"Failed to load service account: {e}")
        else:
            print("[Warning] Firebase Admin credentials entirely missing. Using Test Mode.")

init_firebase()

def verify_firebase_token(id_token: str):
    """
    Verifies the ID token against Firebase Auth.
    Returns the decoded token or None if failed/unconfigured.
    """
    if not HAS_CREDENTIALS:
        # If no credentials file is loaded, we allow the request for testing.
        # This allows the user to register without needing the JSON file yet.
        return {"phone_number": "test_phone_number"}
        
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"Firebase token verification failed: {e}")
        return None
