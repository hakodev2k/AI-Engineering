# Architecture Trade-off Analysis

## Purpose
Make distributed architecture decisions using explicit requirements, failure assumptions, measurable constraints, and reversible trade-offs rather than pattern preference.

## When to use
Use for major technology choices, service decomposition, storage selection, consistency decisions, messaging adoption, and scaling redesigns.

## Inputs
Functional requirements, NFRs, constraints, current architecture, operational maturity, cost, team capabilities, and alternatives.

## Context to inspect
Inspect production evidence, incident history, workload characteristics, compliance, deployment model, existing platform capabilities, and migration cost.

## Core knowledge
Distributed design optimizes competing properties: consistency, availability, latency, durability, simplicity, cost, autonomy, and operability. Every additional component creates failure and ownership cost.

## Procedure
1. State the decision and why it is needed now.
2. Separate hard constraints from preferences.
3. Define measurable success criteria and failure assumptions.
4. Generate at least two viable alternatives, including keeping the current design where reasonable.
5. Evaluate correctness, latency, availability, scalability, security, operations, cost, and migration risk.
6. Identify irreversible decisions and unknowns.
7. Run prototypes/benchmarks for high-impact uncertainties.
8. Choose the simplest option meeting requirements with acceptable risk.
9. Record rationale, rejected options, consequences, and review triggers.
10. Revisit when assumptions materially change.

## Decision points
Prefer reversible decisions and evolutionary paths under uncertainty. Accept complexity only when it buys a requirement that can be articulated and verified.

## Common failure patterns
Resume-driven architecture, pattern cargo culting, optimizing hypothetical scale, ignoring operations/team maturity, and documenting only the chosen option.

## Verification
Confirm the selected design satisfies stated criteria with evidence or bounded experiments and that major risks have mitigations/owners.

## Expected output
A decision record with alternatives, trade-offs, evidence, consequences, and review conditions.

## Stop conditions
Escalate when critical requirements conflict, evidence is insufficient for an irreversible decision, or risk acceptance exceeds the engineer's authority.