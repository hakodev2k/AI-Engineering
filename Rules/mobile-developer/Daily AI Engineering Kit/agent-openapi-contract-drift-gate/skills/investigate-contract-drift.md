# Skill: Investigate OpenAPI Contract Drift

## Purpose
Find evidence-based differences between a released API contract and a candidate contract, then determine whether each difference is compatible, risky, or breaking.

## When to use
Use before merging API changes, generating clients, upgrading API versions, investigating consumer breakage, or releasing a service whose OpenAPI document changed.

## Inputs
- Baseline OpenAPI JSON path.
- Candidate OpenAPI JSON path.
- `config/contract-policy.json`.
- Relevant implementation, tests, generated clients, release notes, and consumer evidence.

## Preconditions
Both specifications must be valid JSON OpenAPI documents. The baseline must represent a known released/accepted contract.

## Allowed tools
Repository search/read, build/test commands, local scripts, read-only API documentation access, generated-client compilation.

## Constraints
Do not modify the baseline to hide drift. Do not perform production writes or breaking contract changes without explicit approval.

## Process
1. Confirm baseline provenance and candidate generation source.
2. Locate changed operations, DTOs, response codes, parameters, auth declarations, enums, and required fields.
3. Run `python scripts/openapi_drift.py <baseline> <candidate> --policy config/contract-policy.json --output openapi-drift-report.json`.
4. For each finding, trace corresponding server code and nearby tests.
5. Separate fact from hypothesis. A script finding is evidence of spec drift; runtime impact is a hypothesis until validated.
6. Check existing client generators or consumer tests when present.
7. Prefer the smallest compatibility-preserving fix.
8. Re-generate the candidate spec after changes.
9. Re-run drift detection and report validation.
10. Inspect Git diff for unrelated contract changes.
11. Stop if a breaking change remains without approval.

## Expected output
A valid drift report plus implementation/test evidence and explicit unresolved risks.

## Verification
`validate_report.py` passes; no unapproved breaking findings remain; relevant tests/client builds pass.

## Failure handling
Transient tool failure: retry at most twice while preserving logs. Validation/build failure: do not retry unchanged inputs; collect evidence and fix or escalate. Permission failure: stop.

## Stop conditions
Missing trustworthy baseline, invalid specs, unapproved breaking drift, or repeated tool failure after two retries.
