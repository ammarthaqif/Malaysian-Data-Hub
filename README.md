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

### Deploy to Vercel (Minimal Action Required)

1. **Import Repository**: In your Vercel Dashboard, click **Add New Project** and select this GitHub repository.
2. **Vercel Settings**:
   - **Framework Preset**: Vite (detected automatically from `vercel.json`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Environment Variables**:
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API Key for AI Trend Projections.
4. Click **Deploy**. The app will be live with full frontend and serverless API proxy routes!

### GitHub Actions CI/CD

A pre-configured pipeline is included in `.github/workflows/deploy.yml`. Whenever you push to `main` or open a PR, GitHub Actions automatically:
- Installs dependencies
- Runs TypeScript syntax & type checks (`npm run lint`)
- Builds the production bundle (`npm run build`)
- Generates deployment artifacts

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
