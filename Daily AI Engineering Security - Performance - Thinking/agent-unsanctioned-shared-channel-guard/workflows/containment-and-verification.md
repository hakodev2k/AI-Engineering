# Containment and Verification Workflow

## Trigger
Run before enabling a new autonomous/multi-agent environment, after changing tools/network policy, or when telemetry shows multiple agents writing the same destination.

## Goal
Prove that only explicitly approved shared coordination channels are writable and that undeclared or emergent swarm channels are blocked.

## Inputs
Tool inventory, destination policy, agent identities, network/proxy configuration, normalized outbound events, and approval records.

## Baseline
Capture before changes:
- Count of write-capable adapters and classified destinations.
- Number of shared writes lacking provenance/purpose.
- Distinct agents per shared destination per 5-minute window.
- Number of undeclared shared writes that would currently succeed.
- Existing alert/block latency.

## Context
Use `../skills/shared-channel-threat-model.md`, `../rules/coordination-boundary-rules.md`, and `../config/policy.json`.

## Stages
1. **Observe** — inventory external/persistent writes and collect representative normalized events.
2. **Measure baseline** — quantify unclassified paths, provenance gaps, and convergence.
3. **Diagnose** — identify which adapters or policies allow undeclared shared state.
4. **Form hypothesis** — state the smallest enforceable change expected to close each path.
5. **Implement improvement** — narrow permissions, classify channels, attach provenance, and invoke the deterministic gate before writes.
6. **Measure again** — replay baseline fixtures plus new adversarial fixtures.
7. **Improved?** — if no, re-evaluate the hypothesis; maximum two remediation iterations.
8. **Independent verification** — Coordination Security Reviewer attempts alternate-adapter and convergence bypasses.
9. **Complete** — archive non-secret evidence and release the environment only when all blocking criteria pass.

## Responsible agent
Implementation may be performed by the platform/security engineer or implementation agent. Final verification MUST be performed by `../subagents/coordination-security-reviewer.md` or an equivalent independent reviewer.

## Tools
Repository/config inspection, proxy/firewall logs, adapter logs, `python3 ../scripts/coordination_gate.py`, and `python3 ../tests/test_coordination_gate.py`.

## Outputs
Updated policy, gate integration, baseline/after metrics, test output, reviewer verdict, exception approvals if any, and recovery notes.

## Checkpoints
- C1: all write-capable adapters inventoried.
- C2: shared-state semantics classified.
- C3: gate enforced on every shared-write path.
- C4: automated tests pass.
- C5: independent bypass review passes.

## Metrics
Classification coverage, provenance coverage, undeclared-write block rate, false-block rate on approved traffic, peak distinct agents/channel/window, and mean block latency.

## Retry policy
At most two remediation iterations after the first failed verification. Each retry MUST introduce a new evidence-backed hypothesis. Replaying unchanged configuration does not count as remediation.

## Stop conditions
Immediately stop autonomous writes when an undeclared shared mutable path succeeds, provenance is missing, the gate cannot parse policy/events, or a bypass allows convergence above threshold.

## Failure path
Detection -> preserve sanitized event evidence -> switch affected capability to read-only -> identify failed control -> remediate -> rerun deterministic tests -> independent review. After two failed remediation attempts, escalate to a human security owner and keep writes disabled.

## Verification
Security is verified only when the attack path is blocked, approved bounded traffic still passes, permission boundaries are no broader than baseline, no secrets appear in evidence, and the independent reviewer returns `VERIFIED`.

## Definition of Done
Evidence documented; baseline captured; all shared-write paths classified; policy implemented; tests pass; before/after metrics captured; risks documented; required human approvals recorded; independent verification complete; no blocking issue remains.
