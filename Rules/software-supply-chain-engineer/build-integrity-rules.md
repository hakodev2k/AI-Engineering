# Build Integrity Rules

## Purpose
Ensure released artifacts are produced by controlled, reviewable build processes.

## Scope
Applies to build scripts, runners, toolchains, environment images, generated outputs, and release build stages.

## MUST
- Release builds MUST run from approved source revisions using controlled build definitions.
- Build toolchains and runner images MUST be versioned or immutably identified.
- Privileged build steps MUST be minimized and explicitly reviewed.
- Release outputs MUST be associated with the source revision and build execution that produced them.

## MUST NOT
- MUST NOT produce official releases from ad hoc local builds unless an approved emergency procedure explicitly allows it.
- MUST NOT silently alter generated release artifacts after the trusted build stage.

## SHOULD
- Build environments SHOULD be ephemeral and isolated between workloads.
- Build definitions SHOULD be declarative and reviewable where practical.

## Exceptions
Exceptions MUST document the deviation, evidence, risk, compensating controls, owner, and approval.

## Verification
Inspect build definitions, runner configuration, toolchain versions, artifact metadata, and CI records. Confirm released artifacts trace to an approved source revision and controlled build execution.