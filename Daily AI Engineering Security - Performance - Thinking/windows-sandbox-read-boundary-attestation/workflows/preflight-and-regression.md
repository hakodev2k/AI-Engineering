# Workflow: Preflight and Regression Verification

## Trigger
Sandbox upgrade, policy edit, Windows reboot/crash recovery, sandbox-state repair, or entry into a task whose confidentiality depends on local read isolation.

## Goal
Demonstrate that intended allowed reads work and forbidden reads are blocked by the effective sandbox boundary.

## Inputs
Policy JSON, sandbox/version metadata, synthetic sentinels, and probe observations.

## Baseline
Record the last known-good attestation if available. A historical pass never substitutes for the current run.

## Context
Use the production-equivalent backend and permission profile. Do not test a weaker or different sandbox instance.

## Stages
1. **Observe** — capture active backend, policy identifier, versions, and recent recovery events.
2. **Measure baseline** — execute one allowed synthetic probe and all required denied synthetic probes; record result classifications only.
3. **Diagnose** — if allowed reads fail, classify as sandbox-health failure; if forbidden reads succeed, classify as boundary violation; if results are generic errors, classify as incomplete.
4. **Form hypothesis** — identify one testable cause such as ACL materialization drift, malformed state, wrong profile, or path canonicalization mismatch.
5. **Implement improvement** — only a human/operator or designated platform owner may repair configuration/state. Never auto-broaden access.
6. **Measure again** — rerun the complete probe set, not only the previously failing probe.
7. **Verify** — run `scripts/attest_read_boundary.py` and `python -m unittest tests/test_attest_read_boundary.py`.
8. **Independent review** — the security verifier confirms evidence and status.

## Responsible agent
Workflow owner coordinates evidence; `subagents/security-verifier.md` independently verifies. Configuration repair is outside the verifier role.

## Tools
Sandbox harness, read-only diagnostics, Python 3, and package scripts/tests.

## Outputs
Probe observations, attestation JSON, test result, status classification, and escalation record when needed.

## Checkpoints
Block before sensitive task execution, after any repair, and before declaring Verified.

## Metrics
Forbidden-read escapes (target 0), required probe coverage (target 100%), allowed-probe success (target 100%), validator pass rate, and regression count.

## Retry policy
Maximum two repair-and-retest cycles for incomplete sandbox-health failures. A forbidden read success gets no autonomous retry; immediately block and escalate.

## Stop conditions
Stop on verified attestation, any confirmed boundary violation, or two incomplete retests.

## Failure path
Preserve non-secret diagnostics, prevent secret-bearing agent work, and escalate. Do not switch to full access as a workaround.

## Verification
Implemented = package installed/configured. Measured = current probe evidence captured. Verified = validator passes, tests pass, and independent verifier accepts the evidence.

## Definition of Done
Current evidence is complete; no forbidden probe succeeded; allowed probes work; tests pass; independent review is complete; no blocking security issue remains.
