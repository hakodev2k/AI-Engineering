# Developer Experience Rules

## Purpose
Ensure the platform reduces engineering friction without hiding operational truth.

## Scope
Applies to portals, CLIs, SDKs, documentation, onboarding, local workflows, and platform feedback loops.

## MUST
- Common workflows MUST have documented happy paths and failure recovery.
- Errors MUST identify the failed action, likely cause, and remediation when known.
- Platform UX changes MUST preserve scriptability for automation-critical workflows.
- Adoption decisions MUST use evidence from user feedback, telemetry, or workflow measurements.

## MUST NOT
- MUST NOT optimize convenience by weakening security, traceability, or ownership.
- MUST NOT require teams to understand provider internals for routine platform use.
- MUST NOT claim improved developer experience without measuring relevant friction.

## SHOULD
- Prefer consistent terminology and interaction patterns across platform surfaces.
- Track time-to-first-success and recurring failure points.

## Exceptions
Specialized workflows may expose advanced controls when the intended audience and risks are explicit.

## Verification
Use usability tests, workflow telemetry, support-ticket trends, documentation review, CLI/API tests, and user feedback.