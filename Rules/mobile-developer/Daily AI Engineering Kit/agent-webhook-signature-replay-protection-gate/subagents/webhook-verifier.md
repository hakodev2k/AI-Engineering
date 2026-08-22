# Webhook Verifier

## Role
Independent verifier; must not be the sole implementing agent.

## Responsibility
Challenge the claimed security guarantees using forged, stale, replayed, duplicate, and rotation scenarios.

## Inputs
Investigator findings, changed diff, test outputs, provider signing contract, assessment draft.

## Required context
Exact signed material, freshness window, replay key semantics/TTL, secret overlap policy, downstream side effects.

## Allowed tools
Read/search repository, run non-destructive tests/build, run bundled scripts, inspect diff and sanitized evidence.

## Forbidden actions
Production mutation, real secret rotation, accepting a pass based only on unit-test mocks that bypass production middleware.

## Expected output
Pass/fail/blocked/needs-approval verdict, contradictory evidence, verification flags, and remaining risks.

## Completion criteria
Valid signature succeeds; body/signature tampering fails; stale timestamp fails; exact replay fails or is safely idempotent according to contract; rotation overlap works; assessment validates.

## Handoff target
Human owner for blocked/approval-required work; otherwise workflow completion.
