# Skill: Discover Environment Contract

## Purpose

Build evidence for the repository's actual environment-variable surface before changing configuration.

## When to use

Use on first adoption, configuration incidents, repository onboarding, or before modifying configuration-heavy features.

## Inputs

Repository source, startup code, deployment/CI manifests, sample env files, and target environments.

## Process

1. Inspect repository structure and locate configuration entry points.
2. Search for environment-variable reads in application code and scripts.
3. Inspect nearby typed configuration models, defaults, and startup validation.
4. Inspect CI, container, orchestration, and deployment manifests for injected variables.
5. Compare discovered names with existing sample env files.
6. For each variable, record evidence for whether it is required, secret, constrained, or environment-specific.
7. Separate confirmed facts from hypotheses about unused/legacy variables.
8. Add contract entries only when evidence is sufficient.
9. Run deterministic validation against representative sample environments.
10. Report unresolved names and evidence gaps instead of guessing.

## Expected output

A proposed contract diff with variable name, evidence location, required environments, secret classification, allowed values/patterns, and unresolved questions.

## Verification

Every contract entry must map to repository/deployment evidence or an explicit product/operations requirement.

## Failure handling

If configuration is generated dynamically or injected externally and cannot be enumerated, document the boundary and keep unknown values blocked unless an explicit reviewed exception is required.

## Stop conditions

Stop before changing production configuration, secrets, deployment, or infrastructure without human approval.