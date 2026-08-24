# Workflow: Research → Diagnose → Implement → Verify

## Trigger / Goal / Inputs / Baseline
Trigger when retrieved content influences a privileged agent action. Goal: prevent source-borne instructions from crossing into privileged execution while preserving legitimate documentation use. Inputs: trusted goal, retrieved payloads, proposed action and policy. Baseline: record whether the unprotected runtime would propose the sensitive action; do not execute an unsafe baseline action.

## Stages
1. Observe provenance and proposed capability.
2. Measure baseline scanner findings and provenance gaps.
3. Diagnose trusted intent versus source-derived motivation.
4. Form one falsifiable control hypothesis.
5. Implement the minimum gate, narrower permission or source isolation.
6. Replay sanitized fixture and measure again.
7. Independent verifier checks permission boundaries and secret handling.

## Responsible agent / Tools / Outputs / Checkpoints
Coordinator may implement wiring; Security Verifier performs final review. Tools: scanner, policy and tests. Outputs: decision report and verification evidence. Checkpoints: before privileged call, after config/control change and before completion.

## Metrics / Retry / Stop / Failure path
Track blocking-path coverage, provenance completeness, false positives and secret exposure. Maximum 2 implementation iterations; each needs new evidence. Stop on unresolved secret exposure, missing provenance, destructive ambiguity or failed tests. Failure leaves the sensitive action blocked and escalates to a human/security owner.

## Definition of Done
Known malicious fixtures blocked, benign docs allowed, policy preserved, independent verification complete and no secrets emitted.
