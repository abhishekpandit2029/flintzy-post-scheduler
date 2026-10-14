# Flintzy Post Scheduler

A responsive social post scheduler dashboard built with Next.js App Router, React, TypeScript, and Tailwind CSS. The queue starts empty; posts created in the current session are held in the frontend and created through one mocked API route.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Create post API

`POST /api/posts` accepts JSON with `content`, `platforms` (one or more of `Facebook`, `Instagram`, `X`, `TikTok`), optional `mediaUrl`, and `scheduledAt` (an ISO UTC timestamp). It validates required fields, platform limits, URL format, and that the scheduled time is in the future. On success it returns `{ "post": ... }` with status `201`.

## Decisions and current scope

- The dashboard starts with an empty queue and zeroed post statistics. New posts appear after scheduling them.
- Search, platform, and status filters are reflected in URL query parameters, so refreshing keeps the current view.
- The date-time input uses the browser's local time. The request converts it to UTC ISO format.
- Character limits are checked per selected platform in the composer and again in the API route.
- Retrying a failed post updates the queue immediately, waits one second, then succeeds or fails at random (20% failure).
- Posts are persisted in browser local storage and remain available after refresh on the same browser and device. The create API validates a post and returns it; the browser stores the queue.
- A one-second client timer changes due scheduled posts to published, with a 20% simulated publish failure rate. Failed posts can be retried; retry attempts have a 20% failure rate.
- Social account connections and real platform publishing are not integrated. The publish lifecycle is a local simulation and requires the app to be open.

## Build

```bash
npm run build
```
