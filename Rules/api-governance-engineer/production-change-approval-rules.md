# Production Change Approval Rules

## Purpose
Control high-risk API changes that can affect consumers, production data, security, or externally visible contracts.

## Scope
Applies to production deployments and changes with material contract, data, security, or availability impact.

## MUST
- Breaking public-contract changes MUST require explicit human approval before production execution.
- Production configuration changes that alter routing, authentication, authorization, limits, or data exposure MUST be reviewed and approved.
- Irreversible migrations, destructive data operations, and high-risk access changes MUST require documented rollback or recovery strategy and accountable approval.
- High-risk changes MUST identify affected consumers, blast radius, monitoring signals, rollback criteria, and execution owner.
- Analyze, recommend, prepare, and execute permissions MUST be treated as distinct authority levels for automated agents.

## MUST NOT
- An automated agent MUST NOT deploy, delete data, rewrite history, weaken security controls, rotate secrets, or break a public contract without explicit authority.
- Review requirements MUST NOT be bypassed merely to meet a delivery deadline.
- A rollback plan MUST NOT be claimed when restoration has not been validated or bounded realistically.

## SHOULD
- High-risk changes SHOULD use progressive rollout and reversible controls when architecture permits.
- Approval evidence SHOULD be linked to the exact change artifact.

## Exceptions
Emergency execution requires incident-level authorization, documented reason, minimum necessary scope, post-change verification, and retrospective review.

## Verification
Inspect approvals, deployment records, contract diffs, configuration diffs, migration plans, rollback tests, audit logs, and post-release telemetry. Confirm execution matched approved scope.