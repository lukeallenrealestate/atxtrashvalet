# ATX Trash Valet

A professional service website for a doorstep trash and recycling collection business based in Austin, Texas. Serves as a lead generation platform for apartment communities and condominiums.

## Architecture

- **Backend**: Node.js + Express (`server.js`) serving static files and a contact form API
- **Frontend**: Vanilla HTML/CSS/JS in the `public/` directory
- **No build step** — the server directly serves static files from `public/`

## Key Files

- `server.js` — Express server, routes, and contact form API (`POST /api/contact`)
- `public/` — All static HTML pages, CSS, JS, and images
- `data/leads.json` — Contact form submissions (created at runtime)

## Running the App

```bash
npm start
```

The app runs on `0.0.0.0:5000`.

## Pages

- `/` — Home page
- `/about` — About page
- `/services` — Services overview
- `/trash-valet-service` — Detailed service page
- `/bulk-trash-pickup` — Specialty service page
- `/areas-served` — Location information
- `/faq` — FAQ
- `/contact` — Contact form

## Contact Form

Submissions are saved to `data/leads.json` with fields: name, phone, property, units, message, source, timestamp.

## Deployment

Configured for autoscale deployment with `node server.js`.
