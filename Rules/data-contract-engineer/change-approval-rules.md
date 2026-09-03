# Change Approval Rules

## Purpose
Control high-risk contract changes with explicit authority and review.

## Scope
Applies to breaking changes, semantic redefinitions, destructive removals, critical quality changes, and production contract migrations.

## MUST
- High-risk changes MUST identify owner, affected consumers, evidence, rollback or containment strategy, and approval authority before execution.
- Breaking changes MUST receive human approval from accountable owners before production release.
- Approval records MUST describe the exact change being authorized.
- Emergency approvals MUST be retrospective-reviewed after stabilization.

## MUST NOT
- An AI agent or automation MUST NOT execute a breaking production contract change solely because it can prepare or recommend it.
- Approval MUST NOT be inferred from silence, prior unrelated approvals, or successful tests alone.
- Security, privacy, or compliance controls MUST NOT be weakened to accelerate migration.

## SHOULD
- Prefer reversible, staged changes with smaller approval scope.
- Approval workflows SHOULD distinguish analysis, preparation, validation, and execution authority.

## Exceptions
Emergency execution requires an established incident authority, documented reason, bounded scope, and follow-up review.

## Verification
Inspect change records, approvals, deployment evidence, migration plans, incident records, and repository diffs.