# Workflow: OpenAPI Contract Drift Gate

## Trigger
Any change that can alter a public API contract, generated OpenAPI document, API version, DTO, endpoint, auth requirement, or generated client.

## Entry conditions
A trustworthy released baseline and locally generated candidate are available.

## Inputs
Baseline spec, candidate spec, `config/contract-policy.json`, repository, tests, and optional client project.

## Stages
1. **Context — Contract Investigator**: establish provenance, inspect changed endpoints/DTOs/tests, run initial drift scan.
2. **Plan — Compatibility Planner**: classify findings and define minimal compatible remediation.
3. **Execute — Implementation Agent**: edit only approved scope, regenerate candidate, run relevant tests.
4. **Verify — Verification Agent**: independently rerun scan, validate report, build/tests/client checks, inspect diff.
5. **Complete** only when status is verified and no blocking finding remains.

## Produced artifacts
`openapi-drift-report.json`, implementation/test evidence, final verification status.

## Checkpoints
- Baseline provenance confirmed before analysis.
- Initial drift report before edits.
- Candidate regenerated after edits.
- Independent verification after implementation.

## Retry rules
Maximum two retries only for transient tool/process failures. Preserve command, stderr/stdout, inputs, and report from each failed attempt. Do not retry unchanged validation/build failures; diagnose instead. After two transient failures, stop and escalate.

## Approval points
Stop for any intentional breaking API contract, production deployment, secret/config change, infrastructure change, or irreversible migration. Human approval must identify the specific change; blanket assumed approval is invalid.

## Failure paths
Invalid baseline/candidate: blocked. Missing baseline provenance: blocked. Breaking drift without approval: needs-approval. Build/client/test failure: blocked. Permission failure: blocked without privilege escalation.

## Definition of Done
Baseline and candidate identified; deterministic report generated and validated; relevant tests/builds pass; contract-impact diff reviewed; no unapproved breaking drift; remaining risks documented; verifier returns `verified`.
