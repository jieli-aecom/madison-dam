import requests
import datetime
import concurrent.futures
import json


def get_level_by_date_str(date_str: str):
    from_date = f"{date_str}T{morning_time}Z"
    to_date = f"{date_str}T{noon_time}Z"
    date_params = f"fromDate={from_date}&toDate={to_date}"
    url = f"{url_root}?{other_params}&{date_params}"
    resp = requests.get(url, headers=headers)
    try:
        assert resp.status_code == 200
        data = resp.json()["data"][0]["pagedData"]
        sensors = data["sensorList"]
        sensor_index = sensors.index(sensor_name)
        level = data["data"][0]["values"][sensor_index]
        return level
    except:
        return None


if __name__ == "__main__":

    # Get dates, on each to retrieve data
    today = datetime.date.today()
    start_year = today.year - 1
    start_month = today.month
    start_day = today.day
    end_year = today.year
    end_month = today.month
    end_day = today.day - 1

    start_date = datetime.date(start_year, start_month, start_day)
    end_date = datetime.date(end_year, end_month, end_day)

    dates = []

    for i in range(int((end_date - start_date).days) + 1):
        date = start_date + datetime.timedelta(days=i)
        dates.append(date.strftime("%Y-%m-%d"))

    # Grab one piece of data from each day, time point is noon

    url_root = "https://cloud.xylem.com/hydrosphere/api/report/v1/campbell/download/6571eeaf2f8c9f1646c4fab2/tabular/public"
    other_params = "xcSiteId=6571eeaf2f8c9f1646c4fab2&customerId=OWA_591AE68AAC5D43868391A008E752B7E4&offset=0&limit=1&tableName=LevelData"

    headers = {
        "Accept": "application/json, text/plain, */*",
        "Authorization": "abc",
        "Referer": "https://cloud.xylem.com/",
        "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0",
    }

    noon_time = "14:00:00.000"
    morning_time = "06:00:00.000"

    sensor_name = "LevelData:Amazon-Stage"

    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        execs = [executor.submit(get_level_by_date_str, date_str) for date_str in dates]

    levels = [ex.result() if ex.result() is not None else None for ex in execs]
    assert len(levels) == len(dates), "Not all levels were retrieved"

    actuals_data = [{"date": dates[i], "value": levels[i]} for i in range(len(levels))]

    with open("public/data/actuals.json", "w") as f:
        json.dump(actuals_data, f, indent=4)
