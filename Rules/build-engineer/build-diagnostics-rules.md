# Build Diagnostics Rules

## Purpose
Make build failures diagnosable through precise, actionable, and stable diagnostics.

## Scope
Applies to compiler errors, build-system errors, dependency resolution failures, generator failures, worker failures, and packaging errors.

## MUST
- Build failures MUST report the failing target or action, relevant command context, and the primary error cause when known.
- Diagnostics MUST distinguish user-code failures from toolchain, infrastructure, dependency, and configuration failures where practical.
- Error handling MUST preserve underlying diagnostic information rather than replace it with generic messages.
- Repeated infrastructure failures MUST expose correlation identifiers or equivalent evidence usable for investigation.
- Diagnostic output MUST avoid leaking secrets or sensitive environment values.

## MUST NOT
- MUST NOT swallow failed subprocess exit codes.
- MUST NOT retry deterministic compile failures as though they were transient infrastructure errors.
- MUST NOT require verbose debug mode for basic actionable failure information.

## SHOULD
- Common failure modes SHOULD include remediation hints when the action is unambiguous.
- Logs SHOULD be structured enough for CI systems to index and summarize failure causes.

## Exceptions
Exceptions require documented platform limitations and an alternative evidence path for investigation.

## Verification
Trigger representative compiler, dependency, generator, infrastructure, and packaging failures; inspect exit codes, logs, redaction, and remediation clarity.