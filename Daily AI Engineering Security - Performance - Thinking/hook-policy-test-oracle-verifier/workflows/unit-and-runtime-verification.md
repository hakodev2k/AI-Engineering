# Workflow: Unit and Runtime Verification

## Trigger
A security hook/rule change, agent/IDE/runtime upgrade, or enforcement incident.

## Goal
Prove that declared policy decisions survive from hook logic to effective runtime authorization.

## Inputs
Case matrix, trusted hook executable, host adapter capable of recording effective decisions, runtime version/mode/surface.

## Baseline
Preserve the last verified case matrix and results. New verification MUST use the current runtime and current hook/config hashes.

## Stages
1. **Observe** — collect the policy requirements and current runtime contract.
2. **Measure baseline** — record prior false-allow/missing-observation rate if available.
3. **Diagnose** — identify high-risk capabilities and known surface/mode differences.
4. **Form hypothesis** — state which layer is expected to enforce each case.
5. **Unit verify** — run `verify_hook_policy.py --hook ...` against all cases.
6. **Runtime verify** — run harmless host canaries and save `id`/`actual` observations.
7. **Compare** — run verifier in observation mode; any mismatch is blocking.
8. **Independent review** — Security Verifier checks denominator, hashes, results, and risks.

## Responsible agent
Implementer owns stages 1-7; Security Verifier owns final review.

## Tools
Verifier script, test runner, vendor docs, sandboxed runtime, read-only logs.

## Outputs
Unit result set, runtime result set, false-allow/missing list, effective decision matrix, verification status.

## Checkpoints
Case denominator approved before testing; trusted hook path confirmed before execution; destructive actions replaced by harmless canaries; runtime version/mode recorded.

## Metrics
False allows, decision mismatch rate, required-case coverage, mode/surface coverage, verification latency.

## Retry policy
One retry is allowed for a runtime scenario only after collecting diagnostic evidence and changing a relevant condition. Never loop retries.

## Stop conditions
All required cases verified; any false allow; missing required observation; timeout/parser failure; unsafe canary; one failed diagnostic retry.

## Failure path
Preserve evidence, block deployment/completion for affected capability, revert the change if appropriate, and escalate to the platform/security owner.

## Verification
A unit pass is Implemented/Measured evidence only. Verified requires effective runtime observations for all required high-risk cases.

## Definition of Done
Case matrix complete, tests pass, false-allow count is zero, no required runtime observation is missing, risks documented, and independent verification complete.
