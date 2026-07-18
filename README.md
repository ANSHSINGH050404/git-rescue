# git-rescue

**Recover from Git disasters with Gemini.** Describe what went wrong; get clear recovery steps.

**Live:** [git-rescue.vercel.app](https://git-rescue.vercel.app)

## What it is

A focused Next.js helper for lost commits, detached HEADs, botched rebases, and more — powered by the **Google GenAI SDK**.

## Stack

- Next.js 15 + TypeScript + Tailwind  
- Google Gemini (`@google/genai`)  
- Upstash Redis (rate limiting / caching)  
- Vercel Analytics  

## Getting started

```bash
git clone https://github.com/ANSHSINGH050404/git-rescue.git
cd git-rescue
npm install
```

```env
GOOGLE_GENERATIVE_AI_API_KEY=...
# optional Upstash Redis vars if used
```

```bash
npm run dev
```

## Author

[ANSHSINGH050404](https://github.com/ANSHSINGH050404)