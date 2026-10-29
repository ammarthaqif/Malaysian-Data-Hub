# Malaysia Open Data Explorer (data.gov.my)

A centralized analytics dashboard and public intelligence portal integrating official open APIs from [developer.data.gov.my](https://developer.data.gov.my), OpenDOSM, and the Ministry of Finance (MOF).

Developed by **Ammar Thaqif** (`ammarthaqif.ar@gmail.com`).

---

## Key Features

1. **Daily Digest**: Card-based executive bulletin summarizing impactful daily macroeconomic, fuel price, weather, and labour updates.
2. **AI Trend Projections**: Machine learning macroeconomic trajectory forecasting powered by the Google Gemini API (`gemini-3.8-flash`) with confidence interval ranges.
3. **Interactive Regional Choropleth Map**: High-precision SVG/D3 visualization covering all 16 Malaysian states and federal territories with median income, Gini disparity, and population metrics.
4. **API Health Dashboard**: Real-time latency tracker, response status codes, and latency sparklines for official government endpoints.
5. **Unified Catalogue (355+ Datasets)**: Search, multi-facet filtering, and in-modal live API inspector with cURL, JavaScript, and Python code snippets.
6. **Socioeconomic Indicators**: Interactive Recharts time-series charts for weekly APM fuel prices, monthly CPI inflation baskets, and quarterly GDP.
7. **Comparative Studio**: Cross-metric overlay with Base-100 normalization and analytical presets.
8. **Real-Time Telemetry Stream**: Server-Sent Events (SSE) live feed for MET Malaysia thunderstorm warnings, district forecasts, and Prasarana transit telemetry.
9. **Exportable Reports**: Customizable reports downloadable as CSV, JSON, or printable executive summary PDF.

---

## Instant Deployment

### 1. GitHub Pages Deployment (Free Static Hosting)

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) is fully automated:
1. Push your code to the `main` (or `master`) branch.
2. The workflow automatically compiles the project and publishes the production bundle directly to the `gh-pages` branch.
3. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select **Branch**: `gh-pages` and folder: `/ (root)`, then click **Save**.
4. Your website will be live at `https://<your-username>.github.io/<repo-name>/` with no blank screen or 404 errors!

### 2. Vercel Deployment (Full-Stack Gateway with Serverless API)

The repository includes `vercel.json` and `.npmrc` configured with `--legacy-peer-deps` to guarantee zero `ERESOLVE` errors:
1. In your **Vercel Dashboard**, click **Add New Project** and select this repository.
2. Vercel automatically detects the Vite framework and executes `npm install --legacy-peer-deps`.
3. (Optional) In **Environment Variables**, add `GEMINI_API_KEY` for machine-learning trend projections.
4. Click **Deploy**. Both the client and the `/api/*` serverless routes will be live instantly.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run TypeScript linter
npm run lint

# Build production bundle
npm run build
```

---

## Attribution & License

- **Data Sources**: Official open data provided by the Government of Malaysia via [developer.data.gov.my](https://developer.data.gov.my) and [OpenDOSM](https://open.dosm.gov.my) under the Malaysian Open Government Licence (MOGL).
- **Author**: Ammar Thaqif
