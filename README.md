# 🏃 Kimbia Eldoret

**Your Tribe is Waiting.**

The official community website for **Kimbia Eldoret**, a running and walking club based in Eldoret, Kenya. Built as a Django web application, it gives the club a home online — sharing the weekly run schedule, telling people who the Tribe is, and giving partners and members a direct line to reach the team.

🔗 **Live site:** [kimbia-eldoret.onrender.com](https://kimbia-eldoret.onrender.com)

---

## Features

- **Home / Hero** — introductory landing section welcoming visitors to the Tribe
- **Our Tribe** — About Us, club Rules, Mission & Vision, and an FAQ section
- **Live stats counters** — animated counts of total runners and weeks of community
- **Runs** — weekly run schedule plus a live embedded calendar
- **Events** — space for featured/upcoming club events
- **Community** — showcase of the club's activities and members
- **Partner With the Tribe** — a collaboration/sponsorship request form for businesses (health & wellness, sports gear, nutrition, local Eldoret businesses, tech, media, etc.), saved straight to the database and manageable from the Django admin
- **Shop** — space for club merchandise
- **Feedback** — a simple form so visitors can leave feedback, stored and reviewable in the admin
- **Contact** — ways to connect with the club

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | [Django](https://www.djangoproject.com/) 6.0.3 (Python) |
| Database | SQLite (`db.sqlite3`) |
| WSGI server | Gunicorn |
| Static file serving | WhiteNoise |
| Frontend | Django templates, HTML5, CSS3, vanilla JavaScript |
| Hosting | [Render](https://render.com) |

## Project Structure

```
kimbia-eldoret/
├── core/                      # Django project configuration
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py / wsgi.py
├── club_logic/                 # Main Django app
│   ├── models.py               # CollaborationRequest, Feedback
│   ├── views.py                # index + leave_feedback views
│   ├── urls.py
│   ├── admin.py                # Admin panel config for both models
│   └── migrations/
├── templates/club_logic/
│   └── index.html              # Single-page site template
├── static/
│   ├── css/, js/, img/, gallery/, sponsors/, video/
├── manage.py
├── requirements.txt
└── LICENSE
```

## Data Models

- **`CollaborationRequest`** — captures partnership/sponsorship enquiries (organisation name, website, industry, collaboration type, email, proposal), with a status workflow (`pending → contacted → accepted/declined`) and an assignable `processed_by` field for the admin handling it.
- **`Feedback`** — simple free-text feedback messages with a timestamp, read-only in the admin to preserve what visitors actually wrote.

Both are manageable through the built-in Django admin at `/admin/`.

## Getting Started Locally

**Prerequisites:** Python 3.11+ and pip

```bash
# 1. Clone the repository
git clone https://github.com/Kimberlywangari/kimbia-eldoret.git
cd kimbia-eldoret

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Apply migrations
python manage.py migrate

# 5. Create an admin account (to manage collaboration requests & feedback)
python manage.py createsuperuser

# 6. Run the development server
python manage.py runserver
```

Visit `http://127.0.0.1:8000/` for the site and `http://127.0.0.1:8000/admin/` for the admin panel.

### Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `SECRET_KEY` | Django secret key | Recommended in production (falls back to a local default otherwise) |

## Deployment

The app is deployed on **Render** using **Gunicorn** as the application server and **WhiteNoise** for compressed, cache-friendly static file delivery — no separate static file host needed.

> **Note:** the project currently runs on SQLite, including in the deployed environment. SQLite is file-based and works for a low-traffic community site, but doesn't scale well under concurrent writes or persist reliably across some hosting redeploys. Migrating to PostgreSQL (e.g. via Render's managed Postgres + `dj-database-url`/`psycopg`) would be a natural next step as traffic grows.

## License

This project is proprietary and confidential — © 2026 Kimberly Wangari / Kimbia Eldoret. All rights reserved. No part of this software may be copied, reproduced, distributed, or modified without express written permission of the copyright owner.

## Author

**Njoroge Kimberly Wangari**
Computer Science Student, JKUAT · Data Science Candidate, ALX
