# Test-Double Boundary Rules

## MUST
- Keep mocks/fakes/stubs/fixtures/test hosts/test-only DI outside deployable runtime paths unless concrete evidence proves production semantics.
- Scan changed deployable files before merge.
- Trace dynamic DI/import/environment/endpoint findings to runtime resolution.
- Keep test-only registrations test-scoped.
- Run relevant build/tests after remediation.
- Require human approval for production credentials/secrets, infrastructure, schema, deployment config, public APIs, external production endpoints, or security controls.
- Require owner review for high-severity exceptions.

## MUST NOT
- Broadly exclude production subtrees to make the gate pass.
- Rename a test double merely to evade detection.
- Copy fixture credentials, loopback mock URLs, or test environment switches into deployable configuration.
- Import test namespaces from production code.
- Treat passing unit tests as proof production wiring is correct.
- Let the implementer be the only verifier for high-risk remediation.
- Increase permissions or contact production systems to prove a scanner finding.

## SHOULD
- Use production/test composition roots with dependency inversion.
- Prefer explicit production endpoints over localhost fallback.
- Keep exceptions path- and rule-specific with rationale.
- Add regression tests for real leakage defects.