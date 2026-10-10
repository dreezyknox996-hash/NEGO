---
name: Next.js cache build failures
description: A recurring WasmHash crash when rebuilding after reusing Next.js generated output in this Replit environment.
---

On 2026-10-10, `next build` failed twice in webpack's `WasmHash._updateWithBuffer` with “Cannot read properties of undefined (reading 'length')” while reusing `.next`. Removing only the generated `.next` directory and rebuilding succeeded both times.

**Why:** This points to stale or inconsistent generated build state rather than a TypeScript or React source error.

**How to apply:** If this exact crash recurs, stop the development workflow, delete only the generated `.next` directory, and rerun `npm run build`. Do not remove dependencies or project data.
