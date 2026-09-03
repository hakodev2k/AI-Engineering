# Hook: Pre-completion Lifecycle Check

## Trigger
Before claiming an MCP lifecycle/performance change complete.

## Preconditions
A normalized verification snapshot and `config/policy.json` exist.

## Action
Run:

```bash
python scripts/mcp_process_audit.py --snapshot <verification-snapshot.json> --policy config/policy.json --output <audit-report.json>
python -m unittest tests/test_mcp_process_audit.py
```

## Expected result
Both commands exit 0. Audit reports zero policy violations and measured process counts return to the documented steady state.

## Failure behavior
Block completion. Preserve the report and return to diagnosis. Do not kill uncertain processes or loosen policy automatically.

## Blocking
Yes.
