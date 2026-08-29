# AI Use Case Intake Rules

## Purpose
Ensure proposed AI use cases are understood before implementation so governance reviews evaluate the real operational context rather than an abstract model description.

## Scope
Applies to intake, problem framing, intended use, prohibited use, users, beneficiaries, affected parties, deployment context, and initial control routing.

## MUST
- Every material AI use case MUST document the problem being solved, intended users, affected parties, expected decision influence, autonomy level, and operational context.
- Intake MUST distinguish assistive, recommendatory, autonomous, and enforcement-oriented uses when their risk differs.
- Intended use and known out-of-scope use MUST be documented before approval.
- The intake record MUST identify material data categories, integrations, jurisdictions, external providers, and human decision points.
- Success criteria MUST include user or business value plus relevant safety, fairness, privacy, security, and reliability constraints.
- Unknowns that can change risk classification MUST be resolved or explicitly carried as open risks before progression.

## MUST NOT
- MUST NOT approve a generic capability description without a concrete deployment context.
- MUST NOT infer user consent, legal basis, or acceptable use merely because similar technology is already deployed elsewhere.
- MUST NOT hide consequential downstream decisions behind language such as 'decision support' when operators routinely follow the output without meaningful review.

## SHOULD
- Intake SHOULD capture foreseeable misuse and adjacent use cases likely to emerge after launch.
- Teams SHOULD use a standardized intake schema while allowing domain-specific questions for regulated or high-impact uses.

## Exceptions
Expedited intake MAY be used for time-critical experiments only when production impact is blocked, sensitive data is controlled, and a named owner accepts the temporary constraints. Production use still requires full intake.

## Verification
Review intake artifacts against architecture, product requirements, data flows, user journeys, and operational procedures. Interview owners for high-risk systems to verify the documented use matches actual practice.