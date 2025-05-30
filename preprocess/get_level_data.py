import datetime

import concurrent.futures
import json

from xylem_query import get_daily_average_level

MADISON_SITE_NAME = "MadisonReservoirNew"
DATA_STREAM_NAME = "LevelData:Amazon-Stage"

START_YEAR = 2024
START_MONTH = 12
START_DAY = 1

TARGET_FILE = "public/data/actuals.json"


def main():

    # Target file already exists? If so, skip what we already have
    try:
        with open(TARGET_FILE, "r") as f:
            existing_data = json.load(f)
            last_date_str = existing_data[-1]["date"]
            start_date = datetime.datetime.strptime(
                last_date_str, "%Y-%m-%d"
            ).date() + datetime.timedelta(days=1)

    except:
        existing_data = []
        start_date = datetime.date(START_YEAR, START_MONTH, START_DAY)

    today = datetime.date.today()
    end_year = today.year
    end_month = today.month
    end_day = today.day - 1

    end_date = datetime.date(end_year, end_month, end_day)

    dates = []

    for i in range(int((end_date - start_date).days) + 1):
        date = start_date + datetime.timedelta(days=i)
        dates.append(date.strftime("%Y-%m-%d"))

    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        execs = [
            executor.submit(
                lambda date_str: get_daily_average_level(
                    MADISON_SITE_NAME, DATA_STREAM_NAME, date_str
                ),
                date_str,
            )
            for date_str in dates
        ]
    levels = [ex.result() if ex.result() is not None else None for ex in execs]
    actuals_data = [{"date": dates[i], "value": levels[i]} for i in range(len(levels))]

    with open(TARGET_FILE, "w") as f:
        json.dump(existing_data + actuals_data, f, indent=4)


if __name__ == "__main__":
    main()
