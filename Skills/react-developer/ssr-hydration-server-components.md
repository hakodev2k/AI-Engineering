# SSR, Hydration, and Server Components

## Purpose
Design React rendering across server and client boundaries while avoiding hydration errors and unnecessary client JavaScript.

## When to use
Use with SSR, streaming, React Server Components, hybrid frameworks, or hydration defects.

## Inputs
Framework architecture, data sources, interactivity needs, caching rules, SEO/performance requirements.

## Preconditions
Confirm framework-specific server/client component semantics.

## Context to inspect
Server/client boundaries, serialized props, browser-only APIs, data fetching, caching, hydration warnings.

## Core knowledge
Server rendering reduces or shifts client work but introduces serialization, cache, environment, and hydration constraints. Interactive state belongs in client boundaries.

## Procedure
1. Classify components as static/server/interactivity-dependent.
2. Keep client boundaries as narrow as practical.
3. Fetch secure/server-owned data on the server when appropriate.
4. Ensure serialized data is safe and stable.
5. Avoid non-deterministic server/client render differences.
6. Isolate browser APIs to client execution.
7. Define caching/revalidation explicitly.
8. Test streaming, navigation, and hydration under failures.

## Decision points
Prefer server components for non-interactive data/rendering when the framework supports them; use client components when browser state/effects are required.

## Common failure patterns
Hydration mismatch, leaking secrets into serialized props, broad client boundaries, duplicated fetching, stale server caches.

## Verification
Production build, hydration-warning check, HTML inspection, JS payload comparison, and failure-path tests.

## Expected output
Correct rendering boundaries with controlled client cost.

## Stop conditions
Stop if framework rendering/cache semantics are unclear or version-specific behavior requires confirmation.