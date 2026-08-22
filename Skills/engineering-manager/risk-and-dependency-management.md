# Risk and Dependency Management

## Purpose
Identify and actively manage technical, organizational, delivery, security, and external dependency risks before they become incidents or missed commitments.

## When to use
Use during planning and throughout execution of material engineering work.

## Inputs
Plans, architecture, dependency map, vendor commitments, staffing, incident history, security constraints, and operational data.

## Context to inspect
Inspect critical-path dependencies, single points of knowledge, external approvals, vendor limits, migration constraints, and assumptions with weak evidence.

## Core knowledge
Risk combines uncertainty and consequence. A useful risk register drives action; listing risks without owners, triggers, or mitigations provides little value.

## Procedure
1. Enumerate plausible failure modes across delivery, technology, people, operations, security, and vendors.
2. Estimate probability and impact with available evidence.
3. Identify leading indicators and trigger conditions.
4. Prioritize risks by exposure and time sensitivity.
5. Choose avoidance, reduction, transfer, contingency, or explicit acceptance.
6. Assign an accountable owner and review date.
7. Reduce dependency risk through contracts, interfaces, mocks, sequencing, or alternatives.
8. Track whether mitigation changes exposure.
9. Escalate risks before options disappear.
10. Close risks only with evidence.

## Decision points
Mitigate early when impact is severe or options shrink over time. Accept low-exposure risk explicitly when mitigation costs more than expected loss.

## Common failure patterns
Risk lists without action, hiding uncertainty to protect confidence, confusing issues with risks, no contingency, and escalating only after deadlines are missed.

## Verification
Verify top risks have owners, triggers, mitigation or contingency, and current status supported by evidence.

## Expected output
A prioritized risk and dependency register integrated into delivery decisions.

## Stop conditions
Escalate immediately for unacceptable security, compliance, safety, financial, or contractual exposure outside delegated authority.