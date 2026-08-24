# Read-Only Security Invariants

- A read-only MCP deployment MUST enforce restrictions at `tools/call` or the equivalent execution boundary, not only during discovery.
- The backing datastore identity MUST lack write privileges whenever the product supports a truly read-only deployment.
- Policy MUST classify semantic effects, not only command names or first tokens.
- Known write-capable constructs such as DocumentDB `$out`/`$merge` MUST be rejected in read-only mode.
- SQL read-only checks MUST NOT treat `SELECT` as sufficient proof of no side effects.
- Cypher read-only checks MUST treat procedures/functions with unknown or write effects as unsafe unless explicitly proven read-only.
- Unknown syntax, parser failure, or unsupported operation families MUST fail closed for autonomous execution.
- Logs MUST record the rule and normalized operation class, but MUST NOT record credentials or secret-bearing connection strings.
- Security verification SHOULD use disposable fixtures and MUST NOT intentionally mutate production data.
- Changes that expand datastore privileges MUST require explicit human approval.
- The implementation agent MUST NOT be the sole verifier of a high-risk policy change.