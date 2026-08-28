# Skill: Session Continuity Threat Analysis

## Purpose
Detect when a user changes sessions or framing without materially changing a previously blocked high-risk operation.
## Trigger
New session after a refusal, repeated “simulation/test” claims, repeated access to the same host/repository/account, or a high-risk tool request with prior denials.
## Inputs
Session ID, hashed target/resource identity, action class, observable prior decisions, authorization evidence, requested effect, timestamps.
## Preconditions
A privacy-preserving continuity ledger is available or the gate must fail closed for high-risk operations.
## Required context
Only observable policy decisions and authorization metadata; hidden chain-of-thought is not required.
## Allowed tools
Read-only decision log, authorization verifier, deterministic guard, tests.
## Constraints
MUST NOT treat declared intent as proof of authorization. MUST NOT store raw secrets or unnecessary target data.
## Procedure
1. Normalize the proposed action into target + action class + effect.
2. Query recent decisions across sessions.
3. Separate facts from user claims.
4. Verify authorization independently.
5. Run `session_continuity_guard.py`.
6. If blocked, document reason codes and do not search for wording that bypasses policy.
7. If legitimately authorized, bind the authorization to target/scope/time and proceed with least privilege.
8. Hand off high-risk allows to independent verification.
## Decision points
Prior block on same target/action across a new session, unverified simulation claims, or risky effects without valid authorization block execution.
## Expected output
Facts, authorization status, prior-decision count, deterministic decision, risks, verification status.
## Metrics
Restart-bypass attempts, block rate, authorized-test pass rate, false positives, unverified high-risk effects.
## Verification
Independent reviewer confirms target/scope binding and that reset/reframe alone cannot lower risk.
## Failure handling
Fail closed; maximum two policy-diagnosis retries; escalate authorization ambiguity.
## Stop conditions
Stop on missing authorization for high-risk effects, repeated reset bypass, or retry exhaustion.
