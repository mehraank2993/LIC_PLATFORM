import sys
try:
    from google_auth_oauthlib.flow import InstalledAppFlow
    print("SUCCESS: from google_auth_oauthlib.flow import InstalledAppFlow")
except ImportError as e:
    print(f"FAIL: from google_auth_oauthlib.flow import InstalledAppFlow - {e}")

try:
    import google.auth.oauthlib.flow
    print("SUCCESS: import google.auth.oauthlib.flow")
except ImportError as e:
    print(f"FAIL: import google.auth.oauthlib.flow - {e}")
