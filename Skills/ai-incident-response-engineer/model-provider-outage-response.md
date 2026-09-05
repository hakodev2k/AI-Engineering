# Model Provider Outage Response

## Purpose
Respond to external or internal model-provider degradation while preserving correctness, safety, and service continuity.

## When to use
Use for elevated model latency, errors, rate limits, regional failures, silent model substitutions, or quality regressions tied to a provider.

## Inputs
Provider metrics, status, error codes, routing policy, fallback models, contractual limits, quality baselines, traffic distribution.

## Preconditions
Fallback behavior and model compatibility are understood.

## Context to inspect
Model gateway, retries, timeouts, quotas, regional routing, model aliases, safety behavior, token limits, structured-output compatibility.

## Core knowledge
A fallback that returns 200 responses can still be unsafe if semantics, context window, tool-calling, or refusal behavior differs. Retries can amplify provider incidents.

## Procedure
1. Verify failure against internal telemetry.
2. Identify affected models, regions, and request classes.
3. Reduce retry amplification.
4. Check quota and rate-limit exhaustion.
5. Evaluate configured fallbacks against task requirements.
6. Shift traffic gradually to validated alternatives.
7. Disable incompatible capabilities if necessary.
8. Monitor quality, safety, latency, and cost after rerouting.
9. Restore traffic gradually after provider recovery.

## Decision points
Prefer graceful degradation over incompatible fallback. Keep high-risk workloads on known-safe models even if capacity is lower.

## Common failure patterns
Retry storms, blind failover, hidden model alias changes, mismatched structured output, and restored traffic before stability.

## Verification
Synthetic probes and production metrics confirm acceptable latency, error rate, output contract, and safety behavior.

## Expected output
Provider incident actions, routing changes, risk notes, and recovery criteria.

## Stop conditions
Escalate when no compatible fallback exists or provider behavior violates security/privacy requirements.