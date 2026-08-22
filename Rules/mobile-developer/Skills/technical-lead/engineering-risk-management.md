# Engineering Risk Management

## Purpose
Identify, prioritize, and actively reduce technical risks before they become schedule surprises or production failures.

## When to use
Use during planning, architecture, migrations, releases, and initiatives with significant uncertainty.

## Inputs
Scope, dependencies, architecture, assumptions, incident history, security/performance requirements, delivery constraints.

## Context to inspect
Inspect irreversible decisions, unknown technologies, external dependencies, data migrations, capacity, ownership, and recovery options.

## Core knowledge
Risk combines uncertainty and consequence. High-impact unknowns deserve early evidence. Risk registers are useful only when linked to actions, owners, and triggers.

## Procedure
1. Enumerate plausible technical and operational failure scenarios.
2. Estimate likelihood, impact, detectability, and reversibility.
3. Rank risks rather than treating all equally.
4. Assign an owner for material risks.
5. Choose avoidance, reduction, transfer, contingency, or explicit acceptance.
6. Run spikes or tests for critical unknowns early.
7. Define leading indicators and triggers.
8. Review risk at meaningful project checkpoints.
9. Escalate residual risk requiring broader authority.
10. Close risks only with evidence.

## Decision points
Spend early effort on risks that can invalidate the plan. Accept low-impact risks when mitigation cost exceeds expected harm.

## Common failure patterns
Generic risk lists, no owners, optimism hiding uncertainty, late performance/security discovery, and confusing issue tracking with risk management.

## Verification
Top risks have current evidence, owners, mitigations, and contingency actions.

## Expected output
A prioritized actionable risk view integrated with technical planning.

## Stop conditions
Escalate when residual risk exceeds agreed tolerance or requires business/security approval.