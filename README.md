<<<<<<< HEAD
# LIC Email Intelligence Platform

A local, on-premise AI platform for processing and analyzing emails securely.

## Features
- **Real-time Ingestion**: Polls Gmail for unread emails.
- **Privacy First**: Redacts PII (Emails, Phones) before AI analysis.
- **Local AI**: Uses Ollama (Llama 3) for intelligence.
- **Dark Mode Dashboard**: Live monitoring of pipeline health and email stats.

## Folder Structure
- `backend/`: FastAPI, SQLite, Workers.
- `frontend/`: React, Vite Dashboard.

## Setup
1. **Backend**:
   - `cd backend`
   - `pip install -r requirements.txt`
   - Add `credentials.json` (Gmail API) to `backend/`.
   - Run: `python run.py`

2. **Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Requirements
- Python 3.8+
- Node.js
- Ollama (running locally on port 11434)
=======
# LIC_PLATFORM
>>>>>>> 5da2d3097b65e72a827fd49a7ff260eec099eb34
