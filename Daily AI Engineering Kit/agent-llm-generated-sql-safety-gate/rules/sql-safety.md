# SQL Safety Rules

## MUST
- Identify the target environment before gating or execution.
- Gate every agent-generated SQL artifact before it reaches a DB execution tool.
- Use read-only credentials for investigations.
- Preserve the exact gated SQL artifact when requesting approval.
- Treat exit code `0` as pass, `2` as blocked, `4` as approval required, and other non-zero codes as gate/tool failure.
- Require explicit human approval for INSERT, UPDATE, DELETE, MERGE, CREATE, schema changes, or other configured write operations.
- Re-run the gate after every material SQL edit.
- Verify mutations using separate read-only postcondition queries.

## MUST NOT
- Execute SQL when the gate reports `blocked` or fails to run.
- Interpret `approval_required` as permission to execute.
- Modify policy, environment labels, SQL comments, or formatting to evade a finding.
- Automatically broaden DB roles, schemas, credentials, network access, or tool permissions.
- Execute production writes when `block_production_writes` is enabled.
- Run DROP, TRUNCATE, ALTER, GRANT, REVOKE, or other configured blocked operations through this workflow.
- Put credentials, tokens, connection strings, or customer data in package artifacts or agent messages.
- Claim a change succeeded from generated SQL or gate output alone.

## SHOULD
- Parameterize runtime values rather than interpolate them.
- Prefer explicit column lists, tenant predicates, bounded result sets, and transactions where appropriate.
- Review triggers, constraints, cascading behavior, and lock scope before approved writes.
- Use a separate verifier from the author for high-risk changes.
- Preserve row counts, timings, plans, and verification evidence without unnecessary sensitive rows.
