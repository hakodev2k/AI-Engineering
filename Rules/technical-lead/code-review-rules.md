# Code Review Rules
## Purpose
Make review a risk-control mechanism rather than a formatting exercise.
## Scope
Pull requests and changes requiring technical review.
## MUST
- Review MUST evaluate correctness, security, compatibility, failure modes, tests, maintainability, and operational impact relevant to the change.
- High-risk changes MUST receive review from an appropriate domain owner.
- Review comments blocking merge MUST state the concrete risk or violated requirement.
## MUST NOT
- Approve code that is not understood sufficiently to assess its risk.
- Use review to enforce undocumented personal preferences as mandatory standards.
## SHOULD
- Keep changes reviewable and separate unrelated refactoring from risky functional changes.
## Exceptions
Emergency review shortcuts require recorded approval and post-release review.
## Verification
Inspect PR approvals, review discussions, CI evidence, change size, and ownership requirements.