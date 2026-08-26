# Live Demo Reliability

## Purpose
Engineer live technical demos that remain credible and useful under real venue and service failure conditions.

## When to use
Use for talks, streams, workshops, launch events, sales-adjacent technical sessions, or recorded demonstrations.

## Inputs
Demo goal, code, external services, credentials, venue environment, time budget, fallback requirements.

## Preconditions
Use non-production data/accounts and approved credentials. Never expose secrets or sensitive customer information.

## Context to inspect
Network dependencies, rate limits, quotas, auth expiry, cold starts, local resources, screen readability, reset/cleanup steps, and failure modes.

## Core knowledge
Demo reliability comes from reducing uncontrolled dependencies, rehearsing state transitions, and preserving an honest fallback—not from pretending failure is impossible.

## Procedure
1. Define the single behavior the demo proves.
2. Remove unrelated moving parts.
3. Isolate demo accounts/data and verify quotas.
4. Externalize secrets and sanitize terminal history.
5. Make setup/reset idempotent.
6. Preflight dependencies and health.
7. Add deterministic checkpoints.
8. Prepare local recordings/screenshots/output as fallback.
9. Rehearse failure recovery and narration.
10. Run a final preflight immediately before delivery.
11. Clean up resources and rotate exposed credentials if needed.

## Decision points
Prefer prerecorded output when live execution adds little explanatory value. Prefer local emulation only when behavior remains representative.

## Common failure patterns
Production credentials, fragile shared state, invisible terminal text, unbounded setup, surprise MFA, expired tokens, hidden environment assumptions, and no fallback.

## Verification
Execute setup-reset-run cycles repeatedly, test without network where relevant, validate fallback artifacts, and scan displayed surfaces for secrets/PII.

## Expected output
A reproducible demo package with preflight, reset, run, fallback, and cleanup procedures.

## Stop conditions
Do not proceed when secrets may be exposed, demo actions can affect production, required services are unhealthy, or fallback material misrepresents actual behavior.