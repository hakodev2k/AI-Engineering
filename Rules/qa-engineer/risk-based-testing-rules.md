# Risk-Based Testing Rules
## Purpose
Allocate verification effort according to probable and costly failures.
## Scope
Prioritization, regression selection, exploratory testing, and release assessment.
## MUST
- Evaluate impact and likelihood for changed and dependent behavior.
- Prioritize critical customer journeys, security boundaries, data integrity, money flows, and irreversible actions when applicable.
- Record accepted untested risks before release.
## MUST NOT
- Drop high-risk coverage solely because of schedule pressure.
- Equate unchanged code with unchanged risk when dependencies or configuration changed.
## SHOULD
- Use incidents, telemetry, defect history, and usage patterns to refine risk models.
## Exceptions
Risk acceptance requires a named decision owner and compensating monitoring or rollback where practical.
## Verification
Review risk register, regression selection rationale, escaped defects, and release approvals.