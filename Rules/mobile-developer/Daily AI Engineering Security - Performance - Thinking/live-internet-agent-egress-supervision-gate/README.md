# Live Internet Agent Egress Supervision Gate

## Topic
Deterministic authorization for live-internet actions performed by autonomous agents.

## Category
Security

## Problem
An agent may have technically available internet tools while being authorized to interact with only a narrow task scope. Recent cyber-evaluation incidents show that prompt-level scope boundaries can be crossed when outbound network access is not independently enforced.

## Evidence
See `evidence/research.md`. It separates observed public evidence from interpretation and the proposed engineering mitigation.

## Existing approach
Common controls include sandboxing, natural-language scope instructions, model-side classifiers, selected confirmations, and post-hoc audit logs.

## Existing limitations
These controls do not necessarily enforce the destination/action boundary at the moment of contact. A sandbox can still have unrestricted outbound connectivity, and a model can misunderstand or route around natural-language scope.

## Proposed improvement
Put a deny-by-default authorization gate in front of every network-capable tool. Bind permission to normalized destination, protocol, action class, policy version, and approval expiry. Re-check redirects and freeze high-impact egress after repeated violations.

## Architecture
The threat-model skill converts a task into a destination/action boundary. `config/egress-policy.json` stores the deterministic policy. `hooks/pre-egress.md` requires the host runtime to call `scripts/egress_gate.py` before network contact. The Security Verifier independently tests the boundary using local fixtures.

## Package tree
```text
live-internet-agent-egress-supervision-gate/
├── README.md
├── config/
│   └── egress-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-egress.md
├── rules/
│   └── egress-boundary.md
├── scripts/
│   └── egress_gate.py
├── skills/
│   └── egress-threat-model.md
├── subagents/
│   └── security-verifier.md
├── tests/
│   └── test_egress_gate.py
└── workflows/
    └── enforce-and-escalate.md
```

## Installation
Requires Python 3.10+ and no third-party packages. Copy the package into the repository or agent-control project. Integrate the pre-egress hook into every adapter capable of external communication.

## Configuration
Edit `config/egress-policy.json`:
- replace `example.internal` with exact authorized destinations;
- keep `default_action` as `deny` unless a reviewed approval-only discovery policy is required;
- define the high-impact action set for your tools;
- tune `freeze_after_denials` according to incident policy;
- keep private-network blocking enabled unless the task explicitly requires private targets.

Do not store credentials in this policy.

## Usage
Create a request JSON and run:

```bash
python3 scripts/egress_gate.py request.json --policy config/egress-policy.json
```

Exit codes are contractual: `0 allow`, `2 invalid`, `4 approval required`, `5 deny`, `6 freeze`. The calling tool adapter MUST treat every non-zero result as non-authorization.

Run deterministic unit tests:

```bash
python3 -m unittest tests/test_egress_gate.py
```

## Workflow
Follow `workflows/enforce-and-escalate.md`: Observe → baseline coverage → classify destination/action → enforce → re-measure → independently verify. Retries are bounded and denied actions are never automatically reissued.

## Metrics
Track pre-egress gate coverage, unauthorized-contact leakage, approval mismatch blocks, time-to-detect, freeze accuracy, and secrets found in logs. A useful deployment target is 100% gate coverage and zero contacted denied destinations in adversarial fixtures.

## Verification
The implementation is **Implemented** when all adapters call the gate. It is **Measured** when baseline and post-integration gate coverage plus fixture results are recorded. It is **Verified** only after an independent verifier demonstrates that denied/unknown/private/redirect/stale-approval cases fail closed and that logs are redacted.

## Safety
The package does not contact destinations itself. Tests use normalization and policy functions locally. Never test a denied path by actually contacting an unauthorized real system. Model explanations cannot override deterministic policy.

## Failure handling
Detection: any non-zero gate result, bypassed adapter, mismatched approval, or repeated denial. Evidence: redacted decision record and test output. Retry: one normalization retry for malformed local input; zero automatic retries for denied network actions. Fallback: disable the affected network-capable adapter. Escalation: security owner/human operator. Stop condition: freeze when policy threshold is reached or when enforcement cannot be guaranteed.

## Definition of Done
- Current evidence is documented.
- Network-capable tools are inventoried.
- Destination/action policy is explicit and deny-by-default.
- Gate executes before contact and before redirects.
- Unknown high-impact actions require approval.
- Repeated denials freeze high-impact egress.
- Tests pass.
- Audit records contain no secrets.
- Independent security verification has no blocking findings.

## Customization
Add action classes and policy adapters to match the host agent framework, but preserve fail-closed behavior, action-bound approval, redirect re-authorization, and independent verification.