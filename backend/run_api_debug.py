import uvicorn
import os
import sys

# Ensure src path is in pythonpath
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("DEBUG: Starting API Debug Script...")
    try:
        from app.main import app
        print("DEBUG: App imported successfully.")
        uvicorn.run(app, host="0.0.0.0", port=8000)
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        import traceback
        traceback.print_exc()
