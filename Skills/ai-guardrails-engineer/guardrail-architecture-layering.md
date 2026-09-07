# Guardrail Architecture Layering

## Purpose
Design defense-in-depth so no probabilistic component is a critical boundary.

## When to use
Use for AI systems with sensitive data, tools, autonomous actions, or untrusted content.

## Inputs
Requirements, threat model, architecture, permissions, flows, latency, constraints.

## Context to inspect
Inspect controls before inference, context, output, tools, resources, and side effects.

## Core knowledge
Combine deterministic validation, authorization, capabilities, semantic classifiers, policy engines, sandboxing, approvals, constraints, and monitoring. Enforce near protected resources.

## Procedure
1. Map outcomes to objectives.
2. Place hard authorization at resource/tool boundaries.
3. Constrain untrusted context.
4. Add semantic controls where needed.
5. Validate typed tool calls.
6. Stage risky actions.
7. Add high-impact approval.
8. Add telemetry/post-action checks.
9. Analyze correlated failures.
10. Test degradation.

## Decision points
Fail closed for critical authorization/irreversible actions; fail open only for accepted low risk.

## Common failure patterns
Prompt-only safety, correlated layers, late authorization, timeout bypass, excessive latency.

## Verification
Fault-inject layers and confirm invariants survive.

## Expected output
Layered architecture with enforcement/failure contracts.

## Stop conditions
Stop if a critical invariant depends solely on model compliance.