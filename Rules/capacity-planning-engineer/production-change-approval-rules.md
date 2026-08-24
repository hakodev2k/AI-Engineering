# Production Change Approval Rules
## Purpose
Keep capacity planning analysis separate from authority to execute risky changes.
## Scope
Production scaling, configuration, quotas, topology, destructive actions, and security-sensitive changes.
## MUST
- Analysis, recommendation, preparation, and execution MUST be explicitly distinguished.
- Production capacity changes with material cost, availability, data, or security impact MUST receive authorized human approval before execution.
- Changes MUST define verification and rollback or compensating action where reversible rollback is impossible.
## MUST NOT
- MUST NOT destroy infrastructure, delete data, weaken security controls, rotate secrets, or make irreversible migrations without explicit approval.
- MUST NOT force-push or rewrite shared Git history as part of capacity work.
## SHOULD
- High-risk changes SHOULD use staged rollout and independent review.
## Exceptions
Emergency procedures may supersede normal flow only under documented incident authority.
## Verification
Inspect change records, approvals, diffs, execution logs, and post-change validation.