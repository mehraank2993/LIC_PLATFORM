import os
import json
import logging
import sys

# Add backend to path to import app modules
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    from google_auth_oauthlib.flow import InstalledAppFlow
except ImportError:
    try:
        from google.auth.oauthlib.flow import InstalledAppFlow
    except ImportError:
        print("Error: google-auth-oauthlib not installed.")
        sys.exit(1)

from app.database import save_gmail_config

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ReAuth")

SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.readonly'
]

CREDENTIALS_PATH = 'credentials.json'
if not os.path.exists(CREDENTIALS_PATH):
    CREDENTIALS_PATH = os.path.join('backend', 'credentials.json')

if not os.path.exists(CREDENTIALS_PATH):
    print(f"Error: credentials.json not found in root or backend/ directory.")
    sys.exit(1)

def reauthenticate():
    print(f"Starting OAuth flow using {CREDENTIALS_PATH}...")
    flow = InstalledAppFlow.from_client_secrets_file(
        CREDENTIALS_PATH, SCOPES)
    
    # Run local server for auth
    # Get the authorization URL and write it to file
    auth_url, _ = flow.authorization_url(prompt='consent')
    print(f"Please visit this URL to authorize this application: {auth_url}")
    with open('auth_link.txt', 'w') as f:
        f.write(auth_url)
        
    creds = flow.run_local_server(port=0)
    
    print("Authentication successful!")
    
    # Get the email address from the credentials (api call)
    from googleapiclient.discovery import build
    service = build('gmail', 'v1', credentials=creds)
    profile = service.users().getProfile(userId='me').execute()
    email_address = profile['emailAddress']
    print(f"Authenticated as: {email_address}")
    
    # Prepare credentials dictionary for DB
    creds_dict = {
        "token": creds.token,
        "refresh_token": creds.refresh_token,
        "token_uri": creds.token_uri,
        "client_id": creds.client_id,
        "client_secret": creds.client_secret,
        "scopes": creds.scopes,
        "expiry": creds.expiry.isoformat() if creds.expiry else None
    }
    
    # Save to Database
    print("Saving to database...")
    success = save_gmail_config(email_address, 'oauth', json.dumps(creds_dict))
    
    if success:
        print(f"Successfully updated credentials for {email_address} in database.")
    else:
        print("Failed to save credentials to database.")

if __name__ == "__main__":
    reauthenticate()
