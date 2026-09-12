# EventFlow Admin

A full-stack MERN admin portal for maintaining beneficiary bank details, grouping users into events, importing users from CSV, and exporting event data to Excel.

## Stack

- React + Vite frontend
- Node.js + Express API
- MongoDB + Mongoose
- JWT authentication
- CSV import and XLSX export

## Quick start

1. Copy `server/.env.example` to `server/.env` and update the values.
2. Ensure MongoDB is running locally, or set `MONGODB_URI` to a MongoDB Atlas connection string.
3. Install dependencies and run both apps:

```bash
npm run install:all
npm run dev
```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:5001`.

On first startup, the API creates the admin account configured in `server/.env` (defaults: `admin@eventflow.local` / `Admin@123`). Change these values before production use.

## CSV format

Download the template from the Users page. Required headers:

```csv
Name,Unique ID,Mobile,Email,Account Number,IFSC Code,Bank Name
```

Imports validate every row and return precise row-level errors. Existing unique IDs or emails are skipped and reported.
