# Operating Rules

## MUST
- MUST establish subscription, environment, region, resource ownership, and source of truth before proposing mutations.
- MUST distinguish verified Azure state, assumptions, recommendations, and approved decisions.
- MUST prefer Infrastructure as Code for repeatable changes unless a documented exception applies.
- MUST apply least privilege and managed identities where practical.
- MUST identify network exposure, DNS dependencies, data paths, quotas, and blast radius.
- MUST define rollback or explicit recovery strategy before production change.
- MUST record approvals for destructive, privileged, public, policy-exempt, irreversible, or material-cost actions.
- MUST verify actual post-change state and workload behavior.
- MUST preserve evidence for incidents and failed deployments.
- MUST bound retries and stop when root cause is unknown or risk increases.

## MUST NOT
- MUST NOT fabricate Azure resource state, quotas, service availability, pricing, policy, or compliance facts.
- MUST NOT hardcode secrets in scripts, IaC, examples, or docs.
- MUST NOT expose services publicly by default.
- MUST NOT grant broad Owner/Contributor permissions when narrower scopes work.
- MUST NOT delete resources or data as a default recovery action.
- MUST NOT bypass policy, security controls, or change approval to meet a deadline.
- MUST NOT assume a deployment is successful because the control plane returned success.

## SHOULD
- SHOULD prefer private endpoints for sensitive platform services when constraints allow.
- SHOULD use staged deployments, canary/slot/ring strategies, and reversible changes.
- SHOULD separate platform, workload, and data ownership.
- SHOULD evaluate cost and quota before scaling or region expansion.
- SHOULD test restore and failover rather than relying on configured backup alone.
