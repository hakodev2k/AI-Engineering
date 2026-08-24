# Backward Compatibility Rules
## Purpose
Prevent shared developer tooling from breaking consumers unexpectedly.
## Scope
CLIs, configuration, templates, APIs, plugins, generated output, environment contracts, and automation interfaces.
## MUST
- Public or widely consumed behavior MUST have an explicit compatibility policy.
- Breaking changes MUST identify affected consumers, migration path, rollout sequence, and rollback strategy.
- Deprecations MUST be observable and provide sufficient migration time proportional to impact.
- Compatibility claims MUST be validated against representative consumers.
## MUST NOT
- MUST NOT silently reinterpret existing configuration with materially different behavior.
- MUST NOT remove supported interfaces without the defined deprecation process except for urgent security reasons with approval.
- MUST NOT assume repository compilation proves ecosystem compatibility.
## SHOULD
- Additive evolution SHOULD be preferred when it preserves clarity and safety.
- Automated contract tests SHOULD cover stable interfaces.
## Exceptions
Urgent breaks require documented risk, authorized approval, communication, mitigation, and rollback where feasible.
## Verification
Run contract/consumer tests, inspect migration guides and deprecation telemetry, review diffs, and validate rollback or coexistence plans.