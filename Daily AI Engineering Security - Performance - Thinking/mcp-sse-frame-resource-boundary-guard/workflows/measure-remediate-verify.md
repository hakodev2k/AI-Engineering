# Workflow: Measure → Remediate → Verify

## Trigger
New/changed MCP SSE transport, vulnerable dependency discovery, or failed boundary probe.

## Goal
Demonstrate bounded resource consumption for incomplete SSE events and preserve valid-stream behavior.

## Inputs
`config/policy.json`, transport implementation/version, valid and adversarial fixtures.

## Baseline
Record current dependency version, cap values (or absence), behavior on a delimiter-free fixture, and normal fixture pass rate. Never establish the baseline by exhausting production memory.

## Stages
1. **Observe** — Research Agent records current advisory/version evidence.
2. **Measure baseline** — Security engineer runs the offline probe and tests.
3. **Diagnose** — Identify the append/drain path and where limits are absent or too late.
4. **Hypothesis** — State the smallest boundary change expected to reject the attack without altering valid parsing.
5. **Implement** — Upgrade dependency and/or add application-layer cap, abort, telemetry, and bounded retry behavior.
6. **Measure again** — Repeat identical fixtures and collect peak buffer/abort metrics.
7. **Independent verify** — `subagents/transport-security-verifier.md` reviews results.

## Tools
Source inspection, package manager metadata, `scripts/sse_boundary_probe.py`, unit tests.

## Outputs
Before/after report, test output, verifier verdict, residual-risk note.

## Checkpoints
- C1: vulnerable-range check complete.
- C2: baseline captured.
- C3: cap executes before excess append.
- C4: valid-stream regression passes.
- C5: independent verdict PASS.

## Metrics
Peak incomplete buffer, abort offset, abort latency, valid fixture pass rate, retry count.

## Retry policy
Maximum two implementation iterations. Each retry must use a changed hypothesis supported by new evidence.

## Stop conditions
Complete on verifier PASS. Stop and escalate after two failed iterations or if production-only testing would be required.

## Failure path
Pin/upgrade to known-safe SDK, disable the affected remote transport if feasible, preserve logs, and escalate. Do not raise memory limits as the fix.

## Definition of Done
Evidence documented; baseline measured; boundary implemented; adversarial probe rejected at policy bound; valid tests pass; structured telemetry present; verifier PASS; no known vulnerable dependency remains.
