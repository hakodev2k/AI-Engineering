# Third-Party Build Actions and Plugin Review

## Purpose
Evaluate reusable CI actions, plugins, build extensions, and installer scripts before granting them execution inside trusted automation.

## When to use
Use before adopting or upgrading third-party workflow components or when reviewing inherited CI configurations.

## Inputs
Action/plugin source, release history, publisher identity, requested permissions, network behavior, update model, and usage context.

## Context to inspect
Determine execution privilege, secret access, workspace access, network egress, transitive code downloads, pinning method, maintainer history, and compromise blast radius.

## Core knowledge
A CI extension executes with the runner’s authority. Marketplace popularity is not a security boundary. Immutable pinning, minimal permissions, code transparency, controlled updates, and isolation reduce risk.

## Procedure
1. Define what capability is actually required.
2. Prefer platform-native or internally maintained functionality for high-risk operations.
3. Inspect source and release provenance for candidate components.
4. Review maintainer ownership and recent security-relevant changes.
5. Identify runtime downloads and transitive execution.
6. Minimize job permissions and secret availability.
7. Pin to immutable revisions or verified artifacts.
8. Test in an isolated non-production workflow.
9. Establish controlled update monitoring.
10. Record approval rationale and owner.

## Decision points
Forking increases control but creates maintenance liability. Accept third-party components when their value, transparency, maintenance quality, and constrained execution produce acceptable residual risk.

## Common failure patterns
Pinning to mutable tags; granting write tokens by default; trusting publisher badges; ignoring install scripts; automatic major upgrades; no owner for future review.

## Verification
Confirm the executed revision matches the approved revision and test that denied permissions/secrets remain inaccessible.

## Expected output
A documented adoption decision with pinned version, constrained permissions, and update process.

## Stop conditions
Escalate on obfuscated behavior, unexplained ownership changes, unverifiable releases, or a component requiring excessive privilege for its function.