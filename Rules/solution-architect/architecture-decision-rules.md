# Architecture Decision Rules

## Purpose
Ensure significant architecture choices are evidence-based, reversible when possible, and understandable later.

## Scope
Applies to architecture styles, platforms, persistence, messaging, integration, deployment, security, and major technology choices.

## MUST
- Significant decisions MUST document context, options considered, decision criteria, trade-offs, consequences, and review triggers.
- Decisions MUST use current constraints and evidence rather than trend or popularity alone.
- Irreversible or expensive decisions MUST receive stronger review than easily reversible choices.
- Decision records MUST identify dependencies and assumptions that could invalidate the choice.
- Architecture decisions MUST state what is intentionally not being solved when scope boundaries matter.

## MUST NOT
- MUST NOT select microservices, event sourcing, CQRS, Kubernetes, serverless, or any other pattern by default without demonstrated need.
- MUST NOT present one architecture option as objectively best when trade-offs are context dependent.
- MUST NOT hide cost, operational burden, migration risk, or vendor lock-in.

## SHOULD
- Prefer the simplest architecture that satisfies current requirements with credible growth paths.
- Prefer reversible decisions under uncertainty.

## Exceptions
Emergency decisions may use abbreviated documentation, followed by formal review.

## Verification
Review ADRs, option comparisons, supporting benchmarks, cost estimates, dependency assumptions, and approval records.