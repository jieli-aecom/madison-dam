# Madison Dam (Canals Website)

This repo contains the application of Madison Dam Reservoir Drawdown diagrams, and a python procedure to update real-time level data.

## Front-End Application

The application is built from the Vite+React/TS framework and follows all conventions. The application requires three environmental variables from the `.env` file.

## Data Update Procedure

### Token

The update procedure relies on a `CLIENT_ID` and a `CLIENT_SECRET` under `./preprocess/env.py`.

### Environment

To ensure the functioning of the scripts, install the Python environment using `requirements.txt`.

```bash
python -m venv env
env\Script\activate

pip install -r requirements.txt
```

### Update Procedure

To update the real-time level data, run:

```bash
env\Script\activate

python ./preprocess/get_level_data.py
```

This will query the latest level data and updates the file `./public/data/actuals.json`.

To update anticipated data, run:

```bash
env\Script\activate

python ./preprocess/get_anticipated_level_data.py
```

This *statically* creates the anticipated level data and updates the files `./public/data/anticipated.json` and `./public/data/anticipated_range.json`.

### Data Updated

- `./public/data/actuals.json`
- `./public/data/anticipated.json`
- `./public/data/anticipated_range.json`
