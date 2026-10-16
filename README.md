# SFM Travels – React + FastAPI

React front end (Vite) served by a FastAPI back end. The built site is already in `frontend/dist`, so you only need Python to run it.

    pip install -r requirements.txt
    ADMIN_TOKEN=choose-a-secret uvicorn main:app --reload     # open http://127.0.0.1:8000

## What is where
- Contact: phone +971 52 697 3378 (call, WhatsApp) and https://www.sfmtravels.co.in/ — set in `frontend/src/data.js`.
- Photos: `frontend/public/images/` (burj-al-arab.jpg, atlantis.jpg, burj-khalifa.jpg), assigned to tiles in `frontend/src/data.js`.
- Hero background: crossfading photos. For an HD video, save it as `frontend/public/media/hero.mp4`; it plays over the photos.
- Packages: `PACKAGES` in `main.py` (no prices are shown; visitors ask for a quote).
- Arabic text: `frontend/src/ar.js`.
- Enquiries are saved to `enquiries.db`: `curl -H "X-Admin-Token: choose-a-secret" http://127.0.0.1:8000/api/enquiries`

## Changing the front end
    cd frontend && npm install && npm run dev      # dev server with API proxy (run uvicorn too)
    npm run build                                  # rebuilds frontend/dist
