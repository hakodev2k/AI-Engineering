# Workflow: Rollback Readiness Gate

## Trigger

Run before a risky implementation is finalized, before deployment/release approval, or whenever a change may require reversal under failure.

## Entry conditions

- Base/head refs or a concrete diff are available.
- Acceptance criteria are known.
- Repository and relevant deployment/migration context are readable.

## Inputs

- Base ref and head ref.
- Acceptance criteria.
- Deployment target/environment.
- Build/test commands.
- Existing rollback/runbook information.

## Context

Gather repository structure, changed files, affected modules/tests, API contracts, migrations/data transformations, deployment/configuration, infrastructure, and security context only as required by evidence.

## Flow

```text
Trigger
  ↓
Deterministic change scan
  ↓
Change Risk Assessor
  ↓
Rollback plan + baseline evidence
  ↓
Safe validation
  ↓
Independent Verification Agent (medium/high)
  ↓
Approval gate if required
  ↓
Verified / Blocked / Needs approval
```

## Stages

### 1. Deterministic scan

Responsible: workflow coordinator.

Command:

```bash
python scripts/assess-changes.py --base "$BASE_REF" --head "$HEAD_REF" --config config/rollback-readiness.json --output .ai/rollback-assessment.json
```

Artifacts: `.ai/rollback-assessment.json`.

Checkpoint: command exit code 0 means no deterministic approval category was detected; exit code 2 means an approval category exists; exit code 3 means assessment failed.

### 2. Risk analysis

Responsible: Change Risk Assessor.

Actions: confirm classifications, trace blast radius, identify rollback mechanism by layer, identify irreversible behavior, and collect baseline evidence.

Artifact: enriched assessment plus rollback procedure.

Checkpoint: each material changed area is classified or explicitly unknown.

### 3. Rollback plan

Responsible: workflow coordinator with domain owner input.

Required fields:

- rollback command or procedure;
- rollback owner;
- verification command;
- known data-loss risk;
- expected restored state;
- forward-fix fallback when rollback is unsafe.

Checkpoint: missing required evidence blocks readiness.

### 4. Safe validation

Responsible: implementation/test owner.

Run relevant build, unit/integration/E2E tests, migration dry-run, configuration validation, or non-production rollback exercise. Never use production mutation merely to prove rollback.

Artifacts: command outputs and observed results.

### 5. Independent verification

Responsible: Verification Agent for medium/high risk; optional for low risk.

Actions: rerun deterministic scan, inspect evidence, reproduce safe checks, challenge unsupported assumptions.

Checkpoint: result is `verified`, `blocked`, or `needs-approval`.

### 6. Approval boundary

Responsible: human approver.

Required before production deployment, destructive SQL, schema/data mutation, infrastructure changes, secret changes, production configuration changes, breaking API contracts, security weakening, irreversible migrations, force push/history rewrite, or any configured approval category.

The agent must stop before execution. Approval is evidence, not an inference.

## Retry rules

Maximum retries: 2 for the same transient tool or reproducible verification failure.

Retryable: transient process/tool failure, flaky external non-production check with evidence, temporary file lock.

Not retryable without new evidence: permission denial, irreversible migration, failed business rule, security-policy violation, missing production-equivalent context.

Preserve stdout/stderr, command, refs, and prior assessment before retrying. After the second failed attempt, mark `blocked` and escalate.

## Failure paths

- Script/config/schema failure → `blocked`; fix package/config issue before reassessment.
- Build/test failure → `blocked`; preserve logs and do not claim readiness.
- Permission failure → `blocked`; never broaden permissions automatically.
- Missing rollback mechanism → `blocked` or forward-fix-only decision requiring human approval.
- Approval-required category → `needs-approval`; stop before dangerous action.
- Environment mismatch → `blocked` unless risk can be verified through an equivalent safe signal.

## Stop conditions

Stop when verified, blocked, or waiting for explicit approval. Never loop indefinitely.

## Definition of Done

- Deterministic assessment exists.
- Changed areas and risks are classified with evidence.
- Required rollback evidence is complete.
- Build/tests/relevant safety checks passed.
- Independent verification completed for medium/high risk.
- Required human approval exists before dangerous action.
- Unresolved risks are documented.
- No blocking failure remains.
