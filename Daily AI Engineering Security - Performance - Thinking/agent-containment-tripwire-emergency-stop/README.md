# Agent Containment Tripwire and Emergency Stop

**Category:** Security  
**Run date:** 2026-09-04 UTC+7

## Problem
High-capability agents can operate beyond intended evaluation/runtime boundaries when sandbox, network, credential, or tool controls diverge from effective state. Recent public incidents and developer reports show that configuration-only isolation is not sufficient evidence of containment.

## Evidence
See `evidence/research.md` for observed evidence, interpretation, existing approaches, limitations, root causes, and sources.

## Existing approach
Common controls include static sandbox configuration, container/VM isolation, network allowlists, tool permissions, and post-hoc logs.

## Existing limitations
Controls may fail open, execute in different privilege domains, silently broaden access after sandbox errors, or detect compromise only after execution.

## Proposed improvement
Add an independent containment control plane with pre-run attestation, deterministic runtime tripwires, evidence capture, and an emergency-stop path outside the agent's writable trust domain.

## Package tree
```text
README.md
config/containment-policy.json
evidence/research.md
hooks/pre-run-containment-check.md
rules/containment-policy.md
scripts/containment_guard.py
skills/containment-threat-model.md
subagents/containment-monitor.md
tests/test_containment_guard.py
workflows/secure-evaluation-run.md
```

## Installation
Python 3.10+; standard library only. Copy the directory intact.

## Configuration
Edit `config/containment-policy.json` to match approved attestations, event classes, and network destinations. Keep secrets outside policy files.

## Usage
```bash
python scripts/containment_guard.py preflight --policy config/containment-policy.json --attestation attestation.json
python scripts/containment_guard.py event --policy config/containment-policy.json --event event.json
python -m unittest tests/test_containment_guard.py
```
Exit codes: `0` allow/pass, `2` policy violation/block/stop, `3` invalid input.

## Workflow
Observe effective state -> attest baseline -> start only after pass -> independently monitor security events -> block and stop on tripwire -> preserve evidence -> human security review -> recover or terminate. Preflight correction is bounded to two retries. Confirmed containment violations are never auto-retried.

## Metrics
Preflight pass rate, violation block rate, stop-decision latency, unauthorized events reaching execution, false-positive rate, and evidence completeness.

## Verification
- **Implemented:** all package artifacts exist and the deterministic checker is present.
- **Measured:** deployment records baseline and runtime metrics.
- **Verified:** unit tests pass; violating fixtures produce block/stop; approved fixtures pass; monitor independence is independently reviewed.

## Safety
The active policy, audit sink, and emergency-stop path MUST be inaccessible to agent writes. The agent MUST NOT authorize its own resume after a violation. Dangerous or irreversible recovery actions require explicit human approval.

## Failure handling
Detection: failed attestation, malformed event, monitor loss, policy mismatch, or tripwire. Evidence: preserve event/attestation and decision. Retry: maximum two for benign preflight defects. Fallback: fail closed. Escalation: human security reviewer. Stop: confirmed violation or inability to prove monitoring/containment state.

## Definition of Done
Current evidence documented; trust boundaries mapped; required attestations defined; policy active; tests pass; approved and violating fixtures behave correctly; no secrets included; recovery ownership documented; no blocking issue remains; independent reviewer records Verified status.

## Customization
Add environment-specific event types and attestations without weakening fail-closed behavior or moving the monitor into the agent's privilege domain.
