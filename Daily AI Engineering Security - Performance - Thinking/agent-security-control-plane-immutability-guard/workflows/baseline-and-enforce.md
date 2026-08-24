# Workflow: Baseline and Enforce

## Trigger
New agent environment, policy change, runtime upgrade, or privileged/unattended workflow enablement.

## Goal
Ensure security-sensitive actions execute only under a reviewed control-plane revision.

## Inputs
Workspace, policy inventory, trusted baseline location.

## Baseline
Count protected files, record hashes, note storage ownership/permissions, and run a known permitted action plus a known denied action under existing controls.

## Context
Policy integrity supplements vendor sandbox/permission enforcement; it does not replace it.

## Stages
1. **Observe** — identify actual policy/config files and runtime surfaces.
2. **Measure baseline** — record hashes from a trusted shell.
3. **Diagnose** — identify any policy files writable by the governed agent and any declared/effective mismatch.
4. **Hypothesis** — action-time hashing will detect unauthorized local control-plane mutation before privileged dispatch.
5. **Implement** — attach the pre-tool hook contract.
6. **Measure again** — mutate a test policy file and confirm blocking exit 2; restore and confirm exit 0.
7. **Verify** — independent Security Verifier checks results and baseline authority.

## Responsible agent
Implementation owner for integration; `subagents/security-verifier.md` for independent verification.

## Tools
`python scripts/policy_attest.py`, filesystem access controls, host pre-tool hook mechanism.

## Outputs
Baseline state, JSON verification reports, test evidence.

## Checkpoints
After inventory; after baseline; after hook attachment; after negative test; before production enablement.

## Metrics
Coverage >= 95% of privileged dispatch paths; 100% of unauthorized test mutations blocked; zero baseline rewrites by governed agent.

## Retry policy
At most one filesystem refresh/recheck for suspected race. Policy drift itself is never auto-retried into success.

## Stop conditions
Stop and escalate if baseline cannot be protected, policy inventory is uncertain, or drift remains after one recheck.

## Failure path
Keep privileged action blocked; preserve JSON evidence; require human review.

## Verification
Pass unit tests plus one host-level mutation test.

## Definition of Done
Implemented, measured, and independently verified with no blocking control-plane drift.