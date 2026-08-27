# Verification and Validation Rules
## Purpose
Establish that the implementation solves the intended model and that the model is adequate for its intended use.
## Scope
Software verification, model validation, acceptance, and revalidation.
## MUST
- Distinguish implementation verification from real-world model validation.
- Define pass/fail criteria before final evidence review.
- Revalidate after changes that can materially alter outputs.
## MUST NOT
- Treat passing unit tests as evidence of physical or operational validity.
- suppress failed validation cases from reported evidence.
## SHOULD
- Use independent reference cases and reviewers for high-consequence models.
## Exceptions
Missing ground truth must be documented with alternative evidence and reduced claim strength.
## Verification
Audit test reports, reference cases, validation datasets, discrepancies, and approvals.