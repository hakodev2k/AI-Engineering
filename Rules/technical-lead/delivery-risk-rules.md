# Delivery Risk Rules
## Purpose
Expose technical delivery risk early enough to change the plan.
## Scope
Estimation, sequencing, dependencies, unknowns, migrations, and release commitments.
## MUST
- Estimates for uncertain work MUST identify significant unknowns and dependencies rather than present false precision.
- Critical external dependencies and blocking decisions MUST have owners and escalation paths.
- Material scope or risk changes MUST be communicated promptly.
## MUST NOT
- Hide technical risk to preserve an obsolete commitment.
- Compress required safety verification silently when schedule pressure increases.
## SHOULD
- Reduce uncertainty through spikes, prototypes, staged delivery, or early integration where useful.
## Exceptions
Emergency deadlines may change scope or verification only with explicit risk acceptance by authorized stakeholders.
## Verification
Review plans, risk logs, dependency status, decision timing, scope changes, and release evidence.