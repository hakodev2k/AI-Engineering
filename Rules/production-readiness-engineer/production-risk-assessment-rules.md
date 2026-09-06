# Production Risk Assessment Rules
## Purpose
Ensure production risk is analyzed systematically before execution.
## Scope
Deployments, migrations, infrastructure changes, feature launches, dependency upgrades, and operational interventions.
## MUST
- Risk assessment MUST evaluate blast radius, reversibility, data impact, security impact, dependency impact, user impact, and detectability.
- High-risk changes MUST identify credible failure modes and controls that prevent, detect, contain, and recover from them.
- Risk severity MUST follow the project's accepted model; unknown likelihood MUST NOT be treated as low risk.
- Large-blast-radius or weakly reversible changes MUST require stronger validation and explicit human approval.
- Residual risk MUST be stated after mitigations.
## MUST NOT
- Schedule urgency MUST NOT be used as evidence that risk is acceptable.
- Risk MUST NOT be downgraded merely because a similar change previously succeeded.
## SHOULD
- Prefer incremental exposure, canary, dark launch, or staged rollout for high-impact changes.
- Include operational and organizational failure modes, not only code defects.
## Exceptions
Deviations require rationale, compensating controls, residual-risk ownership, and approval.
## Verification
Review failure-mode analysis, severity ratings, rollout design, mitigations, and approvals.