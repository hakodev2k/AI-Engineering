# Observability Log Indirect Injection Gate

## Category
Security

## Problem
Logs, traces, alerts, incident records, and error reports may contain attacker-controlled text. When an AI coding/SRE agent reads that evidence and can immediately execute shell commands, mutate infrastructure, read credentials, alter DNS, or persist agent configuration, passive evidence can become an instruction channel.

## Evidence
The mandatory research file documents the August 2026 GhostJacking disclosure and independent reporting. See `evidence/research.md`.

## Existing approach
Typical controls include IAM, tool allowlists, sandboxing, network restrictions, human approval, prompt instructions, DLP/EDR/WAF, and audit logging.

## Existing limitations
Those controls often do not preserve whether an action was proposed because of untrusted evidence. IAM can prove capability but not intent provenance; prompt-only separation is probabilistic; broad approval can be too coarse.

## Proposed improvement
Place a deterministic provenance-aware gate at the real side-effect boundary. Untrusted observability data remains available for read-only investigation, but high-impact actions derived from that data require exact fresh authorization or a narrowly scoped remediation contract.

## Architecture
The host tags evidence provenance, constructs a structured action request, maps capabilities, and invokes `scripts/provenance_action_gate.py` before the executor. The gate evaluates `config/policy.json` and returns allow, approval-required, or deny with a reason code and action hash. Independent verification checks adversarial fixtures and host integration.

## Package tree
```text
observability-log-indirect-injection-gate/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-action-observability-gate.md
├── rules/
│   └── untrusted-observability-data.md
├── scripts/
│   └── provenance_action_gate.py
├── skills/
│   └── observability-trust-analysis.md
├── subagents/
│   └── security-reviewer.md
├── tests/
│   └── test_provenance_action_gate.py
└── workflows/
    └── diagnose-and-enforce.md
```

## Installation
Requires Python 3.10+ and only the standard library. Copy the directory intact. No external Python package is required.

## Configuration
Edit `config/policy.json` to match the host's source classes and real capability names. Keep fail-closed provenance validation for privileged production integrations. Do not remove high-impact capabilities merely to avoid approval prompts.

## Usage
Create a JSON action record with `source_class`, `provenance`, and `action` fields. Run:

`python scripts/provenance_action_gate.py record.json --policy config/policy.json`

Exit `0` allows the evaluated action; `4` requires approval; `5` denies; `2` means invalid input/configuration and must fail closed.

## Workflow
Follow `workflows/diagnose-and-enforce.md`: Observe → baseline → map trust boundary → form hypothesis → integrate gate → replay fixtures → independent verification.

## Metrics
Track high-impact provenance coverage, number of blocked/approved telemetry-derived actions, unauthorized side effects, false blocks on read-only investigation, and secret exposure count.

## Verification
Run:

`python -m unittest tests/test_provenance_action_gate.py`

Then verify the host places the hook immediately before the actual side-effecting executor; unit tests alone do not prove runtime coverage.

## Safety
- Never include raw secrets in action records or approvals.
- Never treat telemetry text as authorization.
- Never expand IAM, sandbox, network, or tool permissions to bypass a deny.
- Require independent review before expanding high-impact capability scope.

## Failure handling
**Detection:** invalid provenance, unknown source, mismatched/stale approval, unapproved high-impact capability, or host integration that bypasses the gate.

**Evidence:** gate output, action hash, source IDs, policy version, redacted host trace.

**Retry policy:** maximum two implementation/re-test cycles for the same failure. Each retry must use new evidence or a materially changed implementation.

**Fallback:** keep the workflow read-only or disable the high-impact integration.

**Escalation:** runtime owner/security approver.

**Stop condition:** stop after two failed remediation cycles or immediately if the true side-effect boundary cannot be intercepted.

## Definition of Done
### Implemented
Provenance fields and pre-action gate are wired at the real executor boundary.

### Measured
Baseline and post-change coverage/decision metrics are captured; adversarial and benign fixtures are executed.

### Verified
High-impact actions derived from poisoned telemetry cannot execute without valid authorization; read-only investigation remains usable according to policy; tests pass; no secrets are exposed; an independent reviewer finds no blocking bypass.

## Customization
Add source classes and capabilities conservatively. Organizations may replace the example approval object with signed receipts or their existing approval service, provided authorization remains bound to the exact action/resource/environment and expires.
