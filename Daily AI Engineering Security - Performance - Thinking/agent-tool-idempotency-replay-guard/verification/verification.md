# Verification Report

## Scope
This report separates package implementation from measurements that require integration into a real agent/provider stack.

## Implemented
- Evidence-backed problem statement and current-solution analysis.
- Tool-effect classification policy.
- Stable operation-key construction with tenant/business scope.
- SQLite reference reservation ledger with atomic ownership, completed-result reuse, and `unknown` state.
- Explicit prevention of blind replay from `unknown`.
- Registry validation.
- Replay-log duplicate analyzer.
- Contract tests for key stability, tenant separation, completed reuse, unknown-state blocking, concurrent reservation, and write identity requirements.
- Bounded retry/reconciliation policy and lifecycle hooks.

## Static verification
The package structure and cross-file references should be checked against the GitHub tree after all files are saved. Required executable files contain complete Python implementations rather than pseudocode.

## Contract verification targets
Run:
```bash
python tests/test_idempotency_guard.py
```
Expected assertions:
1. canonical JSON ordering does not alter operation key;
2. tenant boundary changes operation key;
3. a completed operation returns its stored result to later attempts;
4. an `unknown` outcome blocks a fresh owner from executing blindly;
5. concurrent contenders produce exactly one reservation owner;
6. write tools without business identity fail validation.

## Runtime verification required after integration
These claims must not be marked Verified until run against the target system:
- zero duplicate provider effects during checkpoint replay;
- zero duplicate effects after worker crash around provider dispatch;
- zero duplicate effects during parent/subagent retry;
- provider-native idempotency propagation works as documented;
- reconciliation distinguishes success/no-effect/unknown correctly;
- guard p95 latency is within the service SLO;
- no legitimate business operation is falsely suppressed.

## Required fault-injection matrix
| Scenario | Expected |
|---|---|
| sequential duplicate after completion | one provider call, second returns saved result |
| 20 concurrent identical writes | one provider execution |
| response lost after successful provider write | ledger becomes unknown; reconciliation confirms success; no repeat |
| failure proven before dispatch | bounded retry under same key allowed |
| stale lease + provider success | mark complete without re-execution |
| stale lease + provider confirms absence | lease takeover/retry under same key |
| stale lease + provider unknowable | stop automatic execution |
| same request in two tenants | independent keys |
| different business scope, same args | independent operations |

## Metrics for Measured status
Capture before/after:
- logical operations;
- provider executions;
- duplicate provider executions;
- provider calls avoided;
- estimated avoided cost/time;
- guard p50/p95 latency;
- in-progress contention wait;
- unknown outcome rate;
- reconciliation outcomes;
- false suppression/collision incidents.

## Verification decision states
- **Implemented:** code/config/docs exist.
- **Measured:** target integration emitted comparable metrics/test results.
- **Verified:** required fault tests pass, no duplicate effects observed, false suppression is zero in fixtures, and service overhead is accepted.

## Current package status
Implemented and structurally testable. Production performance/correctness improvements remain unverified until the target agent runtime, durable store, and actual side-effect providers are integrated and fault-tested.
