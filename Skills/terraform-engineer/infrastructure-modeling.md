# Infrastructure Modeling

## Purpose
Model cloud and platform infrastructure as maintainable Terraform with explicit ownership, boundaries, dependencies, and lifecycle behavior.

## When to use
Use for new infrastructure, decomposition of monolithic configurations, or architecture review. Do not use Terraform as a substitute for application configuration that belongs in deployment/runtime systems.

## Inputs
Requirements, target providers, environments, repository, state layout, security and availability constraints.

## Context to inspect
Existing modules, provider versions, naming/tagging standards, state backends, dependency graph, import history, and CI policy.

## Core knowledge
Prefer declarative desired state, stable resource identity, small cohesive modules, explicit interfaces, and minimal cross-stack coupling. Resource addresses and state are compatibility surfaces. Understand provider behavior, eventual consistency, replacement semantics, and blast radius.

## Procedure
1. Translate requirements into resources and invariants.
2. Identify ownership and lifecycle boundaries.
3. Inspect existing conventions before introducing abstractions.
4. Group resources that change and are owned together.
5. Define typed inputs, validated constraints, and deliberate outputs.
6. Keep provider configuration at composition roots unless aliasing requires otherwise.
7. Model dependencies through references rather than manual ordering.
8. Review replacement and deletion behavior for every critical resource.
9. Generate and inspect a plan.
10. Add policy, tests, documentation, and operational notes.

## Decision points
Split stacks when teams, credentials, cadence, blast radius, or lifecycle differ. Prefer direct resources until repetition is stable enough to justify a module.

## Common failure patterns
God modules, hidden provider assumptions, circular dependencies, excessive remote-state coupling, unstable for_each keys, and accidental replacements.

## Verification
Run format/validate, static checks, policy checks, and a reviewed plan in a representative environment. Verification requires confirming intended graph and lifecycle, not merely successful syntax.

## Expected output
A reviewable Terraform design with clear boundaries and predictable change behavior.

## Stop conditions
Escalate when ownership is unclear, destructive replacement is unexplained, credentials are unavailable, or requirements conflict with platform/security policy.