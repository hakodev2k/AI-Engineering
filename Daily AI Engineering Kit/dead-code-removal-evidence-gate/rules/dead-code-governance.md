# Dead Code Removal Governance

## MUST
- Treat dead-code status as an evidence claim, not a static-analysis fact.
- Record the candidate repository revision and exact identity before analysis.
- Check static references, dynamic/runtime discovery mechanisms, configuration/registration, tests, public/external contracts, and runtime evidence when policy requires them.
- Preserve unknown evidence channels as `unknown`; unknown never means unused.
- Re-run reference checks after removal.
- Preserve build/test/reference-scan evidence with the final decision.
- Require independent reviewer acceptance before `approved-for-removal`.
- Require explicit human approval before deleting files, public/external contracts, database objects/data, production configuration, infrastructure, security controls, or other irreversible/high-impact assets.
- Stop if the removal scope expands beyond the reviewed candidate and its directly orphaned dependencies.

## MUST NOT
- Delete code solely because IDE/compiler/static analysis marks it unused.
- Assume repository-local references cover reflection, serializers, DI scanning, routes, plugins, jobs, external callers, scripts, templates, or configuration.
- Treat missing tests as evidence of non-use.
- Treat telemetry absence as proof unless the observation window and instrumentation coverage are demonstrably sufficient.
- Remove public APIs, event contracts, routes, config keys, CLI commands, or serialized fields without explicit contract review.
- Weaken or delete tests merely to make a removal pass.
- Combine unrelated refactors with a dead-code removal change.
- Retry deterministic failures until they disappear.
- Allow the evidence-producing agent to be the sole final verifier.

## SHOULD
- Prefer one candidate or tightly coupled candidate set per removal change.
- Use language-aware reference tools in addition to text search when available.
- Keep before/after scans machine-readable.
- Prefer deprecation/observation before deletion for externally visible or runtime-discovered code.
- Restore the removed code when verification exposes unexplained behavior rather than patching around uncertainty.