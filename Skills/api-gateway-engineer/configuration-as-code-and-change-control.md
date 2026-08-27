# Configuration as Code and Change Control

## Purpose
Make gateway policy reproducible, reviewable, testable, and recoverable through version-controlled configuration.

## When to use
Use when managing routes, plugins, certificates, policies, or environment promotion.

## Inputs
Current gateway config, environment model, CI/CD controls, secrets mechanism, ownership rules.

## Context to inspect
Manual changes, drift, config generation, validation tools, branch protections, deployment history, rollback method.

## Core knowledge
Gateway configuration is production code. It needs schema validation, deterministic rendering, environment separation, secret references, review, promotion, and rollback.

## Procedure
1. Establish one authoritative source of configuration.
2. Separate reusable policy from environment-specific values.
3. Keep secrets outside plain-text configuration.
4. Validate syntax, references, and route conflicts in CI.
5. Run policy and contract tests before deployment.
6. Produce a reviewable diff of effective configuration.
7. Promote immutable revisions through environments.
8. Record deployed revision and support one-command rollback.
9. Detect and reconcile out-of-band drift.

## Decision points
Prefer declarative configuration where supported. Generate config only when generation is deterministic and output is reviewable.

## Common failure patterns
Console-only changes, copied environment files, secrets in Git, unvalidated templates, mutable release artifacts, rollback requiring manual reconstruction.

## Verification
Rebuild config from source, compare effective state, execute CI tests, deploy to non-production, and prove rollback.

## Expected output
A deterministic gateway configuration delivery process with traceable revisions.

## Stop conditions
Escalate if production state cannot be reconstructed from controlled sources.