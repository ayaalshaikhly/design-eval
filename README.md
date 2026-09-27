# Design Evaluation Suite

A suite of peer-based evaluation tools for design studio education, built for the School of Industrial Design at Carleton University.

Developed by **Aya Al-Shaikhly** under the supervision of **Prof. WonJoon Chung**
School of Industrial Design, Carleton University — Fall 2026

## Tools

### 1. MAYA Calibration Tool
Students anonymously rate each other's design ideas on **Novelty** and **Familiarity** (10 items, 1-5 scale), and the tool plots results on a Novelty-Familiarity map relative to the **MAYA zone** (Most Advanced Yet Acceptable). The MAYA zone adjusts automatically based on product type.

### 2. Metaphoric Design Evaluation
Students evaluate design ideas on **Metaphorical Abstraction** (Literal to Abstract) and **Source Relevance** (Irrelevant to Highly Relevant). Supports up to 3 ideas per presenter, with results plotted on an Abstraction-Relevance map relative to the target metaphoric design zone.

## How It Works

1. **Instructor** selects a tool from the landing page and creates a group session
2. **Presenter** opens the shared link, enters their details, and gets a QR code
3. **Classmates** scan the QR code and submit anonymous ratings
4. **Results** appear instantly — scatter plot, direction recommendations, breakdowns
5. **Instructor** reviews all data later on a password-protected review page

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla — no frameworks)
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database:** Neon (PostgreSQL)
- **Hosting:** Vercel

## Project Structure

```
├── public/
│   ├── index.html            # Landing page — choose your tool
│   ├── maya.html             # MAYA: instructor dashboard
│   ├── present.html          # MAYA: presenter page (QR + live results)
│   ├── rate.html             # MAYA: student rating form (10 items)
│   ├── review.html           # MAYA: professor review page
│   ├── metaphoric.html       # Metaphoric: instructor dashboard
│   ├── meta-present.html     # Metaphoric: presenter page (QR + live results)
│   ├── meta-rate.html        # Metaphoric: student rating form (2 dims x 3 ideas)
│   ├── meta-review.html      # Metaphoric: professor review page
│   ├── style.css             # Shared stylesheet
│   └── qrcode.min.js         # QR code generator
├── api/
│   ├── create-group.js       # POST: create a group (shared)
│   ├── get-group.js          # GET: group info (shared)
│   ├── session.js            # POST: create MAYA session
│   ├── get-session.js        # GET: MAYA session info
│   ├── rate.js               # POST: submit MAYA rating
│   ├── results.js            # GET: MAYA ratings for a session
│   ├── groups.js             # GET: all MAYA groups with sessions
│   ├── meta-session.js       # POST: create Metaphoric session
│   ├── meta-get-session.js   # GET: Metaphoric session info
│   ├── meta-rate.js          # POST: submit Metaphoric rating
│   ├── meta-results.js       # GET: Metaphoric ratings for a session
│   ├── meta-groups.js        # GET: all Metaphoric groups with sessions
│   ├── clear-data.js         # POST: erase MAYA data (password protected)
│   ├── meta-clear-data.js    # POST: erase Metaphoric data (password protected)
│   └── setup-db.js           # GET: create/update all database tables
├── vercel.json               # Vercel routing config
└── package.json
```

## Setup

### 1. Database
Create a [Neon](https://neon.tech) project and copy the connection string.

### 2. Deploy
```bash
vercel --prod
vercel env add DATABASE_URL production
# paste the Neon connection string
vercel --prod
```

### 3. Initialize tables
Visit: `https://your-domain/api/setup-db`

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |

## Live URL

https://www.ayaalshaikhly.com/design-eval

## License

Private — Carleton University
