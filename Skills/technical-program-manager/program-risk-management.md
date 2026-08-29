# Program Risk Management

## Purpose
Identify, quantify, mitigate, monitor, and escalate risks that can prevent a technical program from achieving its outcomes.

## When to use
Use throughout planning and execution, especially for migrations, platform changes, external dependencies, security-sensitive work, or aggressive timelines.

## Inputs
Program plan, architecture, dependency map, assumptions, incident history, vendor constraints, compliance obligations, staffing data.

## Context to inspect
Previous postmortems, technical debt, release history, capacity bottlenecks, unresolved decisions, operational constraints, and stakeholder commitments.

## Core knowledge
Risks are uncertain future conditions, not current issues. Senior TPMs assess probability, impact, detectability, time-to-impact, mitigation cost, and residual exposure. Risks should be tied to decisions and measurable triggers.

## Procedure
1. Elicit technical, delivery, organizational, operational, security, and external risks.
2. Write each risk as cause, event, and consequence.
3. Score probability and impact using a consistent scale.
4. Assign an accountable risk owner.
5. Define prevention, mitigation, contingency, and trigger conditions.
6. Prioritize risks by exposure and time sensitivity.
7. Review top risks at the program operating cadence.
8. Convert realized risks into actively managed issues.
9. Retire risks only with evidence.

## Decision points
Mitigate when exposure exceeds tolerance, accept when mitigation cost exceeds expected loss and authority approves, transfer when a party can actually own the exposure, and avoid when design or scope can remove the risk.

## Common failure patterns
Generic risk statements, stale registers, no triggers, mitigation without owners, and hiding schedule risk behind green status.

## Verification
Confirm high-exposure risks have funded actions, owners, due dates, and observable triggers. Compare risk trends against actual delivery signals.

## Expected output
A living risk register connected to program decisions, schedule confidence, and escalation.

## Stop conditions
Escalate when residual risk exceeds approved tolerance, a critical risk lacks an owner, or mitigation requires authority outside the program.