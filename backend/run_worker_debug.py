import os
import sys
import logging

# Ensure src path is in pythonpath
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure Logging to Stdout
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

if __name__ == "__main__":
    print("DEBUG: Starting Worker Debug Script...")
    try:
        from app import worker
        print("DEBUG: Worker imported. Starting loop...")
        worker.start_loop()
    except Exception as e:
        print(f"CRITICAL WORKER ERROR: {e}")
        import traceback
        traceback.print_exc()
