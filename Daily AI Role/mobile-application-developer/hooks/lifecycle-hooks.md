# Lifecycle Hooks
Deterministic hooks for a tool-neutral mobile workflow.

## on_intake
- Validate required work-item fields.
- Classify feature, defect, hotfix, sync/data, security/privacy, performance, or release work.
- Compute priority inputs: impact, severity/security, deadline/dependency, cost of delay, reversibility, confidence, effort, approval latency.

## before_implementation
- Require mobile state/edge-case contract.
- Require source-of-truth for persisted/synced data.
- Require permission/privacy review when sensitive capability is introduced.

## before_review
- Require changed-file scope, tests run, device/OS evidence, telemetry impact, known risks.

## before_release
- Require immutable build identity, migration compatibility, release checklist and named human approver.

## on_failure
- Capture failure signature, reproduction, last known good state, attempted fixes and evidence.
- Maximum automatic retry count: 2 for the same strategy.
- After limit, require root-cause reassessment or escalation.

## on_completion
- Verify Definition of Done, handoff owner, follow-up items and learning record when failure occurred.

Hooks MUST be idempotent where invoked repeatedly; they MUST NOT submit builds, rotate signing keys, delete user data, or alter production configuration without explicit authorization.