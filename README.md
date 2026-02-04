# CSV Upload & Search Application

This project is a sample solution that implements:

- Upload CSV with upload progress feedback
- Parse and validate CSV and store data into PostgreSQL
- List uploaded data with pagination and total count
- Search data from uploaded files (name, email, body)
- Responsive React frontend (TypeScript) and Express backend (TypeScript) 
- Unit tests for backend & frontend with edge cases
- Docker Compose to run PostgreSQL, backend, and frontend with one command 

See `docker-compose.yml` and each service's README for commands to build, test and run.

Sample CSV: `data.csv` is included at the repository root and used for manual testing.

Example curl (uploads `data.csv`):

```
curl -F "file=@data.csv" http://localhost:4000/upload
``` 

## To Download
Docker Desktop: https://www.docker.com/products/docker-desktop/ 

After download is complete, ensure to open and run first.

## Commands
### Docker - Build & Start:
docker compose up --build

### Run Test Cases
**Frontend/Backend:**
1. cd frontend **OR** cd backend 
2. npm test
    
## URLs
1. **Frontend:** http://localhost:5173
2. **Backend:** http://localhost:4000
