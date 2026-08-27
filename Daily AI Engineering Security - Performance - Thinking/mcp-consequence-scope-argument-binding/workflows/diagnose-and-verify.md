# Workflow: Diagnose and Verify Consequence Scope

## Trigger
A new/changed MCP tool can read, write, connect, deploy, delete, or otherwise act on model-selected resources.

## Goal
Prove the tool cannot act outside the task-approved resource scope.

## Inputs
Tool schema, credentials/resource inventory, current policy, representative benign and adversarial calls.

## Baseline
Record current allowed tool set, credential breadth, target arguments, approval behavior, and whether out-of-scope calls are currently blocked.

## Stages
1. **Observe:** enumerate target-bearing arguments and current authorization points.
2. **Measure baseline:** execute safe dry-run fixtures and record escape-block rate and approval coverage.
3. **Diagnose:** identify where normalized target scope is lost or never checked.
4. **Hypothesis:** state one observable hypothesis, e.g. “binding normalized repository+branch before tool invocation blocks injected cross-repo writes.”
5. **Implement:** integrate `scripts/target_scope_guard.py` at the pre-tool-call boundary.
6. **Measure again:** rerun the same fixtures.
7. **Verify:** independent Security Verifier reviews policy, outputs, and tests.

## Responsible agent
Implementation owner for stages 1–6; `subagents/security-verifier.md` for stage 7.

## Tools
Read-only schema inspection, guard script, unit tests, dry-run tool harness.

## Outputs
Baseline evidence, guard decision logs, before/after escape-block metrics, independent verification status.

## Checkpoints
After baseline, before any high-consequence test, after policy change, before completion.

## Metrics
Out-of-scope attack fixtures blocked; benign in-scope fixtures allowed; approval coverage; false positives; secret exposure count.

## Retry policy
Maximum 2 implementation revisions. Each retry must state new evidence and a changed hypothesis or implementation.

## Stop conditions
Stop immediately on secret exposure, irreversible action risk, ambiguous canonical target, or exhausted retries.

## Failure path
Disable the affected high-consequence tool or reduce credentials to the verified scope; escalate for explicit human authorization.

## Verification
Verifier must be separate from the implementer and reproduce the tests.

## Definition of Done
Implemented guard, measured before/after behavior, tests pass, no out-of-scope attack fixture succeeds, approval boundaries preserved, no secrets exposed.
