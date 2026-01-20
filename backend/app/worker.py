import time
import logging
from app.database import get_pending_email, update_email_analysis

# Setup Logging
logger = logging.getLogger("Worker")

def process_email():
    # Lazy import to prevent blocking main process startup
    from app.privacy import redact_pii
    from app.brain import analyze_email
    
    email = get_pending_email()
    if not email:
        return False

    logger.info(f"Processing Email ID: {email['id']} - Subject: {email['subject']}")
    
    try:
        # Step 1: Redaction
        original_body = email['body_original']
        redacted_body = redact_pii(original_body)
        logger.info("Redaction complete.")
        
        # Step 2: AI Analysis (RAG)
        analysis_result = analyze_email(redacted_body)
        
        # Step 3: Save results
        update_email_analysis(
            email_id=email['id'],
            redacted_body=redacted_body,
            analysis=analysis_result, # Stores full JSON in analysis column
            suggested_action=analysis_result.get('suggested_action', 'Review'),
            status='COMPLETED'
        )
        logger.info("Analysis saved and email marked COMPLETED.")
        return True

    except Exception as e:
        logger.error(f"Failed to process email {email['id']}: {e}")
        return False

def start_loop():
    logger.info("Starting ETL Worker...")
    while True:
        try:
            worked = process_email()
            if not worked:
                time.sleep(2) # Idle wait
        except Exception as e:
            logger.error(f"Worker Loop Error: {e}")
            time.sleep(5)

if __name__ == '__main__':
    start_loop()
