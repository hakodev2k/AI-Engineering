# Approval Arbitration Guard

**Category:** Security

## Problem
External approval hooks can accidentally become a denial-of-service or reviewer-routing boundary. A blocking remote approver can suppress the native human prompt, while an external UI without effective-reviewer context can duplicate or preempt native auto-review.

## Evidence
See `evidence/research.md`. Current signals include OpenAI Codex issues #39447 and #23465.

## Existing approach
Blocking `PermissionRequest` hooks, native approval UI, app-server approval requests, and ad-hoc external approval daemons.

## Existing limitations
Hook order can implicitly decide ownership; reviewer identity/defer semantics may be unavailable; external waits can be long; late remote decisions need cancellation/idempotency.

## Proposed improvement
Make approval ownership an explicit state machine validated before external dispatch. Claims require bounded leases, terminal decisions are unique, late decisions are rejected, unknown-reviewer high-risk actions fail closed/defer, and timeout never implies allow.

## Architecture
```text
approval request
  -> evaluate ownership skill
  -> pre-external-approval hook
  -> approval_arbitrator.py
  -> native/external reviewer
  -> first policy-valid terminal decision
  -> cancellation of competitors
  -> independent approval verifier
```

## Package tree
```text
README.md
evidence/research.md
skills/evaluate-approval-ownership.md
rules/approval-arbitration-rules.md
subagents/approval-verifier.md
workflows/arbitrate-approval.md
hooks/pre-external-approval.md
scripts/approval_arbitrator.py
tests/test_approval_arbitrator.py
```

## Installation
Requires Python 3.9+ and only the standard library. Copy the package into the approval integration repository and invoke the hook before handing a request to any external approver.

## Usage
Prepare `request.json` and `transition.json`, then run:
```bash
python scripts/approval_arbitrator.py validate --state request.json --transition transition.json
```
Exit `0` allows the transition, `2` blocks a policy-invalid transition, and `3` means malformed input/environment.

## Workflow
Follow `workflows/arbitrate-approval.md`. Capture a baseline before rollout, explicitly determine reviewer ownership, allow only bounded claims, accept one terminal decision, cancel competing surfaces, and independently verify the result.

## Metrics
Approval p50/p95, external claim expiry count, rejected late decisions, routing mismatches, native-user lockout duration, and percentage of requests with exactly one terminal decision.

## Verification
Run:
```bash
python -m unittest tests/test_approval_arbitrator.py
```
Then exercise a real integration with: native-user reviewer, external reviewer, unavailable external service, unknown reviewer/high risk, and a late remote response after native approval.

## Safety
The package never executes the privileged action. Timeout never means allow. Critical actions require human/security ownership under the default deterministic rules. Audit data should exclude unnecessary secrets.

## Failure handling
One retry is allowed for transient state/cancellation I/O. Ambiguous ownership releases the external path and defers/fails closed to the configured native or human reviewer. No infinite retry loops.

## Definition of Done
- evidence and limitations documented;
- integration baseline captured;
- all deterministic tests pass;
- exactly one terminal decision per request;
- external claims expire and release fallback;
- late/duplicate decisions are rejected;
- no required human/security review is bypassed;
- verifier reports no blocking issue.

## Status
**Implemented:** package artifacts and deterministic validator.

**Measured:** only after integration telemetry exists.

**Verified:** only after tests and real approval-path scenarios pass.

## Customization
Extend risk classes, reviewer names, lease duration, and policy mappings in the caller. Preserve the invariants in `rules/approval-arbitration-rules.md`.
