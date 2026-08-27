# Privacy and Data Minimization Rules

## Purpose
Limit unnecessary exposure of personal, confidential, and privileged information during forensic work.

## Scope
Applies to collection, indexing, search, analysis, sharing, reporting, retention, and disposal.

## MUST
- Collection and review MUST be constrained to authorized investigative objectives where technically feasible.
- Sensitive evidence MUST be classified and access-controlled according to risk.
- Reports MUST include only sensitive details necessary to support findings.
- Derived datasets and exports MUST inherit appropriate protection from source evidence.
- Retention and disposal MUST follow applicable policy, legal hold, and authorization requirements.

## MUST NOT
- MUST NOT copy unrelated sensitive data for convenience.
- MUST NOT place secrets, credentials, privileged material, or unnecessary personal data in general-purpose notes.
- MUST NOT use forensic evidence for unrelated purposes without authority.

## SHOULD
- Apply targeted filtering, redaction, pseudonymization, and segregated review where appropriate.
- Minimize analyst access to unrelated content.

## Exceptions
Broader collection may be necessary for technical completeness; document why filtering at acquisition was unsafe and apply minimization during review.

## Verification
Inspect access controls, collection filters, report redactions, retention settings, export inventories, and disposal records.