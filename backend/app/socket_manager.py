import socketio
import logging
import json
from typing import Dict, Any, List
from datetime import datetime

logger = logging.getLogger(__name__)

# Create an Async Server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=True
)

# ASGI Application (mount this in main.py)
socket_app = socketio.ASGIApp(sio)

# Mapping of user_email -> socket_id (for targeted notifications)
user_sessions: Dict[str, str] = {}

@sio.event
async def connect(sid, environ):
    logger.info(f"Socket connected: {sid}")

@sio.event
async def authenticate(sid, data):
    """
    Authenticate a socket connection with a user email/token.
    { "email": "user@example.com" }
    """
    email = data.get("email")
    if email:
        user_sessions[email] = sid
        logger.info(f"User {email} authenticated on socket {sid}")
        await sio.emit("authenticated", {"status": "success"}, room=sid)

@sio.event
async def disconnect(sid):
    # Remove from session mapping
    for email, session_id in list(user_sessions.items()):
        if session_id == sid:
            del user_sessions[email]
            logger.info(f"User {email} disconnected")
            break
    logger.info(f"Socket disconnected: {sid}")

async def notify_user(email: str, event: str, data: Any):
    """Utility to send a targeted real-time notification."""
    sid = user_sessions.get(email)
    if sid:
        await sio.emit(event, data, room=sid)
        logger.info(f"Notified {email} about {event}")
    else:
        logger.warning(f"Could not notify {email}: No active socket session")

async def broadcast_worker_update(event: str, data: Any):
    """Broadcast work-related updates to all connected workers."""
    # In a real app we might filter by role=worker, but for now broadcast to all
    await sio.emit(event, data)
