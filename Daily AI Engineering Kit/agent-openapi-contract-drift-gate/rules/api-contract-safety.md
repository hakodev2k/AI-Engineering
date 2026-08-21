# API Contract Safety Rules

## MUST
- Identify one authoritative baseline OpenAPI document and one candidate document before comparison.
- Preserve existing public paths, operations, required response fields, schema types, accepted enum values, successful status semantics, and authentication requirements unless a breaking change is explicitly approved.
- Record every detected breaking change with location, evidence, client impact, and verification status.
- Run `scripts/openapi_drift.py` and `scripts/validate_report.py` before claiming verification.
- Treat generated client failures and contract-test failures as blocking evidence until resolved or explicitly approved.
- Stop before production deployment or any breaking public API contract change and request explicit human approval.

## MUST NOT
- Infer compatibility only from successful server build or unit tests.
- Remove fields from a successful response merely because current server code no longer uses them.
- Add a required request property to an existing public operation without approval.
- Narrow an enum, change a field type, move a parameter, or strengthen authentication silently.
- Edit production configuration, deploy, rotate secrets, or rewrite Git history as part of this workflow.
- Mark a breaking change non-breaking solely to make CI pass.

## SHOULD
- Prefer additive changes: optional request fields, new response fields, new operations, and expanded enums where clients tolerate them.
- Use representative generated clients or consumer contract tests when available.
- Keep baseline specs versioned in Git or retrievable from a trusted release artifact.
- Document intentionally accepted breaking changes with migration guidance and a deprecation/removal timeline.
