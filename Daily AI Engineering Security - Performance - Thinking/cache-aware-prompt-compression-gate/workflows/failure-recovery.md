# Workflow — Failure Recovery

## Trigger
A candidate fails cost, latency, cache, quality, or critical-context gates.

## Goal
Recover with bounded investigation rather than repeatedly recompressing the same prompt.

## Stages
1. Classify the failure: `quality`, `critical-context`, `cache-hit`, `cost`, `latency`, or `insufficient-evidence`.
2. Preserve baseline and failing candidate artifacts.
3. Identify the first measurable root cause.
4. Form exactly one revised hypothesis.
5. Run one new candidate if candidate budget remains.
6. Re-execute the deterministic gate.
7. Escalate when the budget is exhausted or evidence remains unavailable.

## Retry policy
Maximum retries are bounded by `config/policy.json:max_candidates`. Identical prompt transformations MUST NOT be retried.

## Fallback
Use the last verified baseline configuration.

## Escalation
Require human/provider investigation when usage accounting is contradictory, provider cache behavior cannot be reproduced, or quality evaluation is ambiguous.

## Stop condition
No remaining candidate budget, unresolved critical-context loss, or missing required benchmark evidence.

## Definition of Done
The system either returns to the verified baseline or produces a newly verified candidate; it never treats a failed candidate as accepted.