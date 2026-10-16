"""SFM Travels - FastAPI backend serving the website and storing enquiries."""
import os
import secrets
import sqlite3
from datetime import date, datetime, timezone
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

BASE = Path(__file__).parent
DB_PATH = os.getenv("DB_PATH", str(BASE / "enquiries.db"))
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")  # set this to read enquiries

app = FastAPI(title="SFM Travels")


def db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con


with db() as con:
    con.execute(
        """CREATE TABLE IF NOT EXISTS enquiries(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT, name TEXT, phone TEXT, email TEXT,
            travel_date TEXT, travellers INTEGER, message TEXT, language TEXT)"""
    )


class Enquiry(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=5, max_length=30)
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$", max_length=120)
    travel_date: date | None = None
    travellers: int = Field(default=2, ge=1, le=50)
    message: str = Field(default="", max_length=2000)
    language: str = Field(default="en", max_length=5)


@app.post("/api/enquiries", status_code=201)
def create_enquiry(e: Enquiry):
    with db() as con:
        cur = con.execute(
            "INSERT INTO enquiries(created_at,name,phone,email,travel_date,travellers,message,language)"
            " VALUES(?,?,?,?,?,?,?,?)",
            (datetime.now(timezone.utc).isoformat(), e.name, e.phone, e.email,
             e.travel_date.isoformat() if e.travel_date else None,
             e.travellers, e.message, e.language),
        )
    return {"id": cur.lastrowid, "status": "received"}


@app.get("/api/enquiries")
def list_enquiries(x_admin_token: str = Header(default="")):
    if not ADMIN_TOKEN or not secrets.compare_digest(x_admin_token, ADMIN_TOKEN):
        raise HTTPException(status_code=403, detail="Forbidden")
    with db() as con:
        return [dict(r) for r in con.execute("SELECT * FROM enquiries ORDER BY id DESC")]


@app.get("/api/health")
def health():
    return {"ok": True}


PACKAGES = [
    dict(id=1, tag="Dubai Highlights", name="Dubai Classic", nights=4, category="City", img="classic",
         desc="Burj Khalifa At The Top, Dubai Mall, Old Dubai tour, Dhow cruise dinner, airport transfers."),
    dict(id=2, tag="Desert Escape", name="Dubai + Desert Safari", nights=5, category="Desert", img="desert",
         desc="Dune bashing, camel ride, BBQ camp dinner, Miracle Garden or Global Village, city tour."),
    dict(id=3, tag="Family Fun", name="Dubai Family Adventure", nights=6, category="Family", img="family",
         desc="Atlantis Aquaventure, IMG Worlds, Dubai Aquarium, Museum of the Future, kids-friendly hotel."),
    dict(id=4, tag="Romance", name="Dubai Honeymoon", nights=5, category="Honeymoon", img="honeymoon",
         desc="Beach resort stay, private yacht sunset, Burj Al Arab view dinner, couples spa session."),
    dict(id=5, tag="Two cities", name="Dubai + Abu Dhabi", nights=6, category="City", img="abudhabi",
         desc="Sheikh Zayed Grand Mosque, Louvre Abu Dhabi, Ferrari World, plus 3 nights in Dubai."),
    dict(id=6, tag="Luxury", name="Palm & Skyline Luxury", nights=7, category="Luxury", img="luxury",
         desc="5-star Palm Jumeirah resort, helicopter tour, private desert dinner, chauffeur transfers."),
]


@app.get("/api/packages")
def packages():
    return PACKAGES


DIST = BASE / "frontend" / "dist"
if DIST.exists():
    app.mount("/", StaticFiles(directory=DIST, html=True), name="site")
else:
    @app.get("/", include_in_schema=False)
    def no_build():
        return {"detail": "Frontend not built. Run: cd frontend && npm install && npm run build"}
