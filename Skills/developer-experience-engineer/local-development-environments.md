# Local Development Environments

## Purpose
Design fast, reproducible local environments that minimize setup drift and developer troubleshooting.

## When to use
Use when onboarding requires manual steps, local environments diverge from CI, or dependency setup frequently fails.

## Inputs
Runtime dependencies, services, secrets model, operating systems, container tooling, build commands, and developer constraints.

## Context to inspect
Inspect setup scripts, containers, package managers, environment variables, certificates, data dependencies, and local-to-CI differences.

## Core knowledge
Reproducibility, isolation, fast reset, explicit dependencies, and safe secret handling matter more than mimicking production perfectly.

## Procedure
1. Reproduce setup from a clean machine or environment.
2. Inventory implicit prerequisites.
3. Pin or constrain tool versions.
4. Automate dependency provisioning.
5. Provide safe local configuration and test data.
6. Add health checks and actionable errors.
7. Optimize common edit-build-test loops.
8. Document escape hatches and reset procedures.
9. Validate across supported environments.

## Decision points
Use containers when isolation and dependency reproducibility justify overhead; prefer native tooling when startup speed and platform integration dominate.

## Common failure patterns
Hidden global dependencies, production secrets locally, unpinned versions, slow full-stack startup, and setup scripts that are not idempotent.

## Verification
Bootstrap from clean state, run representative workflows, reset the environment, and compare behavior with CI.

## Expected output
A reproducible setup path with automated provisioning, diagnostics, reset capability, and measured startup/feedback times.

## Stop conditions
Escalate when required licenses, credentials, privileged access, or unsupported host constraints prevent safe automation.