# NLP & AI Agents Lab

A hands-on lab of NLP and LLM tools in one web app: resume scanning, text classification, RAG document Q&A, multi-agent workflows, structured extraction, and more. Most tools work without signing in. Signing in saves your history to My Lab.

**Live demo:** https://aimlmodel.vercel.app/

<!-- Add a screenshot or GIF here, e.g. ![RAG Q&A demo](docs/rag-demo.gif) -->

## Tools

| Tool | What it does |
| --- | --- |
| Resume Scanner | Compares a resume with a job description and gives a 0–100 match score, matched skills, and gaps. |
| Text Classification | Sorts text into a category and returns a confidence score. |
| Predictive Keyboard | Suggests the next words as you type. |
| Streaming Assistant | Chat with streamed responses. |
| Multi-Agent System | A planner, a researcher, and a writer agent work on a task in turn. |
| RAG Document Q&A | Upload a PDF, then ask questions answered from its text. |
| Structured Extraction & Tone Studio | Turns free text into structured output (JSON or TOON) and adjusts the tone. |
| NLP Foundations | Interactive explanations of tokenization, embeddings, and classification. |
| Fine-Tuning Simulator / LoRA Playground | Explains how fine-tuning and LoRA change a model. These are simulations, not real training runs. |

## Architecture

```
React + Vite + TypeScript (src/)
        │  supabase-js (anon key)
        ▼
Supabase
  ├─ Auth + Postgres (history tables, row-level security)
  └─ Edge functions (supabase/functions/)
        │  rate limit check (rate_limits table)
        ▼
  AI gateway (LOVABLE_API_KEY)
```

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router.
- **Backend:** Supabase Postgres with row-level security, and Deno edge functions.
- **Access model:** The tools are open to everyone. Edge functions treat signed-out requests as anonymous. History is saved only for signed-in users, and row-level security keeps each user's rows private.
- **Rate limits:** Each AI function allows 30 requests per hour per IP, plus a global daily cap. Both are set in `supabase/functions/_shared/rateLimit.ts` and can be changed with function secrets (see below).

## Run it locally

Requirements: Node.js 20+ and npm.

```sh
git clone https://github.com/Nob1taaaa/remix-of-ai-companion-suite.git
cd remix-of-ai-companion-suite
npm ci
cp .env.example .env   # then fill in your Supabase values
npm run dev
```

### Environment variables

Set these in `.env` for the frontend:

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key. This is safe to expose in the browser. |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID |

Set these as secrets for the edge functions (`supabase secrets set ...`):

| Secret | Purpose |
| --- | --- |
| `LOVABLE_API_KEY` | Key for the AI gateway. Keep it secret. |
| `RATE_LIMIT_PER_IP_PER_HOUR` | Optional. Default `30`. |
| `RATE_LIMIT_GLOBAL_PER_DAY` | Optional. Default `2000`. |

Apply the database migrations in `supabase/migrations/` to your project before using the app.

## Scripts

```sh
npm run dev      # start the dev server
npm run lint     # ESLint
npm test         # unit tests (Vitest)
npm run build    # production build
```

CI runs lint, tests, and the build on every push and pull request (`.github/workflows/ci.yml`).

## Project layout

```
src/
  components/   tool UIs (one file per tool)
  pages/        routes: /, /auth, /my-lab, /nlp-foundations, /fine-tuning, /agents
  lib/          shared helpers
supabase/
  functions/    edge functions (one folder per AI tool) + _shared/
  migrations/   database schema, RLS policies, rate limiter
```

## Tech stack

React · TypeScript · Vite · Tailwind CSS · shadcn/ui · Supabase (Postgres, Auth, Edge Functions) · Deno · Vitest · ESLint

## Known limitations

- The rate limiter counts by IP address, so users behind a shared network share one limit.
- The fine-tuning and LoRA pages are simulations.
- Lint shows 8 warnings from generated shadcn/ui files. They don't block the build.
