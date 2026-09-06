# Release Configuration Management

## Purpose
Treat prompts, sampling parameters, routing rules, safety settings, tool schemas, retrieval configuration, and feature flags as versioned release artifacts rather than invisible operational state.

## When to use
Use whenever behavior can change without changing model weights.

## Inputs
Configuration sources, environment overrides, secrets references, candidate model, baseline configuration, and deployment manifests.

## Preconditions
Configuration can be exported or versioned without exposing secrets.

## Context to inspect
Inspect precedence rules, environment variables, prompt stores, feature flags, gateway policies, provider defaults, tool schemas, and runtime overrides.

## Core knowledge
AI behavior is a function of model plus configuration. Untracked configuration drift makes evaluation evidence invalid and incidents difficult to reproduce.

## Procedure
1. Inventory all behavior-affecting configuration.
2. Separate secret values from versioned configuration references.
3. Define canonical defaults and environment-specific overrides.
4. Pin provider/model parameters that otherwise inherit mutable defaults.
5. Version prompts, tool schemas, safety policies, and routing rules.
6. Produce an effective-configuration snapshot for each release.
7. Diff candidate against production and classify behavioral impact.
8. Test configuration loading and precedence.
9. Attach the effective configuration identity to telemetry and provenance.

## Decision points
Use centralized configuration when coordinated changes and auditability matter; keep service-local configuration when ownership and deployment coupling are stronger. Avoid runtime mutability for high-risk controls unless audited.

## Common failure patterns
Hidden console changes, unpinned provider defaults, secrets committed with config, stale feature flags, prompt changes outside release review, and environment precedence surprises.

## Verification
Reconstruct effective production configuration from versioned sources and compare it with runtime-reported values and release evidence.

## Expected output
A reproducible, secret-safe configuration snapshot and change record.

## Stop conditions
Stop when effective configuration cannot be determined, critical settings are mutable without audit, or secrets would need to be exposed to establish reproducibility.
