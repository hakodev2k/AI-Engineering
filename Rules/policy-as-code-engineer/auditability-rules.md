# Policy Auditability Rules

## Purpose
Ensure important policy decisions and control changes can be reconstructed from trustworthy evidence.

## Scope
Applies to decision logs, policy changes, approvals, exceptions, bundle versions, enforcement outcomes, and investigation evidence.

## MUST
- Security-, compliance-, and production-relevant decisions MUST record policy version, enforcement point, decision outcome, timestamp, and non-sensitive identifiers needed for investigation.
- Policy change history MUST preserve author, reviewer or approval evidence where required, source revision, and deployed artifact identity.
- Audit events MUST distinguish ordinary decisions from exceptions, evaluation failures, and administrative bypasses.
- Audit records MUST have access controls and retention appropriate to their sensitivity and investigation requirements.
- Time sources and identifiers used for correlation MUST be sufficiently consistent to reconstruct event ordering.

## MUST NOT
- Audit logs MUST NOT contain credentials, authentication tokens, raw secrets, or unnecessary sensitive payloads.
- Decision evidence MUST NOT be mutable by ordinary policy consumers.
- A successful policy evaluation MUST NOT erase evidence of a bypass or exception used in reaching the result.

## SHOULD
- Stable reason codes SHOULD accompany outcomes to support analysis without exposing policy internals.
- Audit data SHOULD support correlation with application, deployment, and identity events.

## Exceptions
Reduced logging requires documented privacy, scale, or platform constraints, alternative evidence, risk, and accountable approval.

## Verification
Inspect log schemas, retention and access settings, sampled decision records, change history, exception events, and incident reconstruction exercises. Confirm historical decisions can be associated with their policy artifact and enforcement context.