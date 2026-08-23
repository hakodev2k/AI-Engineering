# Architecture Cost Rules

## Purpose
Make cost a first-class architecture constraint without overriding reliability, security, or business requirements.

## Scope
New systems, major redesigns, migrations, scaling strategies, managed services, data architecture, and multi-region designs.

## MUST
- Evaluate material architecture options using workload assumptions, cost drivers, operational burden, scalability, resilience, and lock-in.
- Identify dominant cost dimensions and how they scale with demand.
- Document significant cost trade-offs in architecture decisions.
- Revisit cost assumptions when demand or architecture materially changes.

## MUST NOT
- Select the lowest-cost design without validating required non-functional requirements.
- Optimize list price while ignoring data transfer, support, licenses, operations, commitments, and failure modes.
- Present speculative architecture savings as realized savings.

## SHOULD
- Model multiple demand scenarios and identify break-even points for materially different designs.

## Exceptions
Urgent reliability or security remediation may precede detailed cost analysis, with follow-up review.

## Verification
Inspect architecture records, cost models, workload assumptions, scenario analysis, and production cost behavior after implementation.