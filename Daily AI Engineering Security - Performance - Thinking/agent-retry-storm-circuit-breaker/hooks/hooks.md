# Hooks

## Pre-task Retry Ownership Validation
**Trigger:** Before starting a tool-capable workflow.  
**Action:** Load retry policy; enumerate SDK/orchestrator/workflow retry layers; reject ambiguous multiple owners for the same logical operation family.  
**Command/script:** Host config check plus `python scripts/retry_guard.py fingerprint --operation <fixture.json>` for deterministic fingerprint readiness.  
**Expected result:** One retry owner and valid policy.  
**Failure behavior:** Block unattended retry execution until ownership is resolved.

## Pre-retry Decision Hook
**Trigger:** Any tool/API/subagent failure before another physical attempt.  
**Action:** Persist current state and invoke deterministic decision gate.  
**Command/script:** `python scripts/retry_guard.py decide --operation operation.json --state retry-state.json --policy config/retry-policy.json`.  
**Expected result:** retry/fail-fast/open-circuit/human-approval decision with reason code.  
**Failure behavior:** Missing/corrupt state fails closed for automatic retry.

## Side-effect Replay Hook
**Trigger:** Retry candidate has operation type `write`, `delete`, `payment`, `send`, `deploy`, or `publish`.  
**Action:** Verify stable idempotency key and known retry ownership.  
**Expected result:** Safe replay boundary exists.  
**Failure behavior:** Require human approval; never auto-replay ambiguous side effect.

## Progress Watchdog Hook
**Trigger:** Long-running child approaches watchdog threshold.  
**Action:** Inspect last host-visible material progress and checkpoint age. Continue only if progress is fresh and total budget remains; otherwise checkpoint then stop/restart within budget.  
**Expected result:** Active work is not killed merely for elapsed time, while stagnant work remains bounded.  
**Failure behavior:** Missing telemetry uses conservative bounded stop, not unlimited extension.

## Post-run Trace Analysis Hook
**Trigger:** Workflow completes, fails, or circuit opens.  
**Action:** Export JSONL retry events and calculate amplification.  
**Command/script:** `python scripts/analyze_retry_trace.py retry-trace.jsonl --output retry-report.json`.  
**Expected result:** Physical/logical attempts, amplification factor, duplicate counts, token estimate, layer counts, hotspots.  
**Failure behavior:** Mark performance verification incomplete if metrics cannot be produced.

## Final Verification Hook
**Trigger:** Before claiming retry optimization successful.  
**Action:** Run contract tests and compare guarded run against baseline.  
**Command/script:** `python -m unittest tests/test_retry_guard.py`.  
**Expected result:** Tests pass and measured metrics meet rollout thresholds.  
**Failure behavior:** Do not claim improvement; allow at most two targeted remediation cycles.