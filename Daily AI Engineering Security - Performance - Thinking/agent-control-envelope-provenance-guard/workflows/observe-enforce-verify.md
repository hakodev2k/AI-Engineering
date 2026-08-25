# Workflow: Observe → Enforce → Verify

## Trigger
A runtime consumes subagent/tool/external text in a context that also supports privileged control messages.

## Goal
Eliminate text-only privilege escalation across the control/data boundary.

## Inputs
Message schemas, prompt builder, traces, reserved markers, trust policy, fixtures.

## Baseline
Capture current behavior for at least one legitimate control message and four spoof fixtures from distinct untrusted sources. Record whether each reaches the privileged parser and whether a sensitive action can be influenced.

## Context
Use `skills/control-channel-threat-model.md` and enforce `rules/trusted-control-envelopes.md`.

## Stages
1. **Observe** — map producers, transforms, and consumers; run baseline fixtures.
2. **Diagnose** — identify where provenance is lost or privilege is inferred from text.
3. **Hypothesis** — state the smallest boundary change that prevents spoofing while preserving data fidelity.
4. **Implement** — add provenance metadata and pre-ingest validation/escaping. Do not alter unrelated permissions.
5. **Measure again** — repeat baseline fixtures and compare decisions.
6. **Independent verification** — `subagents/security-verifier.md` reviews the change and test evidence.
7. **Complete** — retain evidence and publish the integration contract.

## Responsible agent
Implementation owner for stages 1–5; independent Security Verifier for stage 6.

## Tools
Static inspection, trace capture, `scripts/control_envelope_guard.py`, unit/integration tests.

## Outputs
Baseline record, root cause, enforcement configuration, before/after decisions, verification verdict.

## Checkpoints
- CP1: all privileged message types enumerated.
- CP2: vulnerable transition reproduced or explicitly ruled out.
- CP3: enforcement runs before prompt assembly.
- CP4: negative and positive tests pass.
- CP5: independent verifier signs off.

## Metrics
Blocked spoof count, false positives, provenance coverage, untrusted-to-privileged transition count, test pass rate.

## Retry policy
Maximum two implementation/verification cycles. Each retry must address a specific failed fixture or missing boundary. Repeating the same change without new evidence is prohibited.

## Stop conditions
Stop successfully when all blocking fixtures pass and provenance coverage is complete. Stop unsuccessfully after two failed cycles or whenever the host cannot preserve provenance end to end.

## Failure path
Preserve logs and fixture, disable the affected privileged producer or isolate its output as data, then escalate to the platform/security owner. Do not weaken the gate to restore convenience.

## Verification
The same spoof bytes must remain data when produced by an untrusted source, and only a valid runtime-issued envelope may be interpreted as control.

## Definition of Done
Implemented, Measured, and Verified are separately recorded; all tests pass; no secrets are logged; no blocking trust-boundary issue remains.
