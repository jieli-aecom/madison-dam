import datetime
import json

TARGET_FILE = "public/data/anticipated.json"
BREAKS = {
    "2024-11-01": 1208.2,
    "2025-03-01": 1208.2,
    "2025-04-01": 1211.2,
    "2025-11-03": 1211.2,
    "2025-12-03": 1208.2,
    "2026-01-30": 1208.2,
    "2026-03-03": 1201.2,
    "2027-11-01": 1201.2,
    "2028-03-31": 1211.2,
    "2028-11-01": 1211.2,
}


def main():

    break_dates = [
        datetime.datetime.strptime(date_str, "%Y-%m-%d") for date_str in BREAKS.keys()
    ]

    break_levels = list(BREAKS.values())

    num_breaks = len(BREAKS)
    break_idx = 0
    start_date = datetime.datetime.strptime("2024-12-01", "%Y-%m-%d")
    end_date = break_dates[-1]

    date = start_date
    daily_increment = (break_levels[break_idx + 1] - break_levels[break_idx]) / (
        (break_dates[break_idx + 1] - break_dates[break_idx]).days
    )

    result = {}

    while date <= end_date:
        if date < break_dates[break_idx]:
            level = break_levels[break_idx]
        elif date < break_dates[break_idx + 1]:
            level = (
                break_levels[break_idx]
                + daily_increment * (date - break_dates[break_idx]).days
            )
        else:
            break_idx += 1
            level = break_levels[break_idx]
            if break_idx < num_breaks - 1:
                daily_increment = (
                    break_levels[break_idx + 1] - break_levels[break_idx]
                ) / ((break_dates[break_idx + 1] - break_dates[break_idx]).days)

        result[date] = level
        date += datetime.timedelta(days=1)

    anticipated_data = [
        {"date": datetime.datetime.strftime(k, "%Y-%m-%d"), "value": v}
        for k, v in result.items()
    ]
    with open(TARGET_FILE, "w") as f:
        json.dump(anticipated_data, f, indent=4)


if __name__ == "__main__":
    main()
