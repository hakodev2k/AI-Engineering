# Model Governance Rules

## Purpose
Ensure consequential quantitative models have accountable ownership, independent challenge, and controlled lifecycle management.

## Scope
Applies to models used for trading, valuation, risk, allocation, forecasting, reporting, or material decisions.

## MUST
- Every production model MUST have an accountable owner, documented purpose, validation status, version, approval state, and review cadence.
- Model materiality MUST determine validation depth and change-control rigor.
- Independent validation MUST challenge assumptions, data, methodology, implementation, limitations, and outcomes for material models.
- Known limitations and remediation items MUST be tracked with owners and deadlines.
- Retired models MUST be removed from active decision paths and retained only according to audit requirements.

## MUST NOT
- Self-review by the author MUST NOT substitute for required independent validation.
- Material model changes MUST NOT be disguised as routine code maintenance.
- Expired or rejected validation status MUST NOT be ignored in production use.

## SHOULD
- Maintain an inventory linking models to consumers, dependencies, controls, and monitoring.
- Define thresholds distinguishing minor from material changes.

## Exceptions
Exceptions require documented business necessity, time-bound risk acceptance, compensating controls, and approval by the accountable governance authority.

## Verification
Inspect model inventory, validation reports, approvals, change history, limitation registers, review dates, production references, and retirement evidence.