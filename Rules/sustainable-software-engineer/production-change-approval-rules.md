# Production Change Approval Rules

## Purpose
Keep sustainability-driven production actions within authorized human control and preserve reversibility for high-risk changes.

## Scope
Applies to production configuration, capacity, region, topology, retention, deletion, scaling, deployment, and infrastructure changes.

## MUST
- Analysis, recommendation, preparation, and execution MUST be treated as distinct authority levels.
- Production deployments, destructive data actions, infrastructure destruction, irreversible migrations, secret changes, security-control changes, and material reductions in resilience MUST require explicit human approval before execution.
- High-risk changes MUST define expected impact, monitoring signals, abort criteria, rollback or recovery procedure, and responsible owner.
- Approval evidence MUST identify the reviewed change rather than a generic standing authorization when practical.

## MUST NOT
- MUST NOT execute destructive or irreversible production changes merely because a sustainability metric improves.
- MUST NOT weaken authentication, authorization, encryption, logging, backup, or recovery controls to reduce resource use without formal security and operational approval.
- MUST NOT force push or rewrite shared Git history as part of this role's automation without explicit authorization.

## SHOULD
- Prefer reversible, staged, canary, or time-bounded changes for uncertain optimizations.
- Separate measurement changes from destructive optimization actions where practical.

## Exceptions
Emergency exceptions require incident authority, documented reason, scope, evidence, follow-up review, and restoration of normal governance as soon as practical.

## Verification
Inspect change records, approval evidence, deployment logs, configuration diffs, rollback plans, audit logs, monitoring results, and incident or post-change reviews.
