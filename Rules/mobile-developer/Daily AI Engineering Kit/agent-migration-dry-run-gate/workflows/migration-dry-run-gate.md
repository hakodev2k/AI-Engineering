# Workflow: Migration Dry-Run Gate

```text
Trigger
  ↓
Repository + migration discovery
  ↓
Static migration risk analysis
  ↓
Migration plan
  ↓
Approval gate (when required)
  ↓
Non-production dry run
  ↓
Application/data verification
  ↓
Independent verification
  ↓
Ready for human-controlled production execution
```

## Trigger
A proposed change contains database migration files, schema-changing SQL, data backfill SQL, or ORM-generated migration operations.

## Entry conditions
- Repository is accessible.
- Migration files can be identified.
- Database engine is known or discoverable.
- Automated execution target is explicitly non-production.

## Inputs
Migration files/diff, repository context, database engine/version, deployment order, relevant schema/data metadata.

## Context
Read only the affected migration code, mappings/models, dependent application paths, nearby tests, and deployment configuration. Expand context when evidence shows additional dependencies.

## Stage 1 — Discover
**Owner:** Migration Planner  
**Tools:** repository search/read, Git diff  
**Artifacts:** affected migration list and dependent components  
**Checkpoint:** every proposed persistent-state change is identified.

## Stage 2 — Analyze
**Owner:** Migration Planner  
**Tools:** `python scripts/analyze-migration.py ...`  
**Artifacts:** JSON analyzer report  
**Checkpoint:** risky/destructive/approval-required operations are classified.

## Stage 3 — Plan
**Owner:** Migration Planner  
**Tools:** `templates/migration-plan.yaml`, `skills/plan-migration.md`  
**Artifacts:** populated migration plan  
**Checkpoint:** prechecks, dry-run command, rollback/roll-forward, verification, risk, and approvals are explicit.

## Stage 4 — Approval gate
If the plan includes production execution, destructive SQL, schema changes, irreversible migration, production configuration, security weakening, or another approval-required action, stop until explicit human approval exists. Approval never authorizes automated destructive production execution; it authorizes only the next explicitly stated action.

## Stage 5 — Dry run
**Owner:** operator/implementation agent  
**Tools:** project-native migration command against a disposable or non-production database  
**Artifacts:** command, target identity, stdout/stderr, exit code  
**Checkpoint:** command succeeded and target was verified as non-production.

## Stage 6 — Verify
**Owner:** Migration Verifier  
**Tools:** `skills/verify-migration.md`, build/test tools, read-only database checks  
**Artifacts:** verification record  
**Checkpoint:** schema, data invariants, application tests, recovery, and diff checks pass.

## Retry rules
- Transient tool/environment failures: maximum 2 retries.
- Build/test/SQL/constraint/data-integrity failures: do not blindly retry; return to Plan or implementation with preserved evidence.
- Permission failures: no retry with broader permissions; stop and escalate.
- Unknown target identity: stop immediately.

## Failure paths
- Static analyzer finds blocked operation → status `blocked`; human redesign/approval required.
- Required approval missing → status `needs-approval`.
- Dry run fails → preserve logs and return to planning/implementation.
- Verification fails → status `blocked`; production readiness is not granted.

## Definition of Done
- Reviewed migration files are exactly identified.
- Static risk report exists.
- Migration plan is complete and valid.
- Required approvals are recorded.
- Dry run completed on a verified non-production target.
- Build/tests and migration-specific checks pass.
- Recovery strategy remains executable.
- Independent verification returns `verified`.
- Unresolved non-blocking risks are documented.
