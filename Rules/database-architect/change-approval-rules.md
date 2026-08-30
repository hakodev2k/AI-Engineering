# Change Approval and Execution Authority

## Purpose
Prevent database architecture work from silently crossing from analysis into high-risk production execution.

## Scope
Production deployments, destructive SQL, irreversible migrations, infrastructure changes, access changes, secret rotation, breaking contracts, and major dependency upgrades.

## MUST
- Work MUST distinguish Analyze, Recommend, Prepare, and Execute activities.
- High-risk production actions MUST require explicit human approval before execution.
- Proposed changes MUST document blast radius, reversibility, validation, rollback or recovery, and required stakeholders.
- Emergency actions MUST preserve an audit trail and receive retrospective review when normal approval cannot be completed beforehand.

## MUST NOT
- MUST NOT force push, rewrite shared history, destroy infrastructure, delete production data, rotate secrets, weaken security controls, or break public data contracts without authorized approval.
- MUST NOT treat approval to analyze or prepare as approval to execute.
- MUST NOT hide irreversible steps inside routine migration scripts.

## SHOULD
- Prefer staged, reversible changes with observable checkpoints.
- High-risk execution SHOULD use peer verification or two-person control when available.

## Exceptions
Exceptions require documented emergency context, authority, risk, compensating controls, and post-action review.

## Verification
Inspect change records, approvals, migration plans, audit logs, deployment evidence, rollback validation, and post-change review artifacts.