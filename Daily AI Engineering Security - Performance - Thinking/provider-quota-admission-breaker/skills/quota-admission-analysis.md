# Skill: Quota Admission Analysis

## Purpose
Convert provider failure evidence into a conservative, resource-scoped admission decision that prevents repeated doomed model calls.

## Trigger
A model/subagent request returns a typed usage-limit/quota exhaustion condition, or a transient rate-limit response carries authoritative retry/reset metadata.

## Inputs
Failure class, provider, endpoint/deployment, account or credential-slot identity when available, model/quota bucket when authoritative, retry/reset metadata, current breaker state, request resource key, generation.

## Preconditions
The orchestration layer can distinguish typed provider failures from free text. Resource identity fields are either authoritative or explicitly unknown.

## Required context
Which work consumes the affected provider resource; which work is local/MCP or belongs to another provider resource; retry policy; task stop conditions.

## Allowed tools
Structured logs, provider error payloads, admission-state store, deterministic verifier, read-only telemetry.

## Constraints
- MUST NOT trip a shared breaker from error text alone.
- MUST NOT treat every HTTP 403/429 as terminal exhaustion.
- MUST NOT block unrelated provider resources or local/MCP work.
- MUST preserve reset/retry metadata when present.
- MUST bound half-open probes to one per generation unless policy explicitly permits another after a new cooldown.

## Procedure
1. Normalize the failure into `terminal_exhaustion`, `transient_rate_limit`, or `ambiguous`.
2. Build the finest authoritative resource key; if resource sharing cannot be established, scope only to the current request.
3. For terminal exhaustion, trip the resource breaker before handing control back to orchestration.
4. For transient rate limit with authoritative retry metadata, set a cooldown; do not mark permanently terminal.
5. On each later model request, run pre-dispatch admission against the current resource generation.
6. Allow unrelated resources and non-provider work.
7. After reset/cooldown, permit exactly one half-open probe for the current generation.
8. If probe succeeds, open the breaker with a new generation; if it fails with authoritative exhaustion, close it again and update reset metadata.
9. Compare before/after provider-call counts and ensure no healthy resource was blocked.

## Decision points
- Ambiguous resource identity: deny only the current failed request; no shared trip.
- Typed terminal exhaustion + matching authoritative key: deny later same-resource requests.
- Transient typed rate limit + reset time: cooldown then one probe.
- Different resource key: allow.
- Local/MCP-only operation: allow.

## Expected output
A structured admission record with decision, resource key, generation, reason, reset time, source evidence, and verification status.

## Metrics
Avoided provider calls, post-exhaustion call count, false trips, half-open probes, time-to-recovery, admission latency, unrelated-work continuation rate.

## Verification
Replay a mixed workload containing same-resource children, a different provider resource, and local work. After terminal exhaustion, same-resource network calls must be zero while unrelated work continues.

## Failure handling
If classification or scope is uncertain, fail conservative at the current request only and escalate evidence collection. Never broaden the breaker based on a guess.

## Stop conditions
Verification passes; authoritative scope cannot be established; or two implementation/measurement iterations fail to reduce redundant calls without regressions.