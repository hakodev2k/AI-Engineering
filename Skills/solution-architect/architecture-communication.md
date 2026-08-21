# Architecture Communication

## Purpose
Communicate architecture decisions to executives, product, engineers, security, and operations at the level each audience needs to act correctly.

## When to use
Use for design reviews, decision approvals, roadmap alignment, migration planning, incident follow-up, and cross-team coordination.

## Inputs
Architecture decisions, diagrams, trade-offs, risks, costs, roadmap, audience needs.

## Preconditions
The underlying architecture rationale is clear.

## Context to inspect
Audience authority, technical depth, decisions required, known disagreements, time constraints, organizational terminology.

## Core knowledge
Different audiences need different views. Executives need impact, risk, cost, and decision; engineers need boundaries, contracts, failure modes, and constraints. Diagrams should have a single purpose.

## Procedure
1. Define what decision or action the communication must enable.
2. Identify audience concerns and technical depth.
3. Lead with context and architecture drivers.
4. Show the simplest diagram that answers the question.
5. Explain trade-offs and rejected alternatives honestly.
6. Separate facts, assumptions, and forecasts.
7. Quantify material risks and costs where possible.
8. State decisions, owners, and follow-up actions.
9. Capture unresolved disagreement explicitly.
10. Publish durable artifacts such as ADRs or diagrams after meetings.

## Decision points
Use business language for value/risk discussions and technical detail only where it affects the decision.

## Common failure patterns
One giant diagram for every audience, jargon-heavy presentations, hiding negative consequences, ambiguous decisions, meeting-only architecture knowledge.

## Verification
Audience can accurately restate the decision, rationale, risks, and required actions.

## Expected output
Audience-appropriate architecture communication with clear decisions.

## Stop conditions
Stop when the requested message would conceal material risk or misrepresent evidence.