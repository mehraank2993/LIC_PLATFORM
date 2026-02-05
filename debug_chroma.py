import os
os.environ["ANONYMIZED_TELEMETRY"] = "False"
import sys
import sqlite3
print(f"SQLite Version: {sqlite3.sqlite_version}")

print("Importing chromadb...")
try:
    import chromadb
    print(f"PASS: chromadb version {chromadb.__version__}")
except Exception as e:
    print(f"FAIL: {e}")

print("Creating Client...")
try:
    client = chromadb.PersistentClient(path="./backend/data/chroma_db")
    print("PASS: Client created")
    print(f"Heartbeat: {client.heartbeat()}")
except Exception as e:
    print(f"FAIL: {e}")
