# Workflow: Architecture Drift Gate

## Entry condition

Start when a task may add or change module dependencies, move responsibilities, expose new public contracts, refactor boundaries, or modify architecture-sensitive code.

## Required inputs

- task/PR description and acceptance criteria;
- repository root;
- changed files or expected change surface;
- architecture policy if available;
- ADRs/architecture evidence;
- normal build/test commands.

## Stages

### 0. Intake

**Owner:** Primary agent

Capture task scope, expected affected modules, and whether the task intentionally proposes an architecture change.

**Artifact:** task scope note.

### 1. Baseline extraction

**Owner:** Architecture Mapper

Run `skills/architecture-baseline-extraction.md`.

**Artifact:** architecture baseline with evidence and unknowns.

**Checkpoint:** if a boundary required for the task is unknown or contradictory, do one targeted discovery pass. If still unresolved, stop `blocked`.

### 2. Policy validation

**Owner:** Deterministic script

```bash
python scripts/validate-architecture-policy.py --policy .architecture-policy.json
```

**Artifact:** validation result.

**Failure:** fix configuration once. A second invalid result stops the workflow.

### 3. Pre-change boundary scan

**Owner:** Deterministic script + primary agent

Run the checker on current/affected files to establish known existing violations.

**Artifact:** baseline violation set.

Existing violations are not automatically approved; they are recorded so the task is not blamed for unrelated legacy drift.

### 4. Proposed-change drift analysis

**Owner:** Primary agent using `skills/drift-analysis.md`

Map expected new dependency edges and responsibility moves before editing when practical.

**Artifact:** initial drift report.

**Checkpoint:** if `architecture-change-required`, request explicit human approval/ADR path before implementing that architecture change.

### 5. Implementation

**Owner:** Primary implementation agent

Implement the smallest change that satisfies requirements within approved architecture.

**Artifact:** code/config/test changes.

Dangerous operations remain outside this workflow and require human approval: schema changes, production config/deployments, secrets/security controls, destructive file removal, force push, and large dependency upgrades.

### 6. Post-edit deterministic scan

**Owner:** Hook/script

Run the boundary checker on changed files, then repository-wide when feasible.

**Artifact:** final deterministic violation report.

If a new violation appears, return to Stage 4/5. Maximum automatic fix loop: two rounds.

### 7. Functional verification

**Owner:** Primary/test agent

Run relevant build, unit, integration, regression, static-analysis, and acceptance checks.

**Artifact:** test/build evidence.

Functional success does not close architecture findings.

### 8. Independent drift review

**Owner:** Drift Reviewer

Review final diff, baseline, deterministic results, ADRs, exceptions, and drift report.

**Artifact:** reviewer status `pass | revise | blocked`.

- `pass` -> Stage 9.
- `revise` -> Stage 5; at most two semantic review rounds total.
- `blocked` -> human architecture/module owner.

### 9. Pre-complete gate

**Owner:** Deterministic scripts + Drift Reviewer/primary agent

Re-run policy validation and boundary scan against the final state. Confirm no file changes occurred after the reviewed state without re-review.

**Artifact:** final gate evidence.

### 10. Complete

The primary agent may report:

- `task completed` when implementation exists;
- `task technically verified` when normal technical checks pass;
- `architecture verified` only when Stage 8 returns `pass` and Stage 9 passes.

## Retry rules

- Policy validation failure: one repair attempt; second failure stops.
- Unknown architecture boundary: one targeted discovery expansion; then stop `blocked`.
- New deterministic violation after edit: at most two fix/rescan rounds.
- Drift Reviewer `revise`: at most two semantic revision rounds.
- Transient build/test infrastructure failure: retry at most twice if clearly transient; persistent failures stop with evidence.
- Expired/invalid exception: no automatic retry; stop until human review or code fix.

## Human approval points

Explicit approval is required for:

- new dependency direction between architectural modules;
- breaking module/public contract changes;
- superseding or weakening an ADR/policy boundary;
- permanent/long-lived exception;
- database schema modification;
- production deployment/configuration;
- infrastructure or security-control changes;
- secrets modification;
- destructive file deletion or Git history rewrite;
- large dependency upgrades.

## Stop conditions

Stop when any of the following occurs:

- architecture and technical verification both pass;
- the maximum retry/revision budget is exhausted;
- architecture evidence remains contradictory or insufficient;
- required human approval is not available;
- technical verification cannot complete reliably.

## Definition of Done

- task acceptance criteria are satisfied;
- build/tests applicable to the change pass;
- architecture policy is structurally valid;
- final deterministic boundary scan has no unapproved violations;
- all semantic drift findings are resolved;
- exceptions are explicit, owned, scoped, and unexpired;
- Drift Reviewer returns `pass`;
- final checked state matches the actual final diff;
- completion status clearly distinguishes implementation success from architecture verification.
