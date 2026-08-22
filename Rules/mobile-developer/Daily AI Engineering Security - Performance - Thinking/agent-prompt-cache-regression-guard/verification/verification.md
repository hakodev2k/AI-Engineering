# Verification Report

## Status model
This package distinguishes:
- **Implemented** — artifact/code exists and is wired into the documented procedure.
- **Measured** — deterministic tests or telemetry calculations were executed.
- **Verified** — evidence satisfies the package gate; this does not claim a production provider regression has been fixed until integrated with real workload telemetry.

## Implemented
- Provider-neutral request/invalidator telemetry contract.
- Policy thresholds for cache-read ratio, unexplained resets, cache-creation amplification, minimum sample size, and p95 latency regression.
- Deterministic telemetry validator/analyzer.
- Reset attribution using known invalidators and cache-relevant fingerprint changes.
- Baseline/candidate comparison gate.
- Skills, rules, subagents, workflows and hooks.
- Regression tests covering healthy cache behavior, unexplained reset, known invalidator, fingerprint change, malformed telemetry and insufficient data.

## Measured
On 2026-08-19 UTC+7, the analyzer contract-test suite was executed against the generated implementation logic using Python `unittest`:

- Tests run: 6
- Failures: 0
- Errors: 0
- Result: `OK`

The GitHub integration was also used to fetch the saved `scripts/cache_health.py` after creation, confirming the implementation was present in the target repository.

## Verified
Verified at package level:
- malformed cache telemetry is rejected rather than silently coerced;
- an eligible high-read → low-read transition with unchanged fingerprint and no invalidator is classified `unexplained`;
- the same transition after a configured invalidator is classified `explained_known_invalidator`;
- a cache-relevant fingerprint mutation is classified separately from unexplained reset;
- insufficient samples cannot be reported as a passing cache benchmark;
- retry/experiment loops are bounded;
- correctness/security requirements cannot be weakened to improve cache metrics.

Not yet claimable from package generation alone:
- a particular provider/runtime cache bug has been fixed;
- production latency/cost has improved;
- configured default thresholds suit every workload.

Those require baseline/candidate telemetry from the integration target.

## Definition of Done for an adoption
1. Evidence and current limitations documented.
2. Request cache telemetry emitted and validated.
3. Known invalidator events emitted.
4. Healthy representative baseline captured.
5. Candidate change measured under comparable workload.
6. Candidate passes cache-read, unexplained-reset, creation-amplification and latency gates.
7. Workload correctness/security tests pass.
8. Independent verifier reproduces comparison from raw artifacts.
9. Remaining risks and unobservable provider fields are documented.
10. No blocking unexplained regression remains.

## Safety and failure checks
- No credentials are required by package scripts.
- Scripts use local files and standard Python library only.
- Analyzer does not mutate provider/runtime state.
- Missing observability produces failure/insufficient-data state rather than fabricated metrics.
- Maximum controlled experiment retries: two.
