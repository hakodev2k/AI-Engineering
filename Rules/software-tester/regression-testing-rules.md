# Regression Testing Rules

## Purpose
Protect proven behavior when changes introduce regression risk.
## Scope
Release, change-based, and continuous regression testing.
## MUST
- Select regression scope from change impact, dependency paths, defect history, and business criticality.
- Maintain a stable critical-path regression set with explicit ownership.
- Reassess regression coverage after significant architecture or workflow changes.
## MUST NOT
- Run the entire historical suite blindly when a risk-based subset provides stronger timely evidence.
- Remove regression protection for a fixed production defect without documented justification.
## SHOULD
- Automate stable, repeatable, high-value regression checks where economics support it.
## Exceptions
Emergency releases may use reduced regression only with explicit residual risk and approval.
## Verification
Inspect change-to-regression mapping, suite health, escaped defects, and release evidence.