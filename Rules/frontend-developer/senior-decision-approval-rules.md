# Senior Decision and Approval Rules
## Purpose
Define evidence, authority, reversibility, and escalation for high-impact frontend decisions.
## Scope
Architecture, security, production, contracts, dependencies, migrations, and risky execution.
## MUST
- Significant technical choices MUST record relevant constraints, alternatives, trade-offs, and evidence proportional to impact.
- Actions that weaken security, break public contracts, expose sensitive data, or materially change production behavior MUST obtain required human approval before execution.
- Large framework or dependency migrations MUST define compatibility, staged adoption, rollback/stop criteria, and ownership.
- Recommendations MUST distinguish analysis, preparation, and execution authority.
- Irreversible or difficult-to-reverse changes MUST receive stronger review than reversible changes.
## MUST NOT
- Agent or engineer confidence MUST NOT substitute for evidence.
- Production changes, force pushes, secret changes, or security-control weakening MUST NOT be executed outside granted authority.
## SHOULD
- Prefer reversible decisions when evidence is incomplete and learning is cheap.
## Exceptions
Emergency actions require the fastest authorized approval path and retrospective evidence.
## Verification
Decision records, approval trail, rollout plan, risk assessment, and post-change evidence.