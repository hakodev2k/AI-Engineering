# Hook: Predeploy Tenant Boundary Check

## Trigger
Before deploying any release that changes agent persistence, memory APIs, tenant identity, authorization middleware, or relevant dependencies.

## Preconditions
The adversarial JSON/JSONL fixture has been generated from a non-production test environment and covers every production backend.

## Action
Run the deterministic boundary checker and the unit/integration test suite.

## Script / command
```bash
python scripts/tenant_boundary_check.py tenant-boundary-results.jsonl --json-out tenant-boundary-report.json
python -m unittest tests/test_tenant_boundary_check.py
```

## Expected result
Exit code 0, zero cross-tenant objects, zero forbidden query operators, and all tests passing.

## Failure behavior
Block completion and deployment. Preserve the report and test logs. Do not redact the existence of a failure, but do redact memory content and credentials.

## Blocking
Yes. Any authorization-boundary violation blocks release.
