# from pymongo import MongoClient
# import os
# from dotenv import load_dotenv

# load_dotenv()

# client = MongoClient(
#     os.getenv("MONGO_URI")
# )

# db = client["collabcode"]

# rooms = db["rooms"]

from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(
    os.getenv("MONGO_URI")
)

db = client["collabcode"]

rooms_collection = db["rooms"]