# SQL Gated Execution Workflow

```text
Trigger -> Context -> Draft SQL -> Static Gate
                         | blocked -> preserve evidence -> stop
                         | approval_required -> review -> human approval -> controlled execution -> verify
                         | passed -> read-only execution -> independent verify
```

## Trigger
An AI agent proposes SQL for investigation, remediation, migration support, or data correction.

## Entry conditions
Target environment is named; policy exists; requested outcome is explicit; DB tooling can enforce read-only investigation access.

## Inputs
Task, environment, repository/schema evidence, SQL artifact, `config/policy.yaml`.

## Stages
1. **Context — SQL Investigator:** inspect relevant models/migrations/schema and record facts/hypotheses.
2. **Plan — SQL Investigator:** define affected objects, expected cardinality, read/write intent, verification query.
3. **Draft — SQL Investigator:** create exact SQL artifact without executing it.
4. **Gate — deterministic script:** `python scripts/sql_safety_gate.py --sql-file <file> --policy config/policy.yaml --environment <env> --output gate-result.json`.
5. **Checkpoint:** exit 2 blocks. Exit 4 enters approval path. Exit 0 permits only operations already allowed by surrounding credentials/tools.
6. **Read path:** execute SELECT/read-only query, preserve bounded evidence, then hand to SQL Verifier.
7. **Write path:** run SQL Change Review; collect approval packet. Human approval is mandatory. The package itself never executes writes.
8. **Controlled execution:** an external authorized operator/mechanism executes the exact approved SQL; this is outside agent authority.
9. **Verification — SQL Verifier:** run separately gated read-only postcondition queries and compare expected vs actual.
10. **Complete:** produce status and evidence.

## Produced artifacts
SQL file, `gate-result.json`, investigation/review notes, approval record reference, verification evidence.

## Retry rules
- Static gate/tool transient failure: retry once with unchanged inputs.
- Read-only DB transient failure: retry once.
- Failed hypothesis: revise SQL at most twice; each revision returns to Gate.
- Validation/security/permission failures are not retryable by permission expansion.

## Approval points
All configured writes; production config/security changes; schema changes; destructive operations. Blocked production writes cannot be overridden by agent approval handling—policy must be changed deliberately outside this run by an authorized human.

## Failure paths
Unknown environment -> stop. Gate unavailable -> stop. Blocked SQL -> stop. Missing approval -> stop. SQL changed after approval -> invalidate approval and return to Gate. Verification mismatch -> stop and escalate; do not auto-compensate.

## Definition of Done
Exact SQL was gated; execution authority matched gate status; required approval exists; independent verification completed; evidence is preserved; no blocking finding remains; residual risk is documented.
