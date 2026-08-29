# Architecture Communication

## Purpose
Communicate complex solution architecture accurately to executives, engineers, security teams, and operators at the level each audience needs.

## When to use
Use for design reviews, proposals, handoffs, decision meetings, and technical documentation.

## Inputs
Architecture, audience, decisions, requirements, risks, diagrams, evidence.

## Context to inspect
Audience expertise, concerns, decision authority, terminology, prior context, and time available.

## Core knowledge
Effective technical communication preserves correctness while changing abstraction level. Diagrams should express boundaries, flows, trust, dependencies, and decisions—not decorative detail.

## Procedure
1. Identify the audience decision or action.
2. Select the minimum architecture views needed.
3. State outcome and constraints before components.
4. Explain boundaries and key flows.
5. Surface trade-offs, risks, and assumptions.
6. Use quantitative evidence where relevant.
7. Separate current, proposed, and optional states.
8. Confirm understanding and decisions.

## Decision points
Use high-level context views for executives and deeper sequence/deployment/data views for implementers. Add detail only when it changes understanding.

## Common failure patterns
One diagram for every audience, unexplained acronyms, hidden risks, excessive implementation detail, and ambiguous arrows.

## Verification
Audience can accurately restate the decision, major boundaries, and material trade-offs.

## Expected output
Clear architecture artifacts tailored to the decision context.

## Stop conditions
Stop when architecture facts are unverified or communication would imply unsupported commitments.