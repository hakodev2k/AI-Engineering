# Verification Report

## Status model
- **Implemented:** package files and deterministic guard logic exist.
- **Measured:** deterministic tests measure raw vs visible payload size and verify spill/recovery behavior.
- **Verified:** production-quality improvement requires representative workload evaluation; this package does not claim production verification without that evidence.

## Implemented
- pre-context output measurement and budget enforcement;
- pass-through for small text output;
- full raw spill with SHA-256 for oversized output;
- deterministic head/tail/priority extraction with source line numbers;
- explicit omission/truncation metadata;
- targeted search/range rehydration;
- spill-root path containment;
- SHA-256 integrity verification;
- bounded line/byte rehydrate limits;
- JSONL event metrics and aggregation;
- fail-closed behavior for oversized output when storage/integrity cannot be established.

## Deterministic test coverage
`tests/test_tool_output_guard.py` verifies:
1. small output remains pass-through;
2. oversized output spills;
3. a failure line in the middle of a large log is preserved by priority extraction;
4. raw artifact SHA-256 matches the envelope;
5. targeted search rehydrates the omitted failure evidence;
6. wrong SHA-256 fails closed;
7. an artifact outside the spill root is rejected;
8. event analysis reports spill and byte reduction.

## Measurable acceptance criteria
For a candidate production integration, capture before/after values for:
- input/tool-output tokens per task;
- raw vs model-visible tool-output tokens;
- context utilization peak;
- cost/task;
- p50/p95 agent latency;
- compaction frequency/failure rate;
- spill and rehydrate rate;
- task correctness/test-pass rate.

Suggested initial gate:
- >= 50% reduction in model-visible tokens for tools selected for enforcement;
- 0 unrecoverable required-output losses in the evaluation corpus;
- 0 accepted hash/path-integrity failures;
- no statistically/materially significant task-quality regression versus full-output baseline;
- bounded rehydration with no default full-artifact replay.

## Security verification
The package preserves security boundaries by requiring spill storage to meet or exceed source data controls, rejecting path escapes and hash mismatches, and avoiding public artifact exposure by default. Production deployments still need storage ACL, retention, encryption, tenant separation, and secret-handling review appropriate to their environment.

## Failure matrix
| Failure | Detection | Retry | Fallback | Stop condition |
|---|---|---:|---|---|
| spill write fails | I/O error | 1 | structured failure | second failure |
| hash mismatch | recompute SHA-256 | 0 | regenerate/rerun only if safe | mismatch |
| path escape | root containment check | 0 | none | immediately |
| envelope over budget | approximate token check | bounded deterministic extraction shrink | metadata-only/error if still too large | cannot fit budget |
| missing artifact | read failure | 0 by default | safe source regeneration | artifact unavailable |
| extraction loses needed evidence | evaluation/rehydrate demand | <=2 targeted reads/question | explicit larger-budget decision | retry limit |

## Definition of Done
- evidence supports the current problem;
- existing approaches and limitations documented;
- full raw output retained when spill is required;
- model-visible output explicitly bounded;
- artifacts integrity-protected;
- targeted rehydration implemented;
- deterministic tests cover success and failure paths;
- metrics available for before/after comparison;
- production deployment is not labeled Verified until workload evaluation passes.

## Current verification status
**Implemented: YES**

**Measured by deterministic package tests: YES, once `python tests/test_tool_output_guard.py` passes in the target environment.** The GitHub connector used to generate this package writes repository content but does not execute repository Python, so no claim is made that the test suite was executed remotely during generation.

**Verified in a production agent runtime: NO — requires integration and representative evaluation.**