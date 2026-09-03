# Change Approval Rules

## Purpose
Control changes that can invalidate formal assurance, alter verified guarantees, or trigger dangerous downstream actions.

## Scope
Applies to requirement, specification, proof, implementation, configuration, toolchain, public-contract, security-control, and production-impacting changes tied to formal claims.

## MUST
- Perform impact analysis before changing definitions, assumptions, properties, refinement mappings, or trusted components.
- Re-run all verification obligations transitively affected by a material change.
- Distinguish analysis, recommendation, preparation, and execution when work can affect production, data, security, or public contracts.
- Require authorized human approval before production deployment, destructive data operations, irreversible migrations, security weakening, secret rotation, infrastructure destruction, breaking public contracts, or other high-risk execution.
- Preserve prior verification evidence when needed to compare assurance before and after the change.

## MUST NOT
- Treat a proof diff as low risk merely because implementation code did not change.
- Bypass failed verification to unblock release without explicit risk acceptance.
- Force push, rewrite shared history, or perform irreversible actions without authorization.
- Claim unchanged assurance when assumptions or trusted components changed materially.

## SHOULD
- Prefer reversible, staged changes with observable verification gates.
- Document trade-offs and rollback paths for assurance-significant modifications.

## Exceptions
Emergency departures require explicit authority, reason, bounded scope, residual risk, verification plan, and post-change review.

## Verification
Inspect change diffs, dependency impact, rerun results, approvals, release evidence, rollback plans, and audit records for high-risk actions.