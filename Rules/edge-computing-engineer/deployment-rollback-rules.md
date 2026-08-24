# Deployment and Rollback
## Purpose
Limit blast radius when releasing changes to geographically distributed fleets.
## Scope
Application, runtime, firmware, model, and configuration releases.
## MUST
- Production deployments MUST use progressive cohorts with explicit health gates.
- Rollback or forward-recovery procedures MUST be prepared before high-risk release.
- Production deployment execution MUST require human approval when it can materially affect service, data, or safety.
## MUST NOT
- MUST NOT continue rollout after unexplained critical health regression.
- MUST NOT assume rollback is possible without testing schema, state, and version compatibility.
## SHOULD
- Cohorts SHOULD represent hardware, network, geography, and workload diversity.
## Exceptions
Emergency changes require incident context, approval, enhanced monitoring, and post-change review.
## Verification
Inspect release records, cohort gates, compatibility tests, rollback drills, and post-deployment metrics.