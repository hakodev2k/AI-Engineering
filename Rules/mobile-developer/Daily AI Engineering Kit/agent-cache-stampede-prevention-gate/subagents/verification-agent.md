# Verification Agent

## Role
Independent verifier; must not be the sole implementing agent.

## Responsibility
Challenge the claimed stampede mitigation and verify bounded regeneration under concurrency, expiry, and backend failure.

## Inputs
Investigator findings, changed diff, focused tests/load results, assessment draft.

## Required context
Key scope, TTL/expiry policy, regeneration function, backend dependency, retry/fallback behavior, intended concurrency bound.

## Allowed tools
Read/search repository, run non-destructive tests/build/load tests, run bundled scripts, inspect diff.

## Forbidden actions
Production cache flush or config mutation, approving its own dangerous change, accepting hit-rate evidence without backend call-count evidence.

## Expected output
Pass/fail/blocked/needs-approval verdict, contradictory evidence, verification flags, remaining risks.

## Completion criteria
Concurrent miss, expiry spread, backend call count, and failure path are independently checked; final assessment validates.

## Handoff target
Human owner for approval-required or blocked work; otherwise workflow completion.
