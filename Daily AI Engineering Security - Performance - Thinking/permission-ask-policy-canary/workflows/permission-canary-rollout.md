# Workflow — Permission Canary Rollout

## Trigger
Before enabling unattended/auto operation or after a relevant host/config/version/surface change.

## Goal
Demonstrate that runtime permission enforcement matches declared policy without using dangerous probes.

## Inputs
Permission configuration, hook configuration, target surfaces/modes, synthetic canary definitions.

## Baseline
Record current version, surface, mode and the last known-good matrix. No optimization or policy relaxation is allowed before baseline capture.

## Stages
1. **Observe** — inventory permission/hook policy and runtime metadata.
2. **Design probes** — use harmless local commands for expected allow/ask/deny paths.
3. **Execute** — run each probe once in the intended surface/mode and record prompt/execution outcome.
4. **Measure** — validate observations with `scripts/permission_canary.py`.
5. **Diagnose** — Permission Verifier classifies each mismatch.
6. **Contain** — on fail-open, disable affected autonomy or replace critical `ask` boundaries with `deny` until fixed.
7. **Re-test** — one bounded re-test after a real remediation/config/version change.
8. **Verify** — independent reviewer confirms the final matrix.

## Responsible agent
Permission Verifier. Platform owner performs configuration remediation.

## Tools
Target agent host, disposable local workspace, validator script.

## Outputs
Canary report, mismatch list, safe-mode decision, remediation evidence.

## Checkpoints
- probe safety reviewed before execution;
- all required surfaces included;
- no fail-open before autonomy enablement;
- final report stored with version metadata.

## Metrics
Surface coverage, fail-open rate, fail-closed rate, canary age, remediation latency.

## Retry policy
Maximum one re-test after a concrete remediation. Repeated identical execution is not remediation.

## Stop conditions
Immediately stop autonomy rollout on fail-open/unknown. Stop successfully when all in-scope rows pass.

## Failure path
Downgrade to manual confirmation/default mode or deterministic deny boundaries and escalate.

## Verification
A second reviewer compares raw observations with validator output.

## Definition of Done
All required surfaces/modes have fresh PASS results, no dangerous probe was used, evidence is retained, and fallback behavior is documented.