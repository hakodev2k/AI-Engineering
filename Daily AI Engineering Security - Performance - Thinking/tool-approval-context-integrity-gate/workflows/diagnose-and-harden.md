# Workflow: Diagnose and Harden Approval Integrity

## Trigger
Approval bug report, protocol/serializer change, delegation change, or new high-risk tool.

## Goal
Prove whether approval context survives unchanged from request to execution.

## Inputs
Captured request/execution events, policy, source diff, test fixtures.

## Baseline
Record current envelope completeness, approval UI fields, delegation chain, and execution arguments.

## Context
Observable facts only: serialized messages, UI payloads, runtime tool calls, policy and logs.

## Stages
1. **Observe:** capture one benign and one high-risk approval path.
2. **Measure baseline:** count missing leaf-tool, argument, destination, and consequence fields.
3. **Diagnose:** identify the first layer where context is defaulted, omitted, or substituted.
4. **Form hypothesis:** state one falsifiable boundary failure.
5. **Implement improvement:** bind approval to the canonical fingerprint.
6. **Measure again:** rerun benign, malformed, nested, and drift fixtures.
7. **Improved?** If no, revise the hypothesis; maximum 2 retries.
8. **Verify:** independent Security Reviewer checks the final path.

## Responsible agent
Implementation owner for stages 1–6; Approval Security Reviewer for stage 8.

## Tools
Guard script, unit tests, read-only protocol/runtime traces.

## Outputs
Baseline, root cause, changed controls, before/after test results, reviewer decision.

## Checkpoints
After baseline; before side-effect fixtures; after fingerprint verification.

## Metrics
Approval completeness, mismatch blocks, nested-leaf visibility, test pass rate.

## Retry policy
Maximum 2 implementation/diagnosis revisions.

## Stop conditions
Stop immediately on secret exposure, irreversible execution without exact approval, or exhausted retries.

## Failure path
Disable the affected high-risk tool or require manual out-of-band execution until fixed.

## Verification
Mutation-after-approval and hidden-leaf tests MUST block; benign exact-match test MUST pass.

## Definition of Done
Evidence documented, root cause identified, deterministic gate implemented, tests pass, independent reviewer passes, no blocking issue remains.
