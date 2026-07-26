# Hsi-Ning Wang — Personal Website

A minimal personal website built with Next.js and prepared for Vercel.

The visual design is based on
[zirafa/simple-website-template](https://github.com/zirafa/simple-website-template).
Its background image, logo, typography, colors, and single-page navigation style
are intentionally preserved.

## Local development

```bash
npm install
npm run dev
```

## Deploy

Import this directory into Vercel. Vercel will detect Next.js and run
`npm run build` automatically.

## Post a photo set

1. Put the original images in `public/gallery/<set-name>/`.
2. Add `content/gallery/<set-name>.json`.
3. Commit and push. Vercel will publish the set automatically.

The JSON file uses this format:

```json
{
  "title": "Set title",
  "date": "2026-07-26",
  "description": "A short introduction to the photo set.",
  "published": true,
  "photos": [
    {
      "src": "/gallery/set-name/photo-01.jpg",
      "alt": "An accessible description of the photo",
      "caption": "An optional visible caption.",
      "width": 2400,
      "height": 1600
    }
  ]
}
```

The JSON filename becomes the URL. For example,
`content/gallery/summer-trip.json` is published at `/gallery/summer-trip`.
Set `published` to `false` to keep a group as a draft. The first photo is used
as the group cover.

## Post a project

Create `content/projects/<project-name>.md`. Projects use Markdown for their
details and appear as cover cards in the Projects tab.

```md
---
title: "Project title"
date: "2026-07-26"
summary: "A short project introduction."
cover: "/gallery/project-name/cover.jpg"
coverAlt: "An accessible description of the cover"
coverWidth: 2400
coverHeight: 1600
tags:
  - Next.js
  - TypeScript
published: true
---

## Overview

Write the full project details here using Markdown.
```

The Markdown filename becomes the URL. For example,
`content/projects/personal-site.md` is published at
`/projects/personal-site`. Set `published` to `false` to keep a project as a
draft.
