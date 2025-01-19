from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections
active_connections = []

async def process_text(text: str) -> str:
    """
    Process the received text. Replace this with your actual processing logic.
    """
    await asyncio.sleep(1)  # Simulate processing time
    return f"Processed: {text.upper()}"

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            
            try:
                # Process the received text
                processed_result = await process_text(data)
                
                # Send response back to client
                response = {
                    "status": "success",
                    "data": processed_result
                }
                await websocket.send_json(response)
                
            except Exception as e:
                error_response = {
                    "status": "error",
                    "message": str(e)
                }
                await websocket.send_json(error_response)
                
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        # Remove connection when client disconnects
        if websocket in active_connections:
            active_connections.remove(websocket)

# Regular HTTP endpoint for health check
@app.get("/")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)