# Technical Tradeoff Partnership

## Purpose
Participate effectively in architecture and engineering trade-offs without prescribing implementation outside product expertise.

## When to use
Use when technical choices affect customer outcomes, reliability, cost, delivery time, extensibility, data, security, or future product options.

## Inputs
Product outcomes, non-functional requirements, architecture options, engineering estimates, risks, operational constraints, and future scenarios.

## Context to inspect
Inspect current architecture, known bottlenecks, incident history, platform standards, migration constraints, and product roadmap uncertainty.

## Core knowledge
Senior product managers make product consequences explicit while engineering owns technical design. Technical debt is valuable to address when it changes risk, speed, cost, or customer outcomes.

## Procedure
1. Clarify the customer and business outcomes affected.
2. Ask engineering to describe viable options and constraints.
3. Translate technical differences into product consequences.
4. Identify irreversible choices and future option value.
5. Quantify reliability, performance, cost, security, or delivery implications where possible.
6. Challenge assumptions without dictating implementation.
7. Decide product trade-offs such as scope, timing, compatibility, and risk tolerance.
8. Record decisions and revisit triggers.
9. Ensure technical investments have observable product or operational outcomes.

## Decision points
Prefer simpler architecture when it meets foreseeable needs and preserves options. Invest earlier when migration cost, reliability risk, or platform leverage grows nonlinearly with delay.

## Common failure patterns
PM-designed architecture, dismissing technical debt, accepting gold plating, treating all technical work as invisible, and using future scale as an untested assumption.

## Verification
Engineering agrees technical feasibility is represented accurately; product trade-offs and NFRs are explicit; decision ownership is clear.

## Expected output
A product-informed technical decision with constraints, consequences, risks, and measurable rationale.

## Stop conditions
Escalate when architecture creates unacceptable safety/security risk or when specialist judgment is required beyond available expertise.