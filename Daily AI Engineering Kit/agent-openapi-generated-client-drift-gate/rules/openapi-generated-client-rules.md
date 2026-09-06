# OpenAPI Generated Client Drift Rules

## MUST
- Identify the authoritative OpenAPI specification before changing generated client code.
- Record the generator command, generator version, source revision, spec fingerprint, and generated-output roots used for verification.
- Treat generated code as a derivative artifact unless the repository explicitly documents it as hand-maintained.
- Regenerate from a clean worktree for final verification.
- Run the repository's relevant build/tests after regeneration.
- Preserve evidence showing whether regeneration changes tracked generated files.
- Require explicit approval before changing a public API contract, generator major version, or generated-client compatibility policy.
- Stop when the generator requires unavailable credentials or privileged infrastructure.

## MUST NOT
- Manually patch generated files when `allow_manual_edits` is false.
- Change the OpenAPI spec solely to make generated output match existing checked-in code without product/API evidence.
- Silently upgrade the generator, SDK runtime, HTTP stack, serializer, or dependency set while fixing drift.
- Delete generated files merely to make the diff empty.
- Ignore a generation failure and report the repository as synchronized.
- Expose tokens, API keys, private registry credentials, or secrets in logs/evidence.
- Push, release, deploy, force-push, or rewrite history as part of this gate.

## SHOULD
- Pin the generator version in repository tooling.
- Keep generator configuration and templates versioned with the repository.
- Prefer deterministic generation options and stable ordering.
- Separate spec changes from generator-version changes where practical.
- Add CI execution of the deterministic regeneration check once the repository command is stable.
