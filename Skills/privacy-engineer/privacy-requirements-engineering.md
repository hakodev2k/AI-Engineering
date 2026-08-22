# Privacy Requirements Engineering

## Purpose
Translate privacy goals and approved obligations into precise, testable requirements engineering teams can implement.

## When to use
Use during discovery, architecture, backlog refinement, regulatory remediation, and control standardization.

## Inputs
Business requirements, data flows, product behavior, approved legal guidance, risk assessments, and platform capabilities.

## Context to inspect
Inspect existing conventions, data classifications, identity model, lifecycle mechanisms, user controls, and operational ownership.

## Core knowledge
Requirements such as “be compliant” or “protect privacy” are not implementable. Good requirements specify trigger, scope, actor, data, behavior, timing, exceptions, and evidence.

## Procedure
1. Identify privacy objective and source decision.
2. Define affected systems, data, and actors.
3. Express observable required behavior.
4. Specify timing and lifecycle constraints.
5. Define allowed exceptions and approval paths.
6. Add negative requirements for forbidden behavior.
7. Define verification evidence.
8. Review feasibility with engineering and operations.
9. Maintain traceability to risk or policy decisions.

## Decision points
Separate platform-level controls from product-specific behavior to maximize reuse without hiding product obligations.

## Common failure patterns
Vague requirements, copying legal text into tickets, missing negative cases, and no measurable retention/deletion windows.

## Verification
A reviewer should be able to derive tests without guessing intended behavior.

## Expected output
Clear privacy acceptance criteria and traceable engineering requirements.

## Stop conditions
Escalate ambiguous obligations or conflicting requirements before implementation.