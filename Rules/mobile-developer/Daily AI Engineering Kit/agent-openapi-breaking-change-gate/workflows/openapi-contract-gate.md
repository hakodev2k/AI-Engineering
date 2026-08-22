# Workflow: OpenAPI Contract Gate

## Trigger
Any change that may alter a public HTTP API contract, or before release of such an API.

## Entry conditions
Repository is readable; baseline contract is available; candidate contract is available or reproducibly generated.

## Inputs
Baseline spec, candidate spec, `config/policy.yaml`, optional approval record.

## Flow
`Trigger -> Explore -> Validate inputs -> Deterministic diff -> Review -> Approval if required -> Re-run -> Verify -> Complete`

## Stages
1. **Explore** — Contract Explorer locates authoritative artifacts and nearby tests.
2. **Preflight** — run `scripts/openapi_breaking_gate.py` parsing/validation.
3. **Diff** — script emits `gate-result.json` with classified findings.
4. **Review** — Contract Reviewer checks evidence and policy mapping.
5. **Compatibility remediation** — implementation owner chooses the smallest backward-compatible change where possible.
6. **Approval checkpoint** — if a breaking change remains, stop and require a completed `templates/breaking-change-approval.md` from an authorized human.
7. **Re-run** — regenerate candidate and execute the gate again. Maximum one retry after remediation for the same validation cycle.
8. **Final verification** — run package tests and confirm result schema/status.

## Produced artifacts
- Gate result JSON.
- Optional approval record.
- Optional human-readable compatibility report.

## Retry rules
- Transient file read/tool failure: retry once, preserving the first error.
- Parse/config/build failure: no blind retry; fix cause and start a new validation cycle.
- Breaking finding: not retryable without a changed candidate or approval evidence.

## Failure paths
Missing baseline, invalid specs, unsupported structure required for a blocking policy category, or absent approval => `blocked`/`verification-failed`, never pass.

## Approval points
Breaking public contract, production deployment, data/schema migration, security weakening, or destructive action always requires explicit human approval outside this workflow.

## Definition of Done
- Baseline and candidate parsed.
- Deterministic gate completed.
- No unapproved blocking findings remain.
- Reviewer independently verified evidence.
- Package/tool tests pass.
- Remaining risks are recorded.
