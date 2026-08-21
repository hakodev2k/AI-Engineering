# Change Review Rules
## Purpose
Ensure material database changes receive evidence-based peer and operational review.
## Scope
DDL, SQL, configuration, access, maintenance, migrations, and topology changes.
## MUST
- Review correctness, locking, runtime, compatibility, security, recovery, and observability for material changes.
- Include executable verification and rollback criteria in high-risk change plans.
- Escalate destructive, irreversible, security-weakening, or public-contract-impacting actions for explicit human approval.
## MUST NOT
- Self-approve high-risk production changes when independent review is required.
- Hide uncertainty, failed tests, or known operational risk from reviewers.
## SHOULD
- Keep changes small enough that cause and rollback remain understandable.
## Exceptions
Emergency procedures require documented authority and retrospective review.
## Verification
Inspect pull requests, change records, approvals, test evidence, diffs, rollout plans, and post-change checks.