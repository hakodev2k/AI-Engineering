# Hook: Post Change
Trigger: after MCP contract-affecting edits.
Action: capture candidate, run `scripts/mcp_schema_gate.py`, run host build/tests, run `python scripts/verify_package.py`, preserve evidence, hand to verifier.
Expected: deterministic compatibility status plus host validation.
Failure: unapproved breaking drift or any gate/test/config error blocks completion.
Blocking: yes.
