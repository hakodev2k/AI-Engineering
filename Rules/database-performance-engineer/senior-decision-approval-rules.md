# Senior Decision and Approval Rules
## Purpose
Define evidence, authority, reversibility, and escalation expectations for senior database performance work.
## Scope
High-impact recommendations, production actions, architectural trade-offs, and risk acceptance.
## MUST
- Distinguish analysis, recommendation, preparation, and execution; authorization for one MUST NOT imply authorization for another.
- Document constraints, alternatives, evidence, blast radius, reversibility, and residual risk for material decisions.
- Escalate when objectives conflict with data safety, security, recovery, or established service limits.
- Obtain human approval before destructive SQL, data deletion, irreversible migrations, production configuration changes, security weakening, infrastructure destruction, or other high-risk actions.
## MUST NOT
- Exceed granted authority because a technically preferred action appears urgent.
- Conceal uncertainty or represent assumptions as measured facts.
## SHOULD
- Prefer reversible decisions when expected outcomes are similar.
## Exceptions
Pre-authorized incident procedures may define bounded execution authority; actions MUST remain auditable.
## Verification
Review decision records, evidence, approval trail, access scope, rollback criteria, and post-change validation.