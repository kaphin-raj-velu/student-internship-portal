# Student Internship Portal (MERN)

A full-stack coursework implementation using React + Vite, React Router, Node.js, Express, Mongoose and MongoDB.

## Features
- Internship list and details routes (`/internships`, `/internships/:id`)
- Validated application form: name, email, roll number and selected internship
- `fetch()` POST submission with success/error messages and duplicate-click protection
- REST APIs: `GET /api/internships`, `GET /api/internships/:id`, `POST /api/applications`, `GET /api/applications`
- Mongoose validation, async/await, centralized error handling and environment-based MongoDB connection
- CORS configured for local development and the deployed frontend

## 1. Requirements
Install Node.js 20+ and npm. You need a MongoDB Atlas connection string or a local MongoDB instance.

## 2. Configure backend
```bash
cd server
npm install
```
Copy `.env.example` to `.env` and set `MONGODB_URI`. Example:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/internship_portal?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```
Replace placeholders with your actual Atlas details. Do not commit `.env`.

Start backend:
```bash
npm run dev
```
Health check: `http://localhost:5000/api/health`

## 3. Configure frontend
Open another terminal:
```bash
cd client
npm install
```
Copy `.env.example` to `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
Start frontend:
```bash
npm run dev
```
Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## 4. API routes
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| GET | `/api/internships` | List available internships |
| GET | `/api/internships/:id` | Internship details |
| POST | `/api/applications` | Validate and save application |
| GET | `/api/applications` | Retrieve saved applications |

Example POST body:
```json
{
  "studentName": "Demo Student",
  "email": "demo@example.com",
  "rollNumber": "24BCS001",
  "internshipId": "frontend-intern"
}
```
Internship data is intentionally seeded in code so the app can run immediately. Applications are stored in MongoDB.

## 5. Git workflow requested by ByteXL
Run from the project root:
```bash
git init
git add .
git commit -m "Build Student Internship Portal"
git branch -M main
git checkout -b rollno_v1
git add .
git commit -m "Implement internship list, details and application flow"
git checkout main
git merge rollno_v1
git remote add origin https://github.com/YOUR_USERNAME/student-internship-portal.git
git push -u origin main
git push -u origin rollno_v1
```
Replace the remote URL with your own repository URL. If your instructor expects an existing repository, clone it first and copy these project files into it rather than creating a disconnected repository.

## 6. Deploy backend (Render example)
1. Push this repository to GitHub.
2. Create a new Web Service on Render and select the repository.
3. Set **Root Directory** to `server`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI` = your MongoDB Atlas URI
   - `CLIENT_URL` = your deployed Vercel URL, e.g. `https://your-app.vercel.app`
   - `NODE_ENV` = `production`
7. Deploy and test `https://YOUR-RENDER-SERVICE.onrender.com/api/health`.

## 7. Deploy frontend (Vercel)
1. Import the GitHub repository into Vercel.
2. Set **Root Directory** to `client`.
3. Framework preset: Vite.
4. Add environment variable `VITE_API_URL` = `https://YOUR-RENDER-SERVICE.onrender.com/api`
5. Deploy / redeploy after adding the variable.

If you change the backend URL or environment variables, redeploy the frontend. `VITE_API_URL` is embedded at build time.

## 8. Verify and take screenshots
1. Open the deployed site and submit a valid application.
2. Capture a screenshot showing the success message.
3. Open `/api/applications` on the backend URL (or use the app's **View submitted applications** section) and capture a screenshot showing the saved record.
4. Include your Git repository URL and deployed frontend URL in your ByteXL submission.
5. Use real URLs from your deployments; do not submit placeholder URLs.

## Notes
- The API returns application records with timestamps.
- The public GET endpoint is intended for coursework demonstration. For a production portal, add authentication/authorization and restrict access to personal application data.
- The internship catalogue is a static sample list; replace it with a database collection if your task requires internship administration.
