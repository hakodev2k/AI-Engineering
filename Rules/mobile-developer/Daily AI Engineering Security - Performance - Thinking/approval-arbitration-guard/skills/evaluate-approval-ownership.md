# Skill — Evaluate Approval Ownership

## Purpose
Determine who may decide a privileged request and whether an external approver may claim it.

## Trigger
Before external approval dispatch or whenever reviewer state changes.

## Inputs
Request ID, action/risk class, effective reviewer if available, policy, current arbitration state, external approver health.

## Preconditions
Request is not already terminal; policy version is known.

## Allowed tools
Read-only policy/config inspection, request-state lookup, deterministic arbitration script, audit logging.

## Constraints
Do not execute the privileged action. Do not infer an unknown reviewer as external. Do not expose secrets in audit data.

## Procedure
1. Normalize request identity and risk class.
2. Read effective reviewer from authoritative runtime state when available.
3. Classify external integration as observer, eligible claimant, or forbidden claimant.
4. If eligible, compute bounded lease expiry.
5. Run `scripts/approval_arbitrator.py` with current state and proposed transition.
6. Emit the allowed transition and fallback path.
7. Record evidence sufficient for an independent verifier.

## Decision points
- Reviewer known and native: defer.
- Reviewer known and external: claim within lease.
- Reviewer unknown + high risk: defer/fail closed.
- Existing live claim: reject competing claim unless policy explicitly supports arbitration.
- Terminal state: reject all new decisions.

## Expected output
Structured transition, owner, expiry, fallback, reason, verification status.

## Metrics
Routing mismatch rate, late-decision rate, claim expiry count, native-prompt lockout duration.

## Verification
Independent verifier checks that exactly one terminal transition exists and fallback remains reachable.

## Failure handling
One read retry for transient state lookup. On persistent ambiguity, defer to native/human path.

## Stop conditions
Stop on terminal state, policy violation, or unresolved reviewer ambiguity.
