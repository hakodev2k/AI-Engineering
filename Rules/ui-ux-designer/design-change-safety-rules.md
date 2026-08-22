# Design Change Safety Rules
## Purpose
Control UX changes that can cause irreversible user, business, security, or public-contract impact.
## Scope
Destructive actions, permissions, identity, payments, consent, migrations, and high-risk releases.
## MUST
- Classify consequential changes by reversibility, blast radius, user harm, and dependency risk.
- Require authorized human approval before weakening security/privacy controls, changing material consent, or introducing irreversible destructive behavior.
- Define migration, rollback, communication, and support plans for high-impact changes.
- Keep AI agents within granted authority for analysis, recommendation, preparation, approval, and execution.
## MUST NOT
- Ship high-risk design merely because implementation is complete.
- Remove safeguards without evidence, owner, and approval.
## SHOULD
- Use staged rollout and reversible mechanisms for significant uncertainty.
## Exceptions
Emergency safety fixes require expedited approval and retrospective review.
## Verification
Inspect risk classification, approvals, rollout controls, rollback plan, communications, and post-release evidence.