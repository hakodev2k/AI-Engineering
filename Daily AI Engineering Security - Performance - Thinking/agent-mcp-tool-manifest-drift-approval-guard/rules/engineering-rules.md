# Engineering Rules

## MUST
- Every MCP `tools/list` result used by an agent MUST be compared against an approved baseline before changed or newly discovered tools become model-visible or invokable.
- Server identity MUST be part of the approval contract; identity drift MUST be treated as critical by default.
- Tool name, description, input schema, output schema when present, and safety-relevant annotations MUST be canonicalized and compared deterministically.
- A blocked `check` MUST NOT modify the approved baseline.
- Baseline replacement MUST require a separate explicit approval event with an external approval identifier.
- Approval baselines MUST be stored outside the MCP server's write authority.
- High/critical drift MUST quarantine affected tools until approval succeeds.
- Failures to read/parse the trusted baseline MUST fail closed for that server's tool surface.
- Diff reports MUST exclude credentials, authorization headers, cookies, and unrelated tool runtime data.
- New destructive/data-export capabilities MUST receive independent review before approval.
- Drift checks MUST run on reconnect, list-change notification, explicit refresh, and any cache-expiry event that triggers a manifest refetch.
- Verification MUST distinguish `Implemented` (gate wired), `Measured` (metrics captured), and `Verified` (negative/positive tests passed).

## MUST NOT
- MUST NOT treat TLS/OAuth authentication as proof that a changed tool manifest remains approved.
- MUST NOT let an LLM be the sole authority deciding whether a manifest change is safe.
- MUST NOT automatically trust a changed manifest merely because it is cryptographically signed; signatures prove publisher/provenance, not human authorization of new semantics.
- MUST NOT auto-update a baseline after detecting drift.
- MUST NOT ignore description-only changes; descriptions influence model planning and can carry hidden instructions.
- MUST NOT ignore annotation flips such as read-only/destructive hints.
- MUST NOT expose blocked tools to the model with a prompt saying "do not use"; remove/quarantine them at the registry/invocation layer.
- MUST NOT use unlimited retries on manifest fetch or comparison.
- MUST NOT disable the gate to restore availability during an unexplained high/critical drift event.

## SHOULD
- SHOULD preserve prior baselines and drift reports as an append-only audit trail.
- SHOULD pin or verify server package/version provenance where feasible.
- SHOULD sandbox newly changed destructive tools before production approval.
- SHOULD measure guard latency, drift frequency, review time, false-positive rate, and blocked-tool counts.
- SHOULD use stable canonical JSON and sorted tool names to eliminate ordering-only alerts.
- SHOULD classify optional schema additions separately from required/type-widening changes if the host needs finer risk tuning.
- SHOULD integrate approval with existing change-management or code-review identifiers rather than inventing unaudited free-text approval.
- SHOULD alert on repeated drift from the same server, especially when changes occur outside expected release windows.
