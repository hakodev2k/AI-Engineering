# Change boundaries
## MUST
- Capture base commit SHA and intended paths before editing.
- Run scope guard after edits and preserve its JSON report.
- Obtain explicit human approval for any blocked path or policy expansion.
- Record tests and exact exit codes separately from guard results.
## MUST NOT
- Treat a passing scope guard as proof of functional correctness.
- Modify production settings, secrets, database schema, CI permissions, or Git history without approval.
- Suppress a failure by silently changing policy.
- Commit or push automatically.
## SHOULD
- Prefer small patches and targeted tests.
- Use separate independent reviewer for high-risk changes.
