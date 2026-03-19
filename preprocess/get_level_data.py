import datetime

import concurrent.futures
import json

from xylem_query import get_daily_average_level, set_data_stream_id

MADISON_SITE_NAME = "MadisonReservoirNew"
DATA_STREAM_NAME = "LevelData:Amazon-Stage"

START_YEAR = 2024
START_MONTH = 12
START_DAY = 1

TARGET_FILE = "public/data/actuals.json"

def main():
    # Set data stream ID
    # -------------------------------------
    set_data_stream_id(site_name=MADISON_SITE_NAME, data_stream_name=DATA_STREAM_NAME)

    # All required dates
    # -------------------------------------
    start_date = datetime.date(START_YEAR, START_MONTH, START_DAY)
    all_required_dates = set(
        [
            start_date + datetime.timedelta(days=i)
            for i in range((datetime.date.today() - start_date).days)
        ]
    )

    # Initialize results dictionary
    # -------------------------------------

    results: dict[datetime.date, float] = {date: None for date in all_required_dates}

    # Read existing data
    try:
        with open(TARGET_FILE, "r") as f:
            existing_data = json.load(f)
    except:
        existing_data = []


    # Initialize results with existing data
    # Determine which dates need to be requested
    # -------------------------------------

    no_data_dates = set(all_required_dates)

    for entry in existing_data:

        entry_date = datetime.datetime.strptime(entry["date"], "%Y-%m-%d").date()
        entry_value = entry["value"]

        has_value = entry_date is not None and entry_value is not None
        if has_value:
            results[entry_date] = entry_value
            no_data_dates.remove(entry_date)


    dates_to_request = sorted(list(no_data_dates))
    print(f"Need to request new data for {len(dates_to_request)} dates that don't have data yet.")

    # Request missing data concurrently
    # -------------------------------------

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        execs = [
            executor.submit(get_daily_average_level, date) for date in dates_to_request
        ]

    requested_values = [ex.result() if ex.result() is not None else None for ex in execs]
    requested_results = {k: v for k, v in zip(dates_to_request, requested_values)}

    num_none_null = len([v for v in requested_values if v is not None])
    print(f"Fetched {num_none_null} none-null new data points.")

    # Update the global results
    results.update(requested_results)

    # Turn into result format, and write
    #-------------------------------------
    json_list = [
        {
            "date": entry.strftime("%Y-%m-%d"),
            "value": results[entry]
        }
        for entry in sorted(results)
    ]

    with open(TARGET_FILE, "w") as f:
        json.dump(json_list, f, indent=4)

    print(f"Updated data written to {TARGET_FILE}.")


if __name__ == "__main__":
    main()
