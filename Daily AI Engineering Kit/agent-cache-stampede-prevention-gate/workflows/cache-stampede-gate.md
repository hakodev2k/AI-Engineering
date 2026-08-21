# Cache Stampede Prevention Gate Workflow

## Trigger
A new/changed cache-backed path, synchronized backend spikes after cache expiry, hot-key incident, or pre-release cache review.

## Entry conditions
Target cache path is known; repository and non-destructive test execution are available.

## Inputs
Cache keys, TTL/expiry policy, backend dependency, cache provider, caller concurrency, logs/metrics, tests.

## Stages
1. **Context** — Cache Investigator maps read → miss → regeneration → write → response.
2. **Static scan** — run `python3 scripts/scan-cache-stampede.py <repo> --output scan.json`; exit 1 means review findings, not automatic failure.
3. **Baseline** — capture hit/miss behavior and backend call count for concurrent cold/expiry misses.
4. **Hypothesis** — classify unbounded regeneration, synchronized expiry, retry amplification, global invalidation, or failure-fallback risks.
5. **Plan** — define smallest mitigation and focused concurrent-miss/expiry/failure tests.
6. **Approval checkpoint** — stop if mitigation requires production cache flush/config/deployment, infrastructure, schema, secret, or data changes.
7. **Execute** — implement approved/in-scope mitigation.
8. **Test** — verify concurrent misses, expiry boundary, backend call count, and backend failure behavior.
9. **Review** — inspect diff for global locking, semantic changes, stale-data risk, or hidden retries.
10. **Independent verification** — Verification Agent re-runs relevant checks and challenges the concurrency bound.
11. **Contract validation** — save assessment JSON and run `python3 scripts/validate-assessment.py assessment.json`.

## Checkpoints
Cache-key scope known; backend regeneration identified; concurrency bound defined; expiry spreading evaluated; failure fallback understood.

## Retry rules
At most two retries for transient test/tool/environment failures. Preserve command, parameters, output, backend call count, and attempt. Deterministic failures require diagnosis or change before another run. After two transient failures, mark `blocked` and escalate.

## Failure paths
Permission/environment failure → preserve evidence and block. Business-rule ambiguity around stale data → block for owner decision. Verification failure → `fail`. Dangerous remediation → `needs-approval` before mutation.

## Stop conditions
Required context unavailable; production mutation is the only reproduction path; approval is missing; two repeated transient failures; verifier finds unbounded regeneration or untested failure behavior.

## Produced artifacts
`scan.json`, optional `simulation.json`, repository-specific test evidence, and assessment matching `schemas/assessment.schema.json`.

## Definition of Done
Concurrent miss tested; backend call count verified; expiry spread verified; failure path tested; independent verification completed; assessment validates; required approvals exist; remaining risks are recorded; no blocking failure remains for `pass`.
