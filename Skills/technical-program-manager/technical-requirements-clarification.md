# Technical Requirements Clarification

## Purpose
Turn ambiguous program requirements into testable technical outcomes, constraints, interfaces, and acceptance criteria without taking over engineering design ownership.

## When to use
Use when cross-team execution is blocked by unclear requirements, conflicting interpretations, or missing non-functional constraints.

## Inputs
Product requirements, architecture context, stakeholder needs, NFRs, compliance constraints, existing interfaces.

## Context to inspect
Prior decisions, API contracts, SLOs, security standards, data requirements, user journeys, and operational dependencies.

## Core knowledge
Senior TPMs distinguish requirement gaps from design choices. They surface ambiguity, coordinate the right owners, and ensure acceptance criteria are observable.

## Procedure
1. Identify statements that cannot yet be tested or assigned.
2. Separate business outcome, functional behavior, and technical constraint.
3. Capture conflicting interpretations explicitly.
4. Bring authoritative owners together to resolve them.
5. Define measurable acceptance criteria and edge conditions.
6. Record open assumptions and decision deadlines.
7. Confirm downstream teams have a consistent interpretation.
8. Trace clarified requirements into milestones and validation plans.

## Decision points
Escalate only when ambiguity affects multiple teams, irreversible design, compliance, or committed outcomes. Leave local implementation detail to engineering owners.

## Common failure patterns
TPM inventing technical requirements, vague acceptance language, undocumented assumptions, and treating architecture preferences as mandatory requirements.

## Verification
Ask independent teams to restate the requirement and test criteria; discrepancies indicate unresolved ambiguity.

## Expected output
A clarified requirement set with owners, measurable criteria, assumptions, and traceability.

## Stop conditions
Stop when authoritative requirement ownership is missing or resolving ambiguity requires product, legal, security, or architecture approval.