# API Contract Safety Rules

## MUST

- Capture or locate an explicit baseline contract before evaluating a candidate contract.
- Record every detected breaking change with a machine-readable finding, affected path, and evidence.
- Treat removed endpoints, removed HTTP methods, newly required inputs, removed responses, incompatible type changes, required-property additions, and enum narrowing as breaking by default.
- Preserve the baseline and candidate artifacts used for the decision.
- Run deterministic comparison before allowing an AI agent to conclude that an API change is backward compatible.
- Require explicit human approval before proceeding with a confirmed breaking public API contract change.
- Keep generated reports under the configured output path and include verification status.
- Stop if either contract cannot be parsed reliably.

## MUST NOT

- Do not infer backward compatibility from tests alone when a contract artifact is available.
- Do not silently rewrite or replace a baseline contract to make a candidate pass.
- Do not ignore a breaking change because the implementation appears intentional.
- Do not publish, deploy, merge, or tag a breaking API change without the required approval.
- Do not expose authentication headers, API keys, bearer tokens, cookies, or secrets in saved contract artifacts or reports.
- Do not widen tool permissions to retrieve protected API definitions without explicit authorization.
- Do not treat a tool failure or missing contract as a successful comparison.

## SHOULD

- Prefer a generated OpenAPI document from the same build artifact that will be deployed.
- Compare against the last released or otherwise accepted baseline rather than an arbitrary local snapshot.
- Review semantic intent after deterministic checks to identify behavior changes that OpenAPI cannot express.
- Keep contract changes small and separately reviewable when possible.
- Add explicit tests for any approved breaking change and document migration guidance for consumers.
