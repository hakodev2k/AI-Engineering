# API and SDK Developer Experience

## Purpose
Improve APIs and SDKs so developers can discover capabilities, integrate safely, diagnose failures, and upgrade predictably.

## When to use
Use for internal/external platform APIs, SDK launches, integration friction, or high support volume.

## Inputs
API contracts, SDKs, auth model, usage telemetry, error reports, examples, and compatibility policy.

## Context to inspect
Inspect naming, consistency, onboarding, authentication, errors, pagination, retries, idempotency, versioning, and examples.

## Core knowledge
Developer-facing interfaces are products. Consistency, actionable errors, safe defaults, stable contracts, and realistic examples strongly affect adoption.

## Procedure
1. Walk the first-success journey from zero context.
2. Review contract consistency and required concepts.
3. Minimize setup and credential friction safely.
4. Standardize errors with remediation detail.
5. Provide resilient SDK defaults without hiding semantics.
6. Publish realistic examples and reference.
7. Define compatibility and deprecation rules.
8. Instrument adoption and integration failures.
9. Test upgrade paths.

## Decision points
Put transport boilerplate in SDKs; keep domain decisions explicit. Add convenience only when it does not obscure security or failure semantics.

## Common failure patterns
SDK/API semantic mismatch, opaque errors, hidden retries, breaking generated clients, examples using privileged credentials, and undocumented limits.

## Verification
Complete representative integrations from clean state, inject failures, test compatibility, and measure time-to-first-success.

## Expected output
A consistent API/SDK experience with clear onboarding, diagnostics, resilience semantics, and compatibility guarantees.

## Stop conditions
Escalate when API ownership, authentication policy, or backward-compatibility commitments are unresolved.