import logging
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig

# Setup Logging
logger = logging.getLogger("Privacy")

class PIIRedactor:
    def __init__(self):
        self.analyzer = AnalyzerEngine()
        self.anonymizer = AnonymizerEngine()
        
    def redact(self, text: str) -> str:
        if not text:
            return ""
            
        try:
            # Analyze text for PII
            results = self.analyzer.analyze(text=text, entities=["PHONE_NUMBER", "EMAIL_ADDRESS", "PERSON", "CREDIT_CARD"], language='en')
            
            # Redact identified PII
            anonymized_result = self.anonymizer.anonymize(
                text=text,
                analyzer_results=results,
                operators={
                    "DEFAULT": OperatorConfig("replace", {"new_value": "[REDACTED]"})
                }
            )
            
            return anonymized_result.text
        except Exception as e:
            logger.error(f"Redaction failed: {e}")
            return text # Fail safe: return original (better than crashing, though risky)

# Singleton instance
redactor = PIIRedactor()

def redact_pii(text: str) -> str:
    return redactor.redact(text)
