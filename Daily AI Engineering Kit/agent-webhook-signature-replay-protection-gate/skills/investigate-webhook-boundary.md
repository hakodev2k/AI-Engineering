# Skill: Investigate Webhook Boundary

## Purpose
Map the exact authentication and replay boundary before editing code.

## When to use
Before implementing or repairing any inbound signed webhook.

## Inputs
Repository root, route/handler hint, provider contract, incident/task description.

## Preconditions
Repository is readable. Provider signing semantics are available from repository evidence or authoritative documentation.

## Allowed tools
Repository search/read, test runner, local static scanner, safe local requests, provider documentation lookup.

## Constraints
No production writes, secret changes, deployments, destructive actions, or security weakening.

## Process
1. Locate route registration, middleware order, handler, parser, and downstream side effects.
2. Identify where raw bytes first enter the application and whether any middleware consumes or transforms them.
3. Record signature header, timestamp header, signed payload construction, algorithm, encoding, and tolerance from evidence.
4. Trace the verification call to its implementation or SDK.
5. Locate replay/idempotency state and prove whether reservation is atomic.
6. Locate acknowledgement behavior and determine when side effects become durable.
7. Find unit/integration tests and existing fixtures.
8. Run `scripts/scan-webhook-security.py` to identify gaps worth inspecting.
9. Classify every observation as fact, hypothesis, or scanner suspicion.
10. Produce a boundary map with file/line evidence and open questions.

## Expected output
A concise propagation map: inbound bytes → verification → freshness → replay reservation → business processing → response.

## Verification
Each map edge cites repository/test/provider evidence. Unknown provider semantics remain blocked rather than guessed.

## Failure handling
If raw-body ownership or provider semantics cannot be established, stop implementation and mark the task blocked.

## Stop conditions
Stop when all affected boundaries are mapped or when a material contract fact cannot be obtained safely.
