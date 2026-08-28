# CI Build Integration Rules

## Purpose
Keep continuous integration builds faithful to supported developer and release workflows while providing deterministic feedback.

## Scope
Applies to CI build stages, worker images, matrix execution, affected-target selection, artifact handoff, and failure reporting.

## MUST
- CI build commands MUST use supported repository build entry points rather than private CI-only shortcuts unless explicitly justified.
- CI workers MUST use declared toolchains and controlled environment configuration.
- Build failures MUST preserve actionable diagnostics and failing command context.
- Required build validations MUST fail closed when their result cannot be established.
- CI configuration changes affecting build coverage MUST be reviewed for skipped targets and platform gaps.

## MUST NOT
- MUST NOT hide build failures behind unconditional success handling.
- MUST NOT make release-critical validation optional because of intermittent infrastructure problems without an approved contingency.
- MUST NOT allow local and CI build semantics to drift silently.

## SHOULD
- CI SHOULD reuse the same build abstractions developers use locally.
- Expensive matrices SHOULD use evidence-based affected-target reduction where correctness is preserved.

## Exceptions
Exceptions require documented operational constraints, risk, compensating validation, and a remediation owner.

## Verification
Compare local and CI commands, inspect worker toolchains, review required checks, simulate failure paths, and audit skipped-target logic.