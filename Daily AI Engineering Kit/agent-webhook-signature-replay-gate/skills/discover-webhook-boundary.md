# Skill: Discover Webhook Boundary

## Purpose
Map the exact inbound verification path and determine whether attacker-controlled data can reach side effects before authenticity and replay checks succeed.

## When to use
Before implementing or reviewing any webhook safety change.

## Inputs
Endpoint route, provider documentation, framework request pipeline, secret provider, replay store, side-effect services.

## Preconditions
Repository is readable and the target endpoint is identifiable.

## Allowed tools
Repository search/read, tests, local request fixtures, framework documentation already available to the task.

## Constraints
Read-first. Do not edit, deploy, rotate secrets, or query production data.

## Process
1. Locate endpoint registration and handler entry point.
2. Trace request-body acquisition and determine whether raw bytes remain available.
3. Locate signature/timestamp extraction.
4. Identify the exact signed-payload construction.
5. Trace secret retrieval without exposing the secret.
6. Trace every side effect reachable from the handler.
7. Locate replay/dedup logic and determine whether the claim is atomic.
8. Locate tests covering valid, invalid, stale, missing, duplicate, and concurrent duplicate requests.
9. Produce evidence-backed findings with file/line references and confidence.
10. Stop if provider signing semantics are ambiguous and cannot be established from authoritative context.

## Expected output
Boundary map, facts, hypotheses, findings, affected components, missing tests, and recommended verification.

## Verification
Every path from request entry to side effect crosses signature, freshness, and replay gates in the required order.

## Failure handling
Missing authoritative signing semantics is a blocking validation failure. Permission/tool failure stops with evidence preserved.