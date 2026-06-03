from urllib import response

from click import prompt

import socketio
from fastapi import FastAPI
from pydantic import BaseModel
import subprocess
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv(
    "GEMINI_API_KEY"
)


from google import genai

# genai.configure(
#     api_key=GEMINI_API_KEY
# )
client = genai.Client(

    api_key=GEMINI_API_KEY

)



class AIRequest(BaseModel):
    question: str
    code: str

# class AIRequest(BaseModel):
#     question: str
#     code: str


def ensure_room(room):
    if room not in room_data:
        room_data[room] = {
            "code": "",
            "notes": "",
            "chat": []
        }

# =========================
# In-Memory Storage
# =========================

room_data = {}
usernames = {}
user_rooms = {}
room_users = {}
room_files = {}

# =========================
# Socket.IO
# =========================

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

# =========================
# Socket Events
# =========================

@sio.event
async def update_file(sid, data):

    room = user_rooms.get(sid)

    if room not in room_files:
        return

    for file in room_files[room]:

        if file["id"] == data["id"]:

            file["content"] = data["content"]

    await sio.emit(
        "file_updated",
        data,
        room=room,
        skip_sid=sid
    )

@sio.event
async def create_file(sid, file):

    room = user_rooms.get(sid)

    if not room:
        return

    if room not in room_files:
        room_files[room] = []

    room_files[room].append(file)

    await sio.emit(
        "file_created",
        file,
        room=room
    )

@sio.event
async def connect(sid, environ):
    print("Connected:", sid)

@sio.event
async def disconnect(sid):

    room = user_rooms.get(sid)
    username = usernames.get(sid)

    print("Disconnected:", sid)

    if room and username:

        await sio.emit(
            "system_message",
            {
                "user": "System",
                "text": f"{username} left the room"
            },
            room=room
        )

        if room in room_users:

            if username in room_users[room]:
                room_users[room].remove(username)

            await sio.emit(
                "users_update",
                room_users[room],
                room=room
            )

    user_rooms.pop(sid, None)
    usernames.pop(sid, None)

@sio.event
async def set_username(sid, username):

    usernames[sid] = username

    print(f"{sid} => {username}")

@sio.event
async def join_room(sid, room):
    

    await sio.enter_room(sid, room)

    user_rooms[sid] = room

    username = usernames.get(sid)

    if room not in room_users:
        room_users[room] = []

    if username and username not in room_users[room]:
        room_users[room].append(username)

    await sio.emit(
        "users_update",
        room_users[room],
        room=room
    )
    await sio.emit(
    "system_message",
    {
        "user": "System",
        "text": f"{username} joined the room"
    },
    room=room
)

    if room in room_data:
        await sio.emit(
            "room_state",
            room_data[room],
            to=sid
        )

    print("ROOM USERS =", room_users)
    print(f"{sid} joined {room}")


@sio.event
async def code_change(sid, code):

    room = user_rooms.get(sid)

    if not room:
        return

    if room not in room_data:
        room_data[room] = {
            "code": "",
            "notes": "",
            "chat": []
        }

    room_data[room]["code"] = code
    ensure_room(room)

    await sio.emit(
        "code_update",
        code,
        room=room,
        skip_sid=sid
    )

@sio.event
async def notes_change(sid, notes):

    room = user_rooms.get(sid)

    if not room:
        return

    if room not in room_data:
        room_data[room] = {
            "code": "",
            "notes": "",
            "chat": []
        }

    ensure_room(room)
    room_data[room]["notes"] = notes

    await sio.emit(
        "notes_update",
        notes,
        room=room,
        skip_sid=sid
    )

@sio.event
async def send_message(sid, data):

    room = user_rooms.get(sid)

    if not room:
        return

    ensure_room(room)
    room_data[room]["chat"].append(data)

    print("MESSAGE RECEIVED:", data)

    await sio.emit(
        "receive_message",
        data,
        room=room
    )

@sio.event
async def typing(sid):

    room = user_rooms.get(sid)
    username = usernames.get(sid)

    if room and username:

        await sio.emit(
            "user_typing",
            username,
            room=room,
            skip_sid=sid
        )
@sio.event
async def cursor_change(sid, data):

    room = user_rooms.get(sid)
    username = usernames.get(sid)

    print(
    "CURSOR:",
    username,
    data["line"],
    data["column"]
)         

    if room and username:

        await sio.emit(
            "cursor_update",
            {
                "user": username,
                "line": data["line"],
                "column": data["column"]
            },
            room=room,
            skip_sid=sid
        )
           

# =========================
# FastAPI
# =========================

api = FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str

@api.post("/run")
async def run_code(data: CodeRequest):

    try:
        result = subprocess.run(
            ["python3", "-c", data.code],
            capture_output=True,
            text=True,
            timeout=5
        )

        return {
            "stdout": result.stdout,
            "stderr": result.stderr
        }

    except Exception as e:
        return {
            "error": str(e)
        }
@api.post("/ask-ai")
async def ask_ai(
    data: AIRequest
):

    prompt = f"""

Answer directly as a senior software engineer would,

Code:

{data.code}

Question:

{data.question}


prefer concise code snippets,Avoid unnecessary user input handling.


"""

    # response = model.generate_content(
    #     prompt
    # )
    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt
)

    return {
        "answer": response.text
    }    
# @api.post("/ask-ai")
# async def ask_ai(
#     data: AIRequest
# ):

#     return {
#         "answer":
#         f"You asked: {data.question}"
#     }    

# =========================
# Combined App
# =========================

app = socketio.ASGIApp(
    sio,
    other_asgi_app=api
)