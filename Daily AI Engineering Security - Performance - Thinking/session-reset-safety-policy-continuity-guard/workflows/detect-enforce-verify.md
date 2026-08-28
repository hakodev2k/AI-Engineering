# Workflow: Detect, Enforce, Verify
## Trigger
High-risk tool request or a new session targeting a resource/action with recent safety decisions.
## Goal
Prevent session-reset/reframing bypass while allowing verifiably authorized security testing.
## Inputs
Current event, continuity ledger, policy, authorization evidence.
## Baseline
Measure high-risk calls after prior refusal, reset-bypass attempts, and authorized-test false positives.
## Stages
1. Observe target, action class, requested effect, and session ID.
2. Measure recent matching decisions across sessions.
3. Diagnose whether the new request differs materially or only conversationally.
4. Verify authorization independently.
5. Run deterministic guard.
6. If blocked, preserve evidence and stop the risky tool call.
7. If allowed, apply least privilege and a scoped authorization envelope.
8. Verify with an independent Security Verifier.
## Checkpoints
Before authorization check; before high-risk tool execution; after any session reset.
## Metrics
Restart-bypass block rate, authorized-test pass rate, prior-refusal recurrence, false positives.
## Retry policy
Maximum 2 policy-diagnosis retries; no autonomous retries of blocked high-risk tools.
## Stop conditions
Missing authorization, repeated reset bypass, contradictory target evidence, or retry exhaustion.
## Failure path
Block tool call and escalate with minimized evidence.
## Verification
Independent reviewer repeats the same action from a new session and confirms the prior block still applies.
## Definition of Done
Evidence documented, policy limitation addressed, reset fixtures blocked, legitimate authorization fixture passes, no secrets stored, independent verification passes.
