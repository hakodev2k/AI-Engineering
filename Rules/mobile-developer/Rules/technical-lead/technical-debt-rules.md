# Technical Debt Rules
## Purpose
Manage deliberate shortcuts and accumulated structural risk transparently.
## Scope
Known maintainability, reliability, security, testability, and architecture debt.
## MUST
- Material debt MUST state impact, trigger or urgency, affected scope, and ownership.
- Deliberate shortcuts MUST document why the trade-off is acceptable and what would require remediation.
- Security or reliability debt with significant production risk MUST be escalated rather than silently normalized.
## MUST NOT
- Label ordinary unfinished work as technical debt to avoid completing requirements.
- Refactor large areas without a defined problem and verification strategy.
## SHOULD
- Prioritize debt using evidence of delivery drag, defect risk, operational cost, or strategic constraint.
## Exceptions
Low-impact debt may remain undocumented when remediation cost exceeds plausible risk.
## Verification
Review backlog, incidents, change history, architecture findings, and remediation outcomes.