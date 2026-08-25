# Workflow: Adopt and Verify Message Isolation

## Trigger
Adding or changing cross-session discovery, peer messaging, workflow children, or reply routing.

## Goal
Enforce least-privilege delivery with verifiable provenance and correct reply correlation.

## Inputs
Runtime trace, session registry, workflow membership, policy envelope schema, current behavior baseline.

## Baseline
Capture at least 20 representative message decisions or all messages in a smaller test workload. Record unrelated-session visibility, approvals, routing mismatches, and missing provenance.

## Stages
1. **Observe** — map discovery, delivery, and reply paths.
2. **Measure baseline** — run the validator in audit-only mode; count violations without altering delivery.
3. **Diagnose** — separate discovery-scope, identity, authority, and reply-correlation defects.
4. **Form hypothesis** — choose the smallest enforceable boundary change.
5. **Implement** — place the gate before recipient model ingestion; keep human authority non-delegable.
6. **Measure again** — replay the same fixtures/traces.
7. **Verify** — independent Message Security Reviewer executes regression cases.

## Responsible agent
Implementation: platform engineer. Verification: Message Security Reviewer.

## Tools
`python scripts/message_policy.py`, `python -m unittest tests/test_message_policy.py`, runtime trace capture.

## Outputs
Before/after metrics, validator decisions, test results, approval requirements, residual risk.

## Checkpoints
After baseline; after first enforcement change; before production enablement.

## Metrics
Cross-workflow blocks, route mismatches, provenance omissions, relayed-authority attempts, false positives.

## Retry policy
Maximum two implementation revisions per run. A third failure requires design escalation.

## Stop conditions
Stop immediately if legitimate same-workflow traffic cannot be identified by stable IDs or if the runtime cannot intercept before delivery.

## Failure path
Disable child cross-session messaging or force human-mediated relays. Do not fallback to display-name trust.

## Verification
All deterministic tests pass and sampled runtime traces show zero unapproved cross-workflow deliveries and zero reply-route mismatches.

## Definition of Done
Implemented: pre-delivery gate integrated. Measured: baseline and post-change metrics captured. Verified: independent regression pass with no blocking invariant failure.
