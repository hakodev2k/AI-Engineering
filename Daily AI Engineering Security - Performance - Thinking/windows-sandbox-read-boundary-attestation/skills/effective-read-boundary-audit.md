# Skill: Effective Read-Boundary Audit

## Purpose
Prove that the active Windows sandbox enforces the declared filesystem read boundary using runtime evidence rather than configuration intent.

## Trigger
Run after agent/sandbox upgrades, permission-profile changes, sandbox state regeneration, crashes/reboots, or before a task that depends on isolating sensitive local files.

## Inputs
- Declared permission profile or normalized `config/policy.example.json` equivalent.
- At least one known-readable sentinel inside the allowed root.
- At least one non-sensitive sentinel located outside the allowed root that must be unreadable.
- Probe observations produced by the sandbox harness.

## Preconditions
Sentinels MUST contain synthetic data only. The audit MUST NOT attempt to read real credentials or production secrets. The sandbox being tested MUST be the same backend/configuration used by the target agent task.

## Required context
Sandbox version, Windows version, active permission profile, selected sandbox backend, observation timestamp, and any recent crash/recovery event.

## Allowed tools
Read-only configuration inspection, sandbox diagnostic commands, synthetic sentinel creation by a human/operator outside the agent boundary, and `scripts/attest_read_boundary.py`.

## Constraints
- MUST NOT weaken ACLs to make a probe pass.
- MUST NOT use actual secrets as forbidden probes.
- MUST distinguish explicit access denial from a generic sandbox initialization error.
- MUST stop if effective sandbox identity/backend cannot be established.

## Procedure
1. Normalize the intended read roots and list explicit allowed and forbidden synthetic sentinel paths.
2. Confirm canonical absolute paths and avoid aliases, junction ambiguity, or relative paths.
3. From inside the production-equivalent sandbox, probe the readable sentinel and record `allowed`, `denied`, or `error` without including file contents.
4. Probe each forbidden sentinel and record only the result plus canonical path.
5. Record whether ordinary sandbox execution is healthy.
6. Run `python scripts/attest_read_boundary.py --policy <policy.json> --observations <observations.json> --output <attestation.json>`.
7. If exit code is 0, hand the attestation to the independent verifier. Exit code 2 is a confidentiality boundary violation. Exit code 3 is insufficient evidence or an availability failure.

## Decision points
- Forbidden probe succeeds: block sensitive work immediately.
- Forbidden probe returns generic setup error: treat as incomplete, not as proof of denial.
- Allowed probe fails: treat sandbox as unhealthy; diagnose before continuing.
- Canonical path differs from requested path: stop and resolve path semantics.

## Expected output
A machine-readable attestation plus a concise evidence record containing policy version, sandbox version, probes, result classification, and timestamp.

## Metrics
Forbidden-probe escape count, allowed-probe success ratio, incomplete-attestation count, regression count per upgrade, and time-to-detect boundary drift.

## Verification
A verifier other than the implementing/operator agent must inspect the attestation and confirm that all required probes were present and no forbidden read succeeded.

## Failure handling
Preserve diagnostic evidence, quarantine the sandbox from secret-bearing work, and escalate. Recovery may regenerate sandbox state only through documented/operator-approved procedures; rerun the full audit afterward.

## Stop conditions
Stop after one complete successful attestation, after any forbidden read succeeds, or after two failed attempts caused by ambiguous initialization errors. Do not retry indefinitely.
