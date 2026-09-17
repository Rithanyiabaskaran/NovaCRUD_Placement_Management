# NovaPlace — Professional Placement Management System

Full-stack CRUD application based on the supplied SOP.

## Stack
Frontend: HTML, CSS, JavaScript
Backend: Django + Django REST Framework
Database: SQLite
API: REST CRUD

## Features
Candidate Create/Read/Update/Delete, search, responsive professional dashboard, status tracking, CGPA/package validation, email validation, duplicate handling, REST API and persistent SQLite storage.

## Windows setup

### Backend
Open Command Prompt:
```bat
cd backend
py -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
py manage.py makemigrations
py manage.py migrate
py manage.py runserver
```

### Frontend
Open a second Command Prompt:
```bat
cd frontend
py -m http.server 5500
```
Open http://127.0.0.1:5500/login.html

## API
GET /api/candidates/
POST /api/candidates/
GET /api/candidates/{id}/
PUT /api/candidates/{id}/
PATCH /api/candidates/{id}/
DELETE /api/candidates/{id}/

## Demo fields
Candidate ID, name, department, CGPA, company, package in LPA, email and placement status.

For production, move secrets/configuration to environment variables and restrict CORS origins.
