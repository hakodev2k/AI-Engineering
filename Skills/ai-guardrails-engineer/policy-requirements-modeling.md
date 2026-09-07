# Policy Requirements Modeling

## Purpose
Translate product, safety, legal, and operational requirements into enforceable AI guardrail requirements with explicit scope, precedence, ownership, and evidence.

## When to use
Use when introducing or revising behavioral constraints, tool permissions, content controls, escalation rules, or safety policy. Do not invent legal obligations; obtain authoritative requirements first.

## Inputs
Policy sources, product requirements, risk assessment, architecture, user roles, data classifications, tool capabilities, incident history, and acceptance criteria.

## Preconditions
Authoritative policy owners and system boundaries must be identifiable.

## Context to inspect
Inspect prompt hierarchy, retrieval sources, tool interfaces, identities, trust boundaries, existing controls, exception paths, telemetry, and downstream side effects.

## Core knowledge
Guardrails fail when prose requirements are ambiguous, conflicting, or untestable. Model requirements in terms of subject, action, resource, condition, decision, obligation, and precedence. Separate preventive, detective, and responsive controls. Preserve traceability from requirement to enforcement and verification.

## Procedure
1. Identify stakeholders and authoritative sources.
2. Extract normative statements and resolve ambiguous terminology.
3. Classify each requirement by risk, scope, lifecycle stage, and enforcement point.
4. Define allowed outcomes such as allow, deny, transform, abstain, or escalate.
5. Specify precedence for conflicting rules and documented exceptions.
6. Define positive, negative, and boundary acceptance cases.
7. Map each requirement to one or more enforcement layers.
8. Record assumptions, dependencies, owners, and residual risk.
9. Convert requirements into testable policy cases.
10. Review feasibility with engineering, security, legal, and operations stakeholders as appropriate.

## Decision points
Prefer deterministic enforcement for hard invariants. Use semantic classifiers where meaning cannot be captured reliably by deterministic rules. Require human approval when uncertainty and impact are both high.

## Common failure patterns
Vague categories, undocumented exceptions, prompt-only enforcement, contradictory rules, missing tenant scope, requirements with no verification path, and hidden dependencies on model obedience.

## Verification
Confirm every high-risk requirement has an owner, enforcement point, tests, telemetry expectations, and defined failure behavior. Run conflict and exception tests before release.

## Expected output
A versioned, testable policy requirement set with traceability from source requirement to control and evidence.

## Stop conditions
Stop and escalate when authoritative requirements conflict, legal interpretation is required, or a critical invariant cannot be enforced safely.