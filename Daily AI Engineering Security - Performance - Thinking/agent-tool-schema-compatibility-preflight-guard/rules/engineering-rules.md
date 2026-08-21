# Engineering Rules

## MUST
1. MUST preflight every enabled tool schema against the active provider profile before provider submission.
2. MUST bind every verdict to a canonical schema fingerprint and profile version.
3. MUST revalidate when provider/model/profile/schema/transformation changes.
4. MUST preserve the original schema for comparison and audit.
5. MUST fail closed when the provider profile is unknown or preflight cannot run.
6. MUST report incompatible constructs with tool name, rule code, and JSON path.
7. MUST prevent unchanged incompatible manifests from being retried against the provider.
8. MUST quarantine an incompatible tool rather than poisoning unrelated tools when host semantics safely permit partial manifests.
9. MUST runtime-validate required arguments before dispatch when provider-native validation is bypassed by a generic/deferred tool bridge.
10. MUST bound correction/reload retries to one attempt per distinct validation failure unless a human/operator supplies new evidence.
11. MUST record whether a schema was Implemented, Measured, and Verified separately.
12. MUST add a regression fixture for every newly observed provider schema rejection that passed local validation.

## MUST NOT
1. MUST NOT remove required fields merely to satisfy a provider.
2. MUST NOT widen enums, accepted types, or `additionalProperties` semantics merely to make validation pass.
3. MUST NOT drop identity, permission, approval, destination, or authorization-relevant parameters during normalization.
4. MUST NOT silently convert a schema when semantic equivalence cannot be proven.
5. MUST NOT retry deterministic 400/invalid-schema failures with an unchanged schema fingerprint.
6. MUST NOT treat a generic JSON Schema validator as proof of provider compatibility.
7. MUST NOT log secret argument values in compatibility or runtime-validation reports.
8. MUST NOT let the implementation agent be the sole verifier for a new normalization rule.

## SHOULD
1. SHOULD validate per tool so one incompatible tool can be isolated.
2. SHOULD cache successful verdicts by `provider-profile-version + schema-fingerprint`.
3. SHOULD keep provider rules configuration-driven and regression-tested.
4. SHOULD expose preflight latency and provider schema rejection metrics.
5. SHOULD prefer no transformation over a risky transformation.
6. SHOULD include the originating MCP server/framework in reports for maintainability.
7. SHOULD compare pre/post transformation schemas and document every changed path.
8. SHOULD test representative nested objects, arrays, enums, aliases, `$ref/$defs`, combinators, and regex patterns.

## Observable acceptance rules
- Preflight coverage must equal 100% for enabled tools before rollout is marked Verified.
- Duplicate invalid-manifest provider attempts must be zero for unchanged fingerprints.
- Every provider-side schema error after rollout must create a sanitized regression case or an explicit unsupported-provider disposition.
- A quarantined tool must be visibly unavailable to planning; the model must not be told it can call a tool that the host has removed.
