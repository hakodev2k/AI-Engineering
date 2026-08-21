# Workflow: Tool Contract Verification

## Entry condition
A new or changed structured agent tool needs verification before broader agent use.

## Required inputs
Tool contract, policy, fixture definitions, safe runtime adapter or normalized result file, tool version/source.

## Stages
1. **Contract capture — Workflow owner**
   - Create/update contract and fixtures.
   - Artifact: contract JSON.
2. **Preflight validation — Deterministic script**
   - Run `validate-contract.py`.
   - Checkpoint: exit 0 required.
3. **Safe execution — Host adapter**
   - Prefer mock/sandbox.
   - Live destructive execution requires explicit human approval.
   - Artifact: normalized results JSON.
4. **Deterministic evaluation — Script**
   - Run `evaluate-fixtures.py`.
   - Artifact: evaluation report.
5. **Analysis — Contract Analyst**
   - Classify every mismatch and coverage gap.
6. **Revision loop — Workflow owner**
   - Revise contract/adapter/fixture only for evidence-backed defects.
   - Maximum 2 loops.
7. **Independent review — Safety Reviewer**
   - Validate side effects, permissions, approvals and release readiness.
8. **Verification gate**
   - `pass` => verified for declared autonomy level.
   - `revise` => loop if retry budget remains.
   - `blocked` => stop with evidence.

## Retry rules
- Environmental/sandbox transient failure: retry at most twice.
- Contract/semantic mismatch: do not blind-retry; revise based on evidence.
- Same mismatch after two revisions: stop and escalate.

## Stop conditions
Stop for undeclared destructive behavior, secret leakage, unresolved approval boundary, unavailable safe execution path, malformed contract after two revisions, or inability to distinguish success/error reliably.

## Human approval points
Required before live production mutation, secrets changes, infrastructure changes, database schema operations, file deletion, force push, permission/security-control changes, breaking public contracts, or equivalent privileged behavior.

## Definition of Done
### Task completed
Contract, fixtures, execution evidence and review artifacts exist.

### Task verified
- Contract validator passes.
- Required fixture classes are present.
- Deterministic evaluation passes.
- Observed side effects match declaration.
- Required approvals are present.
- Safety Reviewer returns `pass`.
- No unresolved high-risk mismatch remains.