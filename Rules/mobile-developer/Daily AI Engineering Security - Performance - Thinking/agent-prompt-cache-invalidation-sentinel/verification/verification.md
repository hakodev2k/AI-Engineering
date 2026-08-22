# Verification Contract

## Implemented
The package implements:
- request-level usage normalization without prompt/tool-content ingestion;
- warm-cache baseline recognition;
- warm→collapse detection using absolute and relative rewrite thresholds;
- repeated-collapse incident detection within a bounded request window;
- request-ID deduplication for transcript formats that repeat content blocks;
- machine-readable metrics and incidents;
- observe-only and blocking (`fail_on_incident`) modes;
- healthy/pathological fixtures and unit tests.

## Measured
For a real deployment, measurement is complete only when both baseline and candidate event sets are collected from the same representative workflow. Required metrics:
- cache-read tokens;
- cache-creation/write tokens;
- uncached input tokens;
- cache-read ratio;
- collapse event count;
- estimated rewrite tokens;
- incident count;
- end-to-end latency when available;
- task correctness/eval result.

The included fixtures are regression tests for detector behavior, not evidence of production savings.

## Verified
A mitigation may be marked **Verified** only when:
1. the candidate has no repeated-collapse incident under the approved policy;
2. rewrite volume is lower than baseline or cache behavior returns to the established healthy range;
3. the same correctness/safety tests pass;
4. no required context was silently removed;
5. the verifier is independent of the sole implementation agent for shared/high-impact changes;
6. the before/after reports are retained.

## Failure matrix
| Failure | Detection | Retry | Fallback | Escalation | Stop condition |
|---|---|---|---|---|---|
| malformed usage JSONL | exit 3 | fix data once | preserve raw metadata | integration owner | semantics remain ambiguous |
| invalid policy | exit 3 | fix policy once | observe-only defaults are not silently substituted | package owner | invalid threshold persists |
| repeated cache collapse | incident report | max 2 expensive reproductions | fresh checkpointed session if safe | client/provider owner | usage-limit risk or 2 failed tests |
| candidate worsens cache metrics | before/after comparison | max 1 additional candidate | rollback | engineering owner | second candidate fails |
| candidate degrades correctness | task tests/evals | no threshold weakening | rollback | human reviewer | any safety/correctness regression |
| unknown root cause | evidence gap | metadata-only analysis allowed | observe-only | platform maintainer | no new evidence after bounded tests |

## Definition of Done
- [x] Current public evidence documented with dates and sources.
- [x] Existing approaches and limitations documented.
- [x] Deterministic executable analyzer implemented.
- [x] Policy is explicit and configurable.
- [x] Skills, rules, subagents, workflows, hooks, and integration guide exist.
- [x] Healthy/pathological regression fixtures exist.
- [x] Unit tests cover healthy, pathological, nested usage, deduplication, and invalid policy cases.
- [x] Failure handling has bounded retries and stop conditions.
- [x] No prompt/source/tool content is required by the detector.
- [x] README references only generated package files.

Production optimization itself is not marked Verified until deployment-specific before/after measurements satisfy the contract above.
