Temporary deployment options for the mock API

Quick summary
- The mock server file is `dev-mock-server.js` and listens on port `3002`.
- I added a `Dockerfile` and a script `npm run start:mock` to run the server.

Local test
1. Install deps (already done): `npm install`
2. Run locally: `npm run start:mock`

Docker (build and run locally)
```bash
docker build -t budget-mock:latest .
docker run -p 3002:3002 budget-mock:latest
```

Deploy to Cloud Run (Google)
1. Build and push an image (example using gcloud):
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/budget-mock
gcloud run deploy budget-mock --image gcr.io/PROJECT_ID/budget-mock --platform managed --region REGION --allow-unauthenticated --port 3002
```

Deploy to Render (Docker service)
1. Create a new Web Service on Render and connect your repo.
2. Choose Docker and point to the `Dockerfile` in the repo. Set the port to `3002`.

Render (Infrastructure-as-Code)
- A `render.yaml` manifest has been added to the repo so Render can create the service automatically when you connect the repository.
- The manifest configures a Docker web service named `budget-mock` that uses the `Dockerfile` and exposes port `3002`.

Steps to deploy via Render with this repo:
1. Push the repo to GitHub (if not already):
```bash
git add render.yaml Dockerfile dev-mock-server.js DEPLOY.md
git commit -m "Add mock server and Render manifest"
git push origin main
```
2. In Render dashboard, click **New** → **Web Service** → **Connect a repository** and select the GitHub repo.
3. Render will detect `render.yaml` and propose creating the `budget-mock` service. Confirm and deploy.
4. Once deployed, your public URL will be shown in the Render dashboard. POST to `/v1/tax/calc` on that URL.

Notes:
- If your main branch is named `master` or something else, edit `render.yaml` accordingly or set the branch in Render.
- You can also create the service manually in the Render UI and point the service at the repo and Dockerfile if you prefer.


Deploy to Heroku (container)
```bash
heroku container:login
docker build -t registry.heroku.com/<app-name>/web .
docker push registry.heroku.com/<app-name>/web
heroku container:release web -a <app-name>
```

After deployment
- POST JSON to `/v1/tax/calc` with payload `{ "country": "NG", "grossAnnual": 1200000 }` to get the mocked tax response.
