# Lattice arXiv Daily

Daily `hep-lat` paper collection with Chinese AI summaries and a small
Next.js reading app.

## Daily pipeline

The scheduled GitHub Actions workflow fetches recent arXiv papers, writes a
Markdown report under `reports/`, and updates `data/papers.json`.

Local setup:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DEEPSEEK_API_KEY="your-key"
python daily_arxiv.py
python pipeline/sync_paper_database.py
```

The sync step only summarizes papers that are not already present in the
database. arXiv fetches are retried three times before the run fails.

## Web app

```bash
cd app
npm ci
npm test
npm run dev
```

Run `npm run build` before deployment. The app imports the generated database
from `data/papers.json`, derives missing score/topic metadata from existing
Markdown summaries, and displays papers newest first.

## Repository layout

- `daily_arxiv.py`: arXiv fetch and daily report generation
- `pipeline/`: database normalization, sync, export, and validation
- `data/`: generated JSON data used by the app
- `reports/`: generated daily Markdown reports
- `app/`: Next.js reader
