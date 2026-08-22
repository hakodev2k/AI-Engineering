# Domain Modeling Collaboration

## Purpose
Collaborate with domain experts and engineers to establish precise business language, rules, entities, state transitions, and boundaries needed for correct product behavior.

## When to use
Use in complex domains, rule-heavy workflows, ambiguous terminology, integrations, and features where business concepts are repeatedly misunderstood.

## Inputs
Business processes, policies, examples, domain experts, existing data models, user journeys, and current terminology.

## Context to inspect
Inspect conflicting terms, lifecycle states, invariants, ownership, exceptional cases, and where different teams use the same word differently.

## Core knowledge
The Product Owner should ensure the product meaning is correct while avoiding dictating software class structures. Techniques such as event storming and example mapping help expose hidden rules.

## Procedure
1. Identify the business capability being modeled.
2. Gather domain experts and delivery participants.
3. Define important terms using concrete examples.
4. Map events, commands, states, actors, and rules as useful.
5. Surface invariants and invalid transitions.
6. Identify boundaries where meanings or ownership change.
7. Resolve ambiguous or overloaded terminology.
8. Convert key rules into acceptance examples.
9. Update product documentation and backlog language.
10. Revisit the model when new exceptions appear.

## Decision points
Use lightweight examples for simple domains; use structured workshops for complex stateful domains. Allow different bounded contexts to use different terms when meanings genuinely differ.

## Common failure patterns
Treating database schema as the domain, Product Owner designing classes, inconsistent terminology, missing invalid states, and modeling only the happy workflow.

## Verification
Stakeholders and engineers use consistent language, critical rules have examples, and ambiguous state transitions are resolved before implementation.

## Expected output
A shared domain vocabulary and product-level model sufficient for accurate requirements and acceptance.

## Stop conditions
Escalate unresolved policy interpretation to authoritative domain owners rather than inventing business rules.