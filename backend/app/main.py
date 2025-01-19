from fastapi import FastAPI
from app.websocket import websocket_endpoint
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Import and include WebSocket routes
app.include_router(websocket_endpoint)