import os.path
import pickle
import time
import base64
import logging
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from datetime import datetime

from app.database import save_email, init_db

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("Ingestor")

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/gmail.modify']
CREDENTIALS_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'credentials.json')
TOKEN_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'token.pickle')

def get_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except Exception as e:
                logger.error(f"Error refreshing token: {e}")
                os.remove(TOKEN_FILE)
                return None
        else:
            if not os.path.exists(CREDENTIALS_FILE):
                logger.error("credentials.json not found! Please place it in the backend root.")
                return None
            try:
                flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
                creds = flow.run_local_server(port=0)
            except Exception as e:
                logger.error(f"Failed to auth: {e}")
                return None
        with open(TOKEN_FILE, 'wb') as token:
            pickle.dump(creds, token)

    try:
        service = build('gmail', 'v1', credentials=creds)
        return service
    except Exception as e:
        logger.error(f"Failed to build service: {e}")
        return None

def decode_body(payload):
    body = ""
    if 'parts' in payload:
        for part in payload['parts']:
            if part['mimeType'] == 'text/plain':
                data = part['body'].get('data')
                if data:
                    body += base64.urlsafe_b64decode(data).decode()
    elif 'body' in payload:
        data = payload['body'].get('data')
        if data:
            body += base64.urlsafe_b64decode(data).decode()
    return body

def fetch_and_save_emails(service):
    try:
        results = service.users().messages().list(userId='me', q='is:unread').execute()
        messages = results.get('messages', [])

        if not messages:
            return

        logger.info(f"Found {len(messages)} unread messages.")

        for msg in messages:
            msg_id = msg['id']
            try:
                message = service.users().messages().get(userId='me', id=msg_id).execute()
                payload = message['payload']
                headers = payload.get('headers', [])
                
                subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '(No Subject)')
                sender = next((h['value'] for h in headers if h['name'] == 'From'), '(Unknown)')
                body = decode_body(payload)
                internal_date = int(message['internalDate']) / 1000
                received_at = datetime.fromtimestamp(internal_date)

                if save_email(msg_id, sender, subject, body, received_at):
                    logger.info(f"Saved email: {subject}")
                    service.users().messages().modify(userId='me', id=msg_id, body={'removeLabelIds': ['UNREAD']}).execute()
                else:
                    logger.warning(f"Duplicate email skipped: {msg_id}")
                    
            except Exception as e:
                logger.error(f"Error processing message {msg_id}: {e}")

    except Exception as e:
        logger.error(f"An error occurred during fetch: {e}")

def start_loop():
    logger.info("Starting Ingestor Service...")
    init_db()
    while True:
        service = get_service()
        if service:
            fetch_and_save_emails(service)
        else:
            logger.warning("Gmail service not available. Retrying in 10s...")
            time.sleep(5) 
        time.sleep(5)

if __name__ == '__main__':
    start_loop()
