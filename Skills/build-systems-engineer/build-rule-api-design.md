# Build Rule API Design

## Purpose
Design reusable build rules/macros/plugins that encode policy without hiding dependencies or making builds impossible to reason about.

## When to use
Use when many targets repeat configuration, when introducing repository-wide build abstractions, or when reviewing custom build extensions.

## Inputs
Repeated target patterns, build-system extension APIs, platform/toolchain constraints, existing rules, consumer needs, and migration requirements.

## Context to inspect
Inspect native rule capabilities, duplicated configuration, target ownership, dependency propagation, configuration transitions, generated outputs, and debugging ergonomics.

## Core knowledge
Good build abstractions expose meaningful domain concepts while keeping inputs, outputs, dependencies, and platform constraints visible. Macros reduce repetition but can conceal graph structure; custom rules carry long-term compatibility and maintenance cost.

## Procedure
1. Collect concrete repeated use cases before abstracting.
2. Prefer native build-system primitives when they express the requirement clearly.
3. Define the smallest stable public rule interface.
4. Make dependencies, toolchains, outputs, and platform constraints explicit.
5. Separate policy defaults from caller-controlled behavior.
6. Validate configuration propagation and transitive semantics.
7. Produce actionable errors for invalid combinations.
8. Test rule analysis plus representative execution behavior.
9. Document examples, non-goals, compatibility, and migration path.
10. Version/deprecate rule APIs deliberately when consumers exist at scale.

## Decision points
Use macros for simple composition with transparent expansion; use custom rules/plugins when new action semantics or providers/artifact relationships are required. Avoid abstraction when only one unstable use case exists.

## Common failure patterns
God-rules with dozens of flags, hidden dependencies, implicit global state, wrappers around every native primitive, breaking defaults, and abstractions that prevent debugging generated commands.

## Verification
Create representative positive and negative targets; inspect resulting graph/actions; run clean/incremental builds; verify invalid usage fails clearly; test compatibility for existing consumers.

## Expected output
A focused rule API with explicit semantics, tests, documentation, and lifecycle policy.

## Stop conditions
Stop when consumer requirements conflict fundamentally, the build system cannot model required semantics safely, or changing a widely used rule contract requires governance approval.