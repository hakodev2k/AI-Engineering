# Webhook Security Gate Workflow

## Trigger
New or modified inbound webhook, signing middleware, secret rotation code, replay/idempotency behavior, or provider adapter.

## Entry conditions
Repository available; provider identified; no production mutation required for investigation.

## Stages
1. **Preflight — Explorer:** run `hooks/pre-implementation.md`; locate route and signing boundary.
2. **Evidence — Explorer:** execute `skills/discover-signing-boundary.md`; validate evidence.
3. **Checkpoint:** `blocked` stops. `ready` hands off.
4. **Implementation — Implementation Agent:** execute `skills/implement-verification.md`.
5. **Focused tests:** valid and adversarial transport/replay cases.
6. **Independent verification — Verification Agent:** execute `skills/verify-replay-resistance.md`.
7. **Final hook:** execute `hooks/final-verification.md`.
8. **Complete:** evidence status must be `verified`.

## Artifacts
Evidence JSON, scoped diff, build/test logs, verifier result.

## Retry rules
Tool/network/test-runner transient failures: max 2 retries, preserve prior logs. Build/test assertion failure: return once to Implementation Agent for a bounded fix, then re-run verification. A second failed verification stops as blocked. Permission/protocol ambiguity is non-retryable.

## Approval points
Stop before production deployment, secret rotation/change, gateway/proxy changes, replay-record deletion, security weakening, infrastructure changes, or breaking webhook response changes.

## Definition of Done
Evidence validates; authenticity precedes parsing; freshness and atomic replay rules are satisfied; adversarial/concurrent duplicate tests pass; build/relevant tests pass; verifier reports `verified`; no approval boundary remains pending.