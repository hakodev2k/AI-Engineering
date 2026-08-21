# Core Skills

## Skill 1 — Provider Schema Compatibility Preflight

### Purpose
Prevent deterministic provider/tool-schema failures before an agent sends a model request or dispatches a tool.

### Trigger
Run whenever tools are discovered, transformed, enabled/disabled, provider/model changes, or a tool schema fingerprint changes.

### Inputs
- discovered tool names and input schemas;
- selected provider profile;
- optional transformation metadata;
- previous validation cache keyed by schema fingerprint + profile version.

### Preconditions
- tool discovery completed successfully;
- provider profile is explicit;
- original schema is preserved for audit/comparison.

### Required context
Provider/model identifier, profile version, tool origin, tool schema, and whether host semantics allow per-tool quarantine.

### Tools
`scripts/schema_preflight.py`, `config/provider-profiles.json`, host logs/metrics.

### Procedure
1. Capture the original tool schema without modification.
2. Canonically fingerprint it.
3. Resolve the provider compatibility profile.
4. If an identical fingerprint/profile already passed, reuse the cached verdict.
5. Otherwise recursively lint the schema.
6. Classify every finding by JSON path and rule code.
7. If incompatible, quarantine that tool when the host can safely expose the remaining manifest; otherwise block the request.
8. Do not retry an unchanged incompatible fingerprint against the provider.
9. Record metrics without recording secret-bearing argument values.
10. Revalidate after any transformation, SDK upgrade, MCP reconnect, or provider switch.

### Decisions
- **Pass:** schema is compatible with all enforced rules.
- **Quarantine:** one tool fails and host can safely continue without it.
- **Block:** incompatible tool is required, manifest is atomic, or profile cannot be resolved.
- **Escalate:** provider rejects a schema that passed the current profile; capture sanitized failing path/error and update profile/tests before retrying.

### Constraints
- Never weaken requiredness or widen allowed values to make a schema pass.
- Never silently drop authorization/security-relevant properties.
- No unbounded retry.
- A transformation must be semantics-preserving and auditable.

### Expected output
A per-tool compatibility report containing fingerprint, profile, pass/fail, findings, and disposition.

### Metrics
Preflight coverage, local rejection count, quarantined tools, validation latency, provider schema error rate, repeated-invalid-manifest attempts.

### Verification
Known-invalid regression fixtures must fail locally. Known-compatible fixtures must pass. Production provider invalid-schema errors should fall after rollout.

### Failure handling
If profile/config cannot be loaded, fail closed and do not submit unvalidated tools.

### Stop conditions
Stop when all enabled tools have a current compatible verdict or are explicitly quarantined/blocked with evidence.

---

## Skill 2 — Runtime Tool Argument Contract Check

### Purpose
Catch missing required arguments, unknown fields, simple type mismatches, and enum violations before MCP/tool dispatch when provider-native validation is absent or bypassed.

### Trigger
Immediately before dispatch for generic/deferred tool bridges or any path that does not guarantee provider-native argument validation.

### Inputs
Validated input schema and candidate argument object.

### Preconditions
Schema fingerprint must match the one validated during preflight.

### Required context
Tool name, schema fingerprint, argument keys, retry state, and whether the tool has side effects.

### Procedure
1. Verify schema fingerprint has not changed.
2. Check required keys.
3. Reject unknown keys when `additionalProperties=false`.
4. Check simple JSON types and enums deterministically.
5. On failure, return structured validation evidence to orchestration instead of dispatching.
6. Permit at most one model correction attempt for argument-only errors.
7. Re-run validation on corrected arguments.
8. Stop and escalate after the bounded retry if still invalid.

### Decisions
- Dispatch only after deterministic checks pass.
- Never reinterpret invalid arguments for a side-effecting tool without explicit host logic.

### Constraints
This lightweight runtime check is not a complete JSON Schema implementation. Delegate complex validation to the runtime/framework when available, but keep the pre-dispatch gate.

### Expected output
Pass/fail with rule code and JSON path; never include secret values in telemetry.

### Metrics
Dispatch rejection rate, correction success rate, avoidable tool-server errors, retry count.

### Verification
Regression tests cover missing required keys, enum mismatch, unknown fields, and type mismatch.

### Failure handling
On validator uncertainty or schema drift, do not dispatch; refresh schema and re-preflight once.

### Stop conditions
Dispatch succeeds once, or bounded correction/reload is exhausted.
