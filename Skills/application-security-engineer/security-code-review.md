# Security Code Review

## Purpose
Perform focused manual review of code paths where automated tools or ordinary peer review may miss security semantics.

## When to use
Use for authentication, authorization, parsing, crypto, file handling, deserialization, sensitive business logic, and high-risk changes.

## Inputs
Diff, surrounding code, requirements, threat model, tests, framework documentation, and deployment assumptions.

## Context to inspect
Read beyond the diff: callers, callees, policy helpers, error paths, configuration, persistence, and tests. Understand data and privilege flow.

## Core knowledge
Security defects frequently arise from mismatched assumptions across layers. Review invariants and attacker-controlled state, not just suspicious functions.

## Procedure
1. Establish intended security properties and changed trust boundaries.
2. Identify attacker-controlled inputs and privileged effects.
3. Trace authentication and authorization decisions end-to-end.
4. Review validation, encoding, query construction, file/URL handling, and deserialization.
5. Inspect concurrency, replay, idempotency, and state transitions for workflow abuse.
6. Review secrets, logging, and error behavior.
7. Challenge helper functions and framework defaults against actual configuration.
8. Write concrete findings with exploit scenario and remediation.
9. Add negative tests for confirmed issues.

## Decision points
Request redesign when local patches cannot preserve a clear security invariant. Avoid stylistic comments unless they materially affect security or maintainability of controls.

## Common failure patterns
Reviewing only changed lines, assuming internal callers are trusted, missing alternate routes, and recommending vague 'sanitize input' fixes.

## Verification
Inspect final code and execute targeted negative tests. Confirm the security invariant holds across alternate paths.

## Expected output
Actionable findings with severity rationale, code-level fixes, and verification evidence.

## Stop conditions
Escalate when exploitability implies active compromise, required domain semantics are unavailable, or changes affect critical controls owned elsewhere.