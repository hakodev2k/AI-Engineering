# Build Sandboxing

## Purpose
Isolate build actions so undeclared filesystem, process, network, and environment dependencies become visible and controllable.

## When to use
Use for hermeticity, remote execution readiness, supply-chain security, or debugging machine-specific builds.

## Inputs
Action commands, declared inputs/outputs, required system resources, network needs, and platform sandbox capabilities.

## Context to inspect
Inspect filesystem reads/writes, temporary directories, home-directory access, subprocesses, network calls, device access, environment variables, and permissions.

## Core knowledge
Sandboxing is both a correctness diagnostic and security control. It should grant the minimum resources required by an action. A sandbox that mounts the whole host read-write provides little assurance.

## Procedure
1. Inventory current action resource access.
2. Define declared input and writable output roots.
3. Restrict undeclared filesystem reads/writes.
4. Deny network by default for execution actions; explicitly model justified fetch phases.
5. Filter environment variables and credentials.
6. Restrict subprocess/device capabilities where supported.
7. Run representative clean and incremental builds.
8. Treat sandbox violations as missing dependency evidence, not as reasons to broadly disable isolation.
9. Add platform-specific exceptions narrowly and document them.
10. Monitor violations and regression-test critical actions.

## Decision points
Use strict sandboxing in CI/remote execution; developer mode may allow diagnostic relaxation when tooling needs it, but correctness verification should still run strictly.

## Common failure patterns
Whitelisting the home directory, silently permitting network, shared writable temp paths, passing all CI secrets, and disabling sandboxing for flaky actions instead of fixing dependencies.

## Verification
Run with empty caches and restricted network; confirm all outputs are inside declared roots; deliberately access an undeclared path and verify rejection; compare artifacts with unsandboxed builds.

## Expected output
A least-privilege sandbox policy, documented exceptions, and violation diagnostics.

## Stop conditions
Stop if platform sandbox capabilities cannot satisfy mandatory tooling, or required privileged access has not been security-approved.