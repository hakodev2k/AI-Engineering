# Code Review Rules
## Purpose
Make review a risk-control and design-validation activity rather than a formatting ceremony.
## Scope
Pull requests, frontend architecture, correctness, security, accessibility, performance, and operability.
## MUST
- Reviewers MUST evaluate behavior, failure modes, trust boundaries, compatibility, accessibility, and test evidence proportional to change risk.
- High-risk changes MUST identify assumptions, affected contracts, rollout concerns, and verification evidence in the review context.
- Review comments that identify correctness or safety defects MUST be resolved with evidence before merge.
- Generated or AI-assisted code MUST receive the same ownership and verification as manually written code.
## MUST NOT
- Approval MUST NOT be based solely on tests being green when important risks are outside test coverage.
- Large unrelated changes MUST NOT be bundled when separation is practical and improves reviewability.
## SHOULD
- Prefer small, coherent changes with explicit rationale and screenshots/traces where visual or runtime evidence helps.
## Exceptions
Emergency review may be abbreviated only with named approval and follow-up review.
## Verification
PR diff, review record, CI evidence, risk notes, and unresolved-conversation inspection.