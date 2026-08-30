# LangGraph Memory Tenant Boundary Guard

**Category:** Security

## Problem
Agent memory and checkpoint stores are often treated as authorization boundaries, but recent LangGraph advisories show that backend query semantics can violate tenant isolation even when application code appears scoped. Two distinct 2026 failures demonstrate the pattern: namespace prefix matching crossed segment boundaries in Postgres/SQLite, and MongoDB filter construction accepted query operators that could widen reads.

## Evidence
See `evidence/research.md`. This package is grounded in GitHub-reviewed advisories CVE-2026-71433 / GHSA-47pj-3jcm-6whg and CVE-2026-55253 / GHSA-533j-2v4q-mw5h, plus the corresponding LangGraph/LangChain patches and operational guidance.

## Existing approach
Current fixes upgrade affected packages and harden backend-specific query construction. Operational guidance also recommends fixed-length namespace identifiers and input validation.

## Existing limitations
Upgrades fix known vulnerable implementations but do not prove an application's end-to-end tenant isolation. Teams can still introduce unsafe adapter code, pass user-controlled filters, rely on prefix semantics, or deploy a new persistence backend with different query behavior.

## Proposed improvement
Add a backend-independent tenant-boundary gate that:

1. inventories persistence calls and trust boundaries;
2. rejects user-controlled query operators and ambiguous namespace matching;
3. runs adversarial cross-tenant read tests against every configured backend;
4. verifies exact tenant identity at the application layer after retrieval;
5. blocks release if any cross-tenant object is observable.

## Architecture
```text
README.md
evidence/research.md
skills/tenant-boundary-audit.md
rules/memory-isolation-rules.md
subagents/security-investigator.md
subagents/verification-agent.md
workflows/audit-harden-verify.md
hooks/predeploy-tenant-boundary-check.md
scripts/tenant_boundary_check.py
tests/test_tenant_boundary_check.py
```

## Installation
Python 3.10+ is sufficient for the deterministic checker and tests. Integrate the policy layer with the application's actual persistence adapter in CI.

## Configuration
The checker accepts JSON/JSONL records representing attempted and returned memory objects. Required fields are `request_tenant` and `object_tenant`; optional fields include `filter`, `namespace`, `operation`, and `source`.

## Usage
```bash
python scripts/tenant_boundary_check.py testdata.jsonl --json-out tenant-report.json
python -m unittest tests/test_tenant_boundary_check.py
```

## Workflow
Follow `workflows/audit-harden-verify.md`: **Observe → inventory trust boundaries → reproduce baseline → form hypothesis → harden → rerun adversarial corpus → independent verification**.

## Metrics
- cross-tenant objects returned: target 0
- unsafe operator-bearing filters accepted: target 0
- namespace ambiguity cases passing isolation tests: target 0
- covered persistence backends: target 100% of production backends
- tenant-boundary regression suite pass rate: target 100%

## Verification
**Implemented:** policy checks and adapter defenses exist.  
**Measured:** adversarial tenant-isolation corpus executed against each backend.  
**Verified:** an independent verifier confirms zero unauthorized objects and correct package versions/configuration.

## Safety
Do not weaken authorization to preserve compatibility or performance. A memory item retrieved from storage MUST be re-authorized against the current principal before use. Dangerous production mutations require explicit human approval; this package only performs read-oriented checks by default.

## Failure handling
Detect violations through deterministic test output and logs. Retry environmental failures at most twice. Authorization failures are not retried as success candidates; stop, preserve evidence, restore the last known-good configuration, and escalate.

## Definition of Done
Evidence is documented; vulnerable versions and code paths are inventoried; all production backends are tested; operator/namespace cases are covered; no cross-tenant object is returned; tests pass; risks are recorded; independent verification is complete; no blocking issue remains.

## Customization
Extend the JSON adapter for application-specific tenant fields or namespace shapes, but preserve the invariant that authorization is evaluated on canonical tenant identity rather than query-string or prefix coincidence.
