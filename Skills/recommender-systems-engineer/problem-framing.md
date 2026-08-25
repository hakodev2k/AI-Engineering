# Recommender Problem Framing

## Purpose
Turn a product objective into a measurable recommendation problem, avoiding technically impressive systems that optimize the wrong behavior.

## When to use
Use for new recommenders, major objective changes, or redesigns. Do not use as a substitute for product discovery when the desired user outcome is unknown.

## Inputs
Product goal, user journeys, candidate surfaces, business constraints, historical behavior, guardrails, and available feedback signals.

## Context to inspect
Existing ranking logic, event taxonomy, eligibility rules, experimentation history, latency budget, inventory dynamics, and known harms.

## Core knowledge
Recommendation is a decision system. Separate user value, proxy labels, business value, and constraints. Optimize expected long-term utility rather than blindly maximizing clicks. Account for selection bias, delayed feedback, feedback loops, and position effects.

## Procedure
1. Define the decision, consumer, surface, and eligible inventory.
2. State the desired user outcome in observable terms.
3. Map outcomes to candidate labels and identify proxy weaknesses.
4. Define primary offline and online metrics plus guardrails.
5. Establish latency, freshness, privacy, cost, and diversity constraints.
6. Segment important cohorts and cold-start cases.
7. Specify baseline behavior and minimum improvement worth shipping.
8. Document assumptions and unresolved risks before model selection.

## Decision points
Choose ranking, retrieval, matching, or sequencing according to the actual decision. Prefer simple objectives when labels are reliable; use multi-objective optimization only when trade-offs are explicit and measurable.

## Common failure patterns
Optimizing CTR alone, undefined eligibility, label leakage, ignoring delayed outcomes, mixing retrieval and ranking objectives, and treating business constraints as afterthoughts.

## Verification
Confirm stakeholders agree on decision boundaries, metrics can be computed from real events, baselines are reproducible, and guardrails cover material failure modes.

## Expected output
A recommendation problem specification with objective, labels, metrics, constraints, cohorts, baseline, assumptions, and risks.

## Stop conditions
Stop when the desired outcome is ambiguous, required events are unavailable, or proposed optimization creates unresolved safety, privacy, or policy risk.