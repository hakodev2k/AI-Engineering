# Production Change Control Rules

## Purpose
Prevent security architecture from being weakened by unreviewed or unsafe production changes.

## Scope
Production deployments, security configuration, identity policy, network controls, secrets, cryptography, data access, infrastructure, and emergency changes.

## MUST
- Production changes affecting security boundaries MUST have documented scope, risk, validation, rollback or containment, and accountable approval.
- Changes to authentication, authorization, encryption, privileged access, network exposure, or sensitive-data handling MUST receive security-aware review before execution unless an authorized emergency process applies.
- Destructive, irreversible, or broad access changes MUST require explicit human approval.
- Emergency changes MUST be logged, bounded, verified after execution, and retrospectively reviewed.
- Post-change verification MUST confirm both intended function and security control effectiveness.

## MUST NOT
- MUST NOT disable security controls solely to unblock deployment.
- MUST NOT force-push or rewrite shared history as a substitute for controlled remediation.
- MUST NOT execute destructive infrastructure, data, secret-rotation, or access changes outside authorized change boundaries.

## SHOULD
- Prefer staged rollout, canaries, feature controls, policy simulation, and reversible changes for high-risk security modifications.

## Exceptions
Emergency exceptions require incident context, authorized decision-maker, bounded scope, monitoring, recovery plan, and follow-up review.

## Verification
Inspect change records, approvals, diffs, deployment logs, policy tests, rollback evidence, monitoring, and post-change security validation.