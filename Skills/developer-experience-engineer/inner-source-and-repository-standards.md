# Inner Source and Repository Standards

## Purpose
Create repository conventions that make internal software easy to discover, understand, contribute to, and maintain.

## When to use
Use when teams have inconsistent repository structures, contribution friction, duplicated solutions, or unclear ownership.

## Inputs
Repository inventory, contribution history, ownership model, build systems, security requirements, and developer feedback.

## Context to inspect
Inspect README quality, ownership, templates, build entry points, local setup, dependency policy, release conventions, and contribution paths.

## Core knowledge
Standards should reduce cognitive load while preserving necessary team autonomy. A repository should expose purpose, ownership, setup, validation, contribution, and operational expectations quickly.

## Procedure
1. Inventory current patterns and recurring friction.
2. Identify the smallest useful standard.
3. Define required metadata and repository contracts.
4. Provide templates and automation.
5. Establish ownership and contribution rules.
6. Add automated validation where reliable.
7. Pilot with varied repositories.
8. Document exceptions and migration guidance.
9. Measure adoption and support burden.

## Decision points
Enforce mechanically verifiable rules in CI; use guidance for contextual choices. Avoid mandatory structure without demonstrated value.

## Common failure patterns
Large mandatory templates, stale ownership, standards without migration tooling, blocking CI for subjective rules, and central teams becoming bottlenecks.

## Verification
Confirm a new contributor can locate ownership, run the project, validate changes, and submit a contribution using documented paths.

## Expected output
A minimal repository standard, templates, automated checks, exception process, and adoption evidence.

## Stop conditions
Stop when the standard conflicts with regulatory or platform constraints, or when affected teams lack an agreed ownership model.