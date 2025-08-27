import datetime
import json

TARGET_FILE = "public/data/anticipated.json"
TARGET_RANGE_FILE = "public/data/anticipated_range.json"

BREAKS = {
    "2025-04-01": 1211.2,
    "2025-11-03": 1211.2,
    "2025-12-03": 1208.2,
    "2026-03-15": 1208.2,
    "2026-05-15": 1201.2,
    "2027-12-31": 1201.2,
    "2028-04-17": None,
    "2028-05-31": 1211.2,
    "2028-09-22": 1211.2,
    "2028-11-03": 1211.2,
    "2028-12-03": 1208.2,
    "2029-03-15": 1208.2,
}

LOWER_BREAKS = {
    "2025-04-01": 1211.2,
    "2025-11-03": 1211.2,
    "2025-12-03": 1208.2,
    "2026-03-15": 1208.2,
    "2026-05-15": 1201.2,
    "2027-12-31": 1201.2,
    "2028-04-17": None,
    "2028-05-31": None,
    "2028-09-22": 1211.2,
    "2028-11-03": 1211.2,
    "2028-12-03": 1208.2,
    "2029-03-15": 1208.2,
}

HIGHER_BREAKS = {
    "2025-04-01": 1211.2,
    "2025-11-03": 1211.2,
    "2025-12-03": 1208.2,
    "2026-03-15": 1208.2,
    "2026-05-15": 1201.2,
    "2027-12-31": 1201.2,
    "2028-04-17": 1211.2,
    "2028-05-31": 1211.2,
    "2028-09-22": 1211.2,
    "2028-11-03": 1211.2,
    "2028-12-03": 1208.2,
    "2029-03-15": 1208.2,
}

def fill_breaks_in_place(breaks_dict):
    # Start and end must not be None
    assert breaks_dict[list(breaks_dict.keys())[0]] is not None
    assert breaks_dict[list(breaks_dict.keys())[-1]] is not None

    # Fill None values by linear interpolation
    keys = list(breaks_dict.keys())
    n = len(keys)
    i = 0
    while i < n:
        if breaks_dict[keys[i]] is None:
            this_date = datetime.datetime.strptime(keys[i], "%Y-%m-%d")

            j = i + 1
            while j < n and breaks_dict[keys[j]] is None:
                j += 1
            assert j < n
            start_date = datetime.datetime.strptime(keys[i - 1], "%Y-%m-%d")
            end_date = datetime.datetime.strptime(keys[j], "%Y-%m-%d")
            start_value = breaks_dict[keys[i - 1]]
            end_value = breaks_dict[keys[j]]
            delta_days = (end_date - start_date).days
            delta_value = end_value - start_value
            daily_increment = delta_value / delta_days
            for k in range(i, j):
                current_date = datetime.datetime.strptime(keys[k], "%Y-%m-%d")
                days_from_start = (current_date - start_date).days
                breaks_dict[keys[k]] = start_value + daily_increment * days_from_start
            i = j
        else:
            i += 1



def main():

    # Fill in any None values in BREAKS
    fill_breaks_in_place(BREAKS)
    fill_breaks_in_place(LOWER_BREAKS)
    fill_breaks_in_place(HIGHER_BREAKS)

    break_dates = [
        datetime.datetime.strptime(date_str, "%Y-%m-%d") for date_str in BREAKS.keys()
    ]

    break_levels = list(BREAKS.values())
    low_break_levels = list(LOWER_BREAKS.values())
    high_break_levels = list(HIGHER_BREAKS.values())

    num_breaks = len(BREAKS)
    assert len(LOWER_BREAKS) == len(HIGHER_BREAKS) == num_breaks
    assert (
        list(LOWER_BREAKS.keys()) == list(HIGHER_BREAKS.keys()) == list(BREAKS.keys())
    )

    break_idx = 0
    start_date = datetime.datetime.strptime("2024-12-01", "%Y-%m-%d")
    end_date = break_dates[-1]

    date = start_date
    daily_increment = (break_levels[break_idx + 1] - break_levels[break_idx]) / (
        (break_dates[break_idx + 1] - break_dates[break_idx]).days
    )
    daily_increment_low = (
        low_break_levels[break_idx + 1] - low_break_levels[break_idx]
    ) / ((break_dates[break_idx + 1] - break_dates[break_idx]).days)
    daily_increment_high = (
        high_break_levels[break_idx + 1] - high_break_levels[break_idx]
    ) / ((break_dates[break_idx + 1] - break_dates[break_idx]).days)

    result = {}
    range_result = {}

    while date <= end_date:
        if date < break_dates[break_idx]:
            level = break_levels[break_idx]
            low_level = low_break_levels[break_idx]
            high_level = high_break_levels[break_idx]
        elif date < break_dates[break_idx + 1]:
            level = (
                break_levels[break_idx]
                + daily_increment * (date - break_dates[break_idx]).days
            )
            low_level = (
                low_break_levels[break_idx]
                + daily_increment_low * (date - break_dates[break_idx]).days
            )
            high_level = (
                high_break_levels[break_idx]
                + daily_increment_high * (date - break_dates[break_idx]).days
            )
        else:
            break_idx += 1
            level = break_levels[break_idx]
            low_level = low_break_levels[break_idx]
            high_level = high_break_levels[break_idx]

            if break_idx < num_breaks - 1:
                daily_increment = (
                    break_levels[break_idx + 1] - break_levels[break_idx]
                ) / ((break_dates[break_idx + 1] - break_dates[break_idx]).days)
                daily_increment_low = (
                    low_break_levels[break_idx + 1] - low_break_levels[break_idx]
                ) / ((break_dates[break_idx + 1] - break_dates[break_idx]).days)
                daily_increment_high = (
                    high_break_levels[break_idx + 1] - high_break_levels[break_idx]
                ) / ((break_dates[break_idx + 1] - break_dates[break_idx]).days)

        result[date] = level
        range_result[date] = (low_level, high_level)
        date += datetime.timedelta(days=1)

    anticipated_data = [
        {"date": datetime.datetime.strftime(k, "%Y-%m-%d"), "value": v}
        for k, v in result.items()
    ]
    anticipated_data_with_range = [
        {"date": datetime.datetime.strftime(k, "%Y-%m-%d"), "low": v[0], "high": v[1]}
        for k, v in range_result.items()
    ]
    with open(TARGET_FILE, "w") as f:
        json.dump(anticipated_data, f, indent=4)

    with open(TARGET_RANGE_FILE, "w") as f:
        json.dump(anticipated_data_with_range, f, indent=4)


if __name__ == "__main__":
    main()
