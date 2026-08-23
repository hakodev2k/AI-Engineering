# Scaffolding and Project Templates

## Purpose
Provide maintained starting points that encode proven defaults without freezing applications into obsolete structures.

## When to use
Use when new services/apps require repetitive setup or teams frequently omit baseline security, observability, testing, or CI configuration.

## Inputs
Reference architectures, platform standards, supported stacks, policy requirements, and common customization needs.

## Context to inspect
Inspect existing projects, template drift, dependencies, generated ownership, upgrade strategy, and customization pressure.

## Core knowledge
Generation solves day-zero consistency; lifecycle tooling solves day-two drift. Keep templates small and separate generated baseline from application-specific decisions.

## Procedure
1. Identify stable common concerns.
2. Exclude speculative abstractions.
3. Define configurable inputs and safe defaults.
4. Generate runnable, testable output.
5. Include security, observability, CI, and ownership basics where relevant.
6. Validate generation from clean state.
7. Define template versioning and upgrade guidance.
8. Track modifications that reveal missing extension points.

## Decision points
Generate code when teams need ownership and flexibility; use shared packages/platform services for behavior requiring centralized upgrades.

## Common failure patterns
Huge templates, copied secrets, stale dependencies, no upgrade path, generated code nobody understands, and forcing identical architecture across unlike workloads.

## Verification
Generate multiple representative projects, build/test them, run security checks, and validate supported customizations.

## Expected output
Versioned templates with documented inputs, verified output, ownership, and upgrade strategy.

## Stop conditions
Stop when required standards are unstable or generated output cannot be supported over its lifecycle.