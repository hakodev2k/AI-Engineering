# API and SDK Evaluation

## Purpose
Evaluate an API or SDK from the developer's perspective and turn friction into actionable engineering and documentation feedback.

## When to use
Use before launches, major SDK releases, onboarding campaigns, or after recurring integration failures.

## Inputs
API contract, SDK, auth flow, docs, sample tasks, error responses, rate limits, version policy.

## Context to inspect
Installation, first-call experience, naming consistency, types, pagination, retries, idempotency, errors, observability, compatibility, and migration guidance.

## Core knowledge
Developer experience is shaped by time-to-first-success, predictability, debuggability, safety, and consistency. Evaluate the public contract, not internal implementation elegance.

## Procedure
1. Choose representative tasks from novice through production integration.
2. Start with only public documentation.
3. Record time, decisions, failures, and undocumented assumptions.
4. Inspect API/SDK ergonomics and language idioms.
5. Exercise invalid input, auth failure, throttling, timeout, and partial failure.
6. Review retry/idempotency semantics and error actionability.
7. Compare SDK behavior across supported versions/languages where relevant.
8. Rank findings by developer impact and frequency.
9. Provide minimal reproductions and proposed acceptance criteria.
10. Retest fixes.

## Decision points
Escalate contract defects separately from documentation gaps. Prefer backward-compatible fixes unless the current behavior creates material security or correctness risk.

## Common failure patterns
Testing only happy paths, relying on internal knowledge, vague feedback, ignoring error ergonomics, confusing preference with defect, and omitting reproducible evidence.

## Verification
Each finding must include reproduction, expected versus actual behavior, impact, environment/version, and retest evidence when resolved.

## Expected output
A prioritized DX assessment with reproducible issues, recommendations, and validated fixes.

## Stop conditions
Stop when public artifacts differ from unreleased internals, required access is unavailable, or testing could affect production data without authorization.