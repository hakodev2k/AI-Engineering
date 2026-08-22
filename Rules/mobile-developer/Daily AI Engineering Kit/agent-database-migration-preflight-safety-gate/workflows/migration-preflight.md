# Migration Preflight Workflow

## Trigger
A migration is created/changed or is proposed for merge/execution.

## Entry conditions
Repository and migration are readable; execution is not part of the requested task.

## Inputs
Migration identifier/range, repository, target environment classification, acceptance criteria.

## Stages
1. **Context — Repository Explorer:** follow `skills/collect-migration-evidence.md`; output evidence bundle and SQL.
2. **Risk — Migration Risk Analyst:** follow `skills/assess-migration-risk.md`; run `scripts/preflight.py`.
3. **Checkpoint:** `block` stops. `approval_required` stops before external execution until a human explicitly approves. `pass` continues.
4. **Verification — Verification Agent:** rerun scan/tests and inspect evidence independently.
5. **Complete:** publish verified result and unresolved risks; do not execute migration.

## Tools
Read/search/Git read operations, safe ORM script generation, Python preflight/tests.

## Artifacts
Generated SQL, `preflight-result.json`, evidence summary, approval record when required, verification status.

## Retry rules
Transient tool/read failures: maximum 2 retries, preserve all previous evidence. Build/test/validation failure: one remediation cycle and one rerun. Permission failure: no retry. A repeated failure stops and escalates with evidence.

## Approval points
Any schema application, destructive/data-changing SQL, irreversible change, production execution/configuration, or other action listed in `rules/migration-safety.md` requires explicit human approval and remains outside this workflow.

## Failure paths
Ambiguous range, inability to generate SQL safely, invalid policy, blocking finding, exhausted retries, or missing approval => stop with status and evidence.

## Definition of Done
Context is traceable; SQL captured; scan completed; findings evidenced; no unresolved block; required approval recorded; tests pass; independent verification completed; no migration executed.
