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

Vercel (recommended for full API)

1. Connect your GitHub repository to Vercel: https://vercel.com/new
2. Select the project (Budget-Friendly-app) and confirm settings; Vercel will detect the `api/` serverless functions automatically.
3. Add environment variables in the Vercel dashboard (Project Settings → Environment Variables):
	- `MONGODB_URI` (Secret)
	- `MONGODB_DB` (optional)
	- `JWT_ACCESS_SECRET` (Secret)
	- `JWT_REFRESH_SECRET` (Secret)
	- `JWT_ACCESS_TTL_MIN` (e.g., `15`)
	- `JWT_REFRESH_TTL_DAYS` (e.g., `30`)
	- `NODE_ENV` = `production`
	- `EXPO_PUBLIC_API_BASE_URL` = `https://<your-vercel-url>`
4. Optionally add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as GitHub repository secrets so the GitHub Action `/.github/workflows/vercel-deploy.yml` can deploy automatically on pushes to `main`.
	- Create a Personal Token in Vercel (Account → Tokens) and copy the token to `VERCEL_TOKEN` in GitHub Secrets.
	- Get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from the Vercel project settings and add them to GitHub Secrets.
5. Push to `main` (or merge a PR) — the GitHub Action will run and deploy the project to Vercel.

Quick manual deploy (Vercel CLI)
```bash
npm i -g vercel
vercel login
vercel --prod
```

After Vercel deploy
- Test auth and tax endpoints:
  - `POST https://<your-vercel-url>/v1/auth/register`
  - `POST https://<your-vercel-url>/v1/auth/login`
  - `POST https://<your-vercel-url>/v1/tax/calc`

