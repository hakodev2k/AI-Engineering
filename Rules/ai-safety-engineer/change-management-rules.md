# Safety Change Management Rules

## Purpose
Control safety regressions introduced by model, prompt, policy, data, tool, or infrastructure changes.

## Scope
Applies to any change capable of altering model behavior, exposure, permissions, or safety controls.

## MUST
- Classify safety impact before merge or deployment.
- Identify affected evaluations, mitigations, monitoring, documentation, and approvals.
- Re-run relevant regression tests against the exact changed artifact.
- Preserve traceability from change to evidence and release decision.

## MUST NOT
- Treat prompt or policy changes as harmless configuration when they alter safety behavior.
- Bundle unrelated high-risk changes so regressions cannot be attributed.
- disable a safety control without explicit risk review and approval.

## SHOULD
- Keep safety-significant changes small, reversible, and independently observable.
- Use canaries or staged rollout when production behavior is uncertain.

## Exceptions
Emergency changes require documented urgency, minimum necessary scope, monitoring, rollback, and retrospective review.

## Verification
Inspect diffs, safety-impact classification, linked test runs, approvals, rollout plan, and post-deployment signals.
