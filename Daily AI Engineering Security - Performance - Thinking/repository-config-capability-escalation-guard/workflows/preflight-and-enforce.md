# Workflow: Preflight and Enforce

## Trigger
Agent opens/resumes a repository or project config changes.

## Goal
Prevent lower-trust project configuration from increasing effective capability without explicit, digest-bound approval.

## Inputs
Trusted baseline JSON, project policy JSON, repository identity, optional approval artifact.

## Baseline
Capture current trusted policy before reading project overrides. Record capability set, approval mode, sandbox scope, network scope and registered executable integrations.

## Stages
1. **Observe** — identify all project config files without executing repository code.
2. **Measure baseline** — serialize the trusted effective policy.
3. **Diagnose** — run `../scripts/policy_delta_guard.py` and inspect blocked deltas.
4. **Form hypothesis** — classify each delta as expected tightening, accidental escalation or malicious escalation.
5. **Implement improvement** — change host merge logic/schema; never edit hostile project config merely to silence the check.
6. **Measure again** — rerun the exact baseline/candidate pair.
7. **Verify** — Security Reviewer runs independent regression tests.

## Responsible agent
Implementation agent owns stages 1-6. `../subagents/security-reviewer.md` owns final verification.

## Tools
Read-only Git metadata, hashing, Python 3, test runner, static analysis.

## Outputs
Policy decision JSON, config digest, test evidence and reviewer decision.

## Checkpoints
Before tool registration; after any policy merge; before honoring a new approval artifact.

## Metrics
Unapproved escalation count must be zero in accepted sessions. Negative test block rate must be 100% for defined security-sensitive fields.

## Retry policy
Maximum 2 implementation/retest cycles. A failed security test requires root-cause reassessment before retry.

## Stop conditions
Stop immediately on unapproved escalation, invalid approval binding, unknown executable field, or inability to establish trusted baseline.

## Failure path
Preserve evidence, keep privileged tools disabled, fall back to trusted baseline, escalate to a human security owner if the repository genuinely requires more authority.

## Verification
Independent reviewer confirms blocked attack path, unchanged trusted permissions and passing tests.

## Definition of Done
Implemented: monotonic merge/check is integrated. Measured: baseline and candidate delta evidence exists. Verified: independent negative tests block escalation and no secrets or privileged tools are exposed.
