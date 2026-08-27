# Account Recovery
## Purpose
Prevent recovery paths from becoming authentication bypasses.
## Scope
Password reset, factor reset, unlock, and identity recovery.
## MUST
- Recovery assurance MUST be proportional to account impact and enrolled authenticator strength.
- Recovery events MUST revoke or reassess compromised sessions and credentials when indicated.
- High-risk recovery MUST create attributable audit evidence and user notification where appropriate.
## MUST NOT
- Knowledge-only questions MUST NOT be the sole control for high-value recovery.
- Support personnel MUST NOT bypass documented verification procedures without approved escalation.
## SHOULD
- Apply risk signals and cooling-off periods for sensitive changes.
## Exceptions
Require emergency justification, named approver, compensating monitoring, and retrospective review.
## Verification
Exercise recovery abuse cases, inspect audit trails, and review exception records.