import requests
from xylem_token import get_token

AUTH_URL = "https://cloud.xylem.com/xcloud/auth/realms/xcloud/protocol/openid-connect/token"
SITES_URL = "https://cloud.xylem.com/xcloud/data-export/sites"

def DATA_STREAMS_URL(site_id):
    return f"https://cloud.xylem.com/xcloud/data-export/site/{site_id}/datastreams"

def OBSERVATIONS_URL(data_stream_id, date_string):
    return f"https://cloud.xylem.com/xcloud/data-export/observations?datastreamIds={data_stream_id}&from={date_string}T00:00:00.000Z&until={date_string}T23:59:59.999Z"

def get_site_id(site_name):
    token = get_token()

    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {token}",
    }

    resp = requests.get(SITES_URL, headers=headers)
    if resp.status_code != 200:
        raise ValueError(f"Failed to fetch sites: {resp.text}")

    for item in resp.json():
        if item["name"] == site_name:
            return item["id"]
    raise ValueError(f"Site '{site_name}' not found.")

def get_data_stream_id(site_id, data_stream_name):
    token = get_token()

    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {token}",
    }
    resp = requests.get(DATA_STREAMS_URL(site_id), headers=headers)
    if resp.status_code != 200:
        raise ValueError(f"Failed to fetch data streams for site ID '{site_id}': {resp.text}")
    
    for item in resp.json():
        if item["name"] == data_stream_name:
            return item["id"]
    raise ValueError(
        f"Data stream '{data_stream_name}' not found for site ID '{site_id}'."
    )

def get_observations(data_stream_id, date_string):
    token = get_token()

    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {token}",
    }

    resp = requests.get(
        OBSERVATIONS_URL(data_stream_id, date_string),
        headers=headers,
    )
    
    if resp.status_code != 200:
        raise ValueError(f"Failed to fetch observations: {resp.text}")
    
    if data_stream_id not in resp.json():
        raise ValueError(f"No observations found for data stream ID '{data_stream_id}' on {date_string}.")
    
    return resp.json()[data_stream_id]

def get_average(observations):
    if len(observations) == 0:
        return None
    
    values = [obs['value'] for obs in observations if 'value' in obs and obs['value'] is not None]
    if len(values) == 0:
        return None
    
    return sum(values) / len(values)

def get_daily_average_level(site_name, data_stream_name, date_string):
    site_id = get_site_id(site_name)
    data_stream_id = get_data_stream_id(site_id, data_stream_name)
    data = get_observations(data_stream_id, date_string)
    average_value = get_average(data)
    return average_value