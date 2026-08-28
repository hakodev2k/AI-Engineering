# Build Change Governance Rules

## Purpose
Control high-impact changes to shared build infrastructure through evidence, review, reversibility, and explicit risk ownership.

## Scope
Applies to build-system migrations, global build-rule changes, toolchain upgrades, cache policy changes, worker changes, release build behavior, and shared configuration.

## MUST
- Broad build changes MUST identify affected repositories, targets, platforms, and developer workflows before rollout.
- High-risk migrations MUST define measurable success criteria, rollback steps, and a staged adoption plan.
- Breaking changes to shared build interfaces MUST be communicated and versioned or migrated deliberately.
- Production or release build changes with irreversible impact MUST require human approval before execution.
- Post-change verification MUST compare expected and observed build correctness, reliability, and performance.

## MUST NOT
- MUST NOT perform forceful repository history changes, destructive infrastructure changes, or security-control weakening as an implicit part of build maintenance.
- MUST NOT roll out ecosystem-wide build changes without a bounded pilot when staged validation is feasible.
- MUST NOT declare a migration complete while known critical targets remain unverified.

## SHOULD
- Significant decisions SHOULD be recorded with alternatives, trade-offs, and operational consequences.
- Build deprecations SHOULD provide migration guidance and a defined removal timeline.

## Exceptions
Exceptions require urgency justification, risk assessment, explicit approval, compensating verification, and a rollback or recovery strategy.

## Verification
Review change records, affected-target analysis, approvals, staged rollout evidence, rollback tests, and post-change correctness and performance metrics.