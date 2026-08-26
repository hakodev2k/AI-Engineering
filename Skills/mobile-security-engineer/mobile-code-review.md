# Mobile Security Code Review

## Purpose
Review mobile code changes for exploitable trust, data, authorization, platform, and lifecycle weaknesses.

## When to use
Use for security-sensitive pull requests, architectural changes, incident fixes, and high-risk dependency integrations.

## Inputs
Code diff, requirements, threat model, architecture, tests, platform configuration.

## Preconditions
Understand intended behavior and identify security-sensitive data/operations touched by the change.

## Context to inspect
Callers/callees, backend contracts, storage, lifecycle callbacks, exported components, permissions, concurrency, error paths, and build variants.

## Core knowledge
Review invariants rather than isolated dangerous APIs. Mobile bugs often arise from lifecycle transitions, attacker-controlled intents/URLs, client trust, and insecure fallback behavior.

## Procedure
1. Establish security objective of the change.
2. Trace untrusted inputs to sensitive sinks.
3. Trace secrets and personal data through storage/logging/network paths.
4. Verify authorization at trustworthy boundaries.
5. Review platform exposure and permissions.
6. Check failure, cancellation, background, restore, and account-switch paths.
7. Review dependency/config changes.
8. Require tests for discovered abuse cases.
9. Distinguish required fixes from defense-in-depth suggestions.

## Decision points
Block changes for exploitable invariant violations; document lower-risk hardening separately. Avoid demanding patterns unsupported by the actual threat model.

## Common failure patterns
Diff-only review without context, style comments replacing risk analysis, trusting client validation, missing lifecycle paths, and accepting tests that prove only happy paths.

## Verification
Confirm fixes in code and execute targeted negative tests when practical.

## Expected output
Prioritized review findings with concrete attack path, impact, remediation, and verification evidence.

## Stop conditions
Escalate when architecture or backend behavior needed to assess impact is unavailable.