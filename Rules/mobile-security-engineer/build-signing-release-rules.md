# Build Signing and Release Rules

## Purpose
Protect release integrity and prevent unauthorized or insecure mobile builds from reaching users.

## Scope
Signing identities, provisioning, build pipelines, release artifacts, store submission, and production configuration.

## MUST
- Protect signing credentials using least privilege and controlled build/release systems.
- Ensure production builds disable development-only diagnostics, test endpoints, and bypasses.
- Make release artifacts traceable to reviewed source, dependencies, configuration, and build provenance.
- Require human approval before production release or signing-policy changes when those actions are high impact.

## MUST NOT
- Commit production signing secrets or private credentials to source control.
- Share unrestricted signing credentials through informal channels.
- Release artifacts produced from unreviewed or unverifiable source/configuration.

## SHOULD
- Use automated, reproducible, isolated builds and hardware-backed or managed signing where available.
- Separate development and production signing authority.

## Exceptions
Emergency release exceptions require bounded scope, accountable approval, preserved evidence, and retrospective review.

## Verification
Inspect pipeline permissions, signing configuration, provenance, production build flags, artifact hashes, approvals, and store submission records.