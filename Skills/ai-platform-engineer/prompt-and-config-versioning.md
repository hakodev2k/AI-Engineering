# Prompt and Configuration Versioning

## Purpose
Make prompts, model parameters, tool policies, and AI runtime configuration reproducible, reviewable, and safely deployable.

## When to use
Use when teams change prompts or AI behavior outside normal application releases, need rollback, or cannot reproduce production outputs.

## Inputs
- Prompt templates and system instructions
- Model parameters
- Tool and retrieval configuration
- Environment-specific settings
- Evaluation baselines

## Context to inspect
Inspect where prompts live, how applications resolve them, who can edit them, deployment history, runtime overrides, caches, evaluation links, and incident history.

## Core knowledge
Prompts and AI configuration are production artifacts. Mutable unversioned configuration creates hidden behavior changes. Versions should be immutable, attributable, environment-aware, and linked to evaluation evidence.

## Procedure
1. Inventory behavior-affecting AI configuration.
2. Separate stable identifiers from immutable versions.
3. Store versions in an auditable source or registry.
4. Record model, tool, retrieval, and parameter dependencies.
5. Require review for production changes.
6. Link candidate versions to offline evaluation results.
7. Define environment promotion rules.
8. Support canary release and deterministic rollback.
9. Record resolved version in request telemetry.
10. Prevent silent mutation of released versions.
11. Test fallback when a version cannot be resolved.
12. Define retention and deprecation policy.

## Decision points
Keep configuration with code when releases are tightly coupled; use a registry when independent iteration is valuable. Avoid runtime editing without review for high-risk systems.

## Common failure patterns
Mutable prompts behind stable names, production hot-fixes with no audit trail, inability to map an output to a prompt version, and rollback that changes model but not prompt.

## Verification
Verify immutable resolution, promotion controls, telemetry, rollback, and reproducibility using recorded inputs and version metadata.

## Expected output
A versioned AI configuration workflow supporting review, evaluation linkage, promotion, telemetry, and rollback.

## Stop conditions
Stop when production behavior cannot be tied to an immutable configuration or governance ownership is unclear.