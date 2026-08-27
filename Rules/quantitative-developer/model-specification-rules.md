# Model Specification Rules

## Purpose
Ensure quantitative models have explicit economic, statistical, and operational meaning before implementation or deployment.

## Scope
Applies to pricing, forecasting, signal, portfolio, risk, optimization, and decision models.

## MUST
- Every model MUST state its objective, target variable, decision horizon, inputs, outputs, assumptions, constraints, and intended consumers.
- Assumptions that materially affect results MUST be documented and linked to validation evidence.
- Units, calendars, conventions, transformations, and sign semantics MUST be explicit.
- Model limitations and conditions under which outputs are unreliable MUST be recorded.
- Material model changes MUST receive independent review before production use.

## MUST NOT
- Models MUST NOT rely on undocumented economic assumptions or hidden constants.
- Backtest success MUST NOT be treated as proof that a model is correctly specified.
- A model MUST NOT be repurposed outside its validated domain without reassessment.

## SHOULD
- Prefer the simplest specification that satisfies validated requirements.
- Separate economic assumptions from implementation details so each can be reviewed independently.

## Exceptions
Any exception requires documented rationale, affected decisions, evidence, risk, compensating controls, verification, and approval from the accountable model owner.

## Verification
Review model documentation, parameter definitions, unit tests for conventions, validation reports, change diffs, and approval records. Confirm an independent reviewer can reproduce the stated model behavior from the specification.