import logging
import sys
import os

# Ensure backend modules can be imported
sys.path.append(os.path.join(os.getcwd(), 'backend'))

# Setup verbose logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("DebugRAG")

print("DEBUG: Importing app.rag...")
try:
    from app import rag
    print("DEBUG: Successfully imported app.rag")
except Exception as e:
    print(f"ERROR: Failed to import app.rag: {e}")
    sys.exit(1)

print("DEBUG: Setting up embedding function...")
try:
    embed_fn = rag.get_embedding_function()
    print(f"DEBUG: Embedding function created: {embed_fn}")
    # Test embedding function connectivity
    print("DEBUG: Testing embedding function with sample text...")
    sample_embed = embed_fn.embed_query("test")
    print(f"DEBUG: Sample embedding generated (length: {len(sample_embed)})")
except Exception as e:
    print(f"ERROR: Embedding function check failed: {e}")
    sys.exit(1)

print("DEBUG: accessing vector store...")
try:
    vector_store = rag.get_vector_store()
    print("DEBUG: Vector store initialized")
    
    print("DEBUG: Checking existing documents...")
    existing = vector_store.get(limit=1)
    print(f"DEBUG: Found {len(existing['ids']) if existing else 0} existing docs")
except Exception as e:
    print(f"ERROR: Vector store check failed: {e}")
    sys.exit(1)

print("DEBUG: Running ingest_docs()...")
try:
    rag.ingest_docs()
    print("DEBUG: ingest_docs() completed successfully")
except Exception as e:
    print(f"ERROR: ingest_docs() failed: {e}")
    import traceback
    traceback.print_exc()

print("DEBUG: Script finished.")
