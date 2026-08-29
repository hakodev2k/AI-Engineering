# Hook: Preflight MCP Policy

## Trigger
Before enabling MCP in a deployment, after any MCP policy/configuration change, and before final security verification.

## Preconditions
A JSON policy matching `config/policy.example.json` semantics exists and contains no secrets.

## Action
Run deterministic policy validation and unit tests.

## Script/command
```bash
python scripts/validate_mcp_policy.py config/policy.example.json
python -m unittest tests/test_validate_mcp_policy.py
```

## Expected result
Both commands exit `0`; validator prints `PASS` and no violations.

## Failure behavior
Non-zero exit blocks deployment/completion. Do not bypass by deleting auth requirements, broadening grants, or disabling failing tests. Correct policy/implementation and rerun.

## Blocking
Yes.
