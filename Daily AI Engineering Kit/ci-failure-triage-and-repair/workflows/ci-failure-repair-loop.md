# Workflow: CI Failure Repair Loop

## Entry condition
A CI job/step has failed and enough identifying information exists to locate the run/log or supplied artifact.

## Required inputs
Failed job/step/command, log/artifacts, revision, recent diff, repository and CI configuration, baseline when available.

## Flow
```text
Trigger
  ↓
Normalize evidence
  ↓
Triage Analyst: classify + hypotheses
  ↓
Validate failure manifest
  ↓
Checkpoint A: evidence sufficient?
  ├─ No → one alternate collection attempt → still no → STOP
  └─ Yes
       ↓
Repair gate
  ├─ dangerous/external/unknown → HUMAN / STOP
  ├─ transient/flaky candidate → controlled rerun (max 2)
  └─ causal code/config issue → minimal repair
       ↓
Targeted verification
       ↓
Verification Reviewer
       ↓
Verified?
  ├─ Yes → PreComplete checks → COMPLETE
  └─ No → repair attempts < 2?
           ├─ Yes → return evidence to triage → new/falsified hypothesis → repair
           └─ No → STOP + escalate
```

## Stages and ownership
1. **Evidence normalization** — deterministic script; artifact: `ci.normalized.log`.
2. **Triage** — Triage Analyst; artifact: `failure-manifest.json`.
3. **Manifest validation** — deterministic script; checkpoint A.
4. **Repair gate** — workflow owner/human when required.
5. **Repair** — implementation owner; artifact: minimal diff.
6. **Targeted verification** — implementation owner executes planned checks; artifact: command results.
7. **Independent review** — Verification Reviewer; artifact: verdict and residual risks.
8. **PreComplete** — deterministic manifest validation plus repository-required tests/build.

## Retry rules
- Evidence collection: at most 2 approaches (primary + one alternate source).
- Identical transient CI rerun: at most 2 attempts.
- Repair loop: at most 2 candidate repair attempts.
- A changed error signature starts a new hypothesis within the same remaining repair budget; it does not reset counters.

## Human approval points
Approval is mandatory before production deployment, infrastructure changes, secrets/permissions changes, DB schema changes, breaking contracts, disabling security/quality controls, force push/history rewrite, destructive operations, or broad dependency upgrades.

## Stop conditions
Insufficient evidence after bounded collection; missing approval; external dependency failure requiring owner action; repair budget exhausted; verification environment unavailable; requested repair requires prohibited behavior.

## Definition of Done
- manifest is valid;
- original failure mechanism is evidenced;
- selected repair is minimal and accounted for;
- targeted and required broader checks pass;
- Verification Reviewer returns `verified`;
- no forbidden gate/test weakening occurred;
- residual risks and approvals are recorded.

Implementation without these checks is `completed`, not `verified`.
