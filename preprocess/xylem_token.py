import requests
import datetime
from env import CLIENT_ID, CLIENT_SECRET

AUTH_URL = (
    "https://cloud.xylem.com/xcloud/auth/realms/xcloud/protocol/openid-connect/token"
)

token = None
token_expires_at = None

def _get_token():
    global token, token_expires_at
    current_seconds = int(datetime.datetime.now().timestamp())
    resp = requests.post(
        AUTH_URL,
        data={
            "grant_type": "client_credentials",
            "scope": "openid",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        },
    )
    if resp.status_code != 200:
        raise ValueError(f"Failed to obtain token: {resp.text}")
    
    if ("access_token" not in resp.json()) or ("expires_in" not in resp.json()):
        raise ValueError("Invalid response from token endpoint")

    token_expires_at = current_seconds + resp.json()["expires_in"]
    token = resp.json()["access_token"]
    return token

def get_token():
    global token, token_expires_at
    current_seconds = int(datetime.datetime.now().timestamp())
    if token is None or token_expires_at is None or current_seconds >= token_expires_at:
        return _get_token()
    return token