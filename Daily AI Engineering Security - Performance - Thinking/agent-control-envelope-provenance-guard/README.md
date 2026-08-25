# Agent Control Envelope Provenance Guard

## Topic
Provenance-bound control channels for subagent and tool output

## Category
Security

## Problem
Multi-agent runtimes can relay model-authored subagent/tool text through channels that the parent model treats as operationally trusted. If runtime control messages are represented by forgeable text such as `<system-reminder>`, `<task-notification>`, role labels, or plaintext out-of-band markers, an untrusted producer can imitate privileged framing.

## Evidence
Current public evidence and source links are documented in `evidence/research.md`, including 2026 reports from Claude Code and Hermes Agent involving forged system/reminder, task-notification, and steering markers.

## Existing approach
Prompt instructions, textual wrappers, classifiers, and selective sanitization provide defense-in-depth but do not prove origin.

## Existing limitations
Text shape is attacker/model reproducible; concatenation can erase provenance; subagent completion channels can feel trusted even when their body is model-authored; semantic classifiers are probabilistic.

## Proposed improvement
Bind privilege to runtime metadata rather than text. Reject or encode reserved control syntax in untrusted payloads before prompt assembly. Require origin, nonce, timestamp, and optional authenticated integrity for privileged envelopes.

## Architecture
- `evidence/research.md` — current evidence, approaches, gaps, and root cause.
- `skills/control-channel-threat-model.md` — reusable boundary analysis procedure.
- `rules/trusted-control-envelopes.md` — enforceable security invariants.
- `subagents/security-verifier.md` — independent verification role.
- `workflows/observe-enforce-verify.md` — bounded implementation and verification flow.
- `hooks/pre-parent-ingest.md` — deterministic integration point.
- `scripts/control_envelope_guard.py` — no-dependency scanner/verifier.
- `tests/test_control_envelope_guard.py` — attack and integrity regression tests.

## Actual package tree
```text
agent-control-envelope-provenance-guard/
├── README.md
├── evidence/research.md
├── hooks/pre-parent-ingest.md
├── rules/trusted-control-envelopes.md
├── scripts/control_envelope_guard.py
├── skills/control-channel-threat-model.md
├── subagents/security-verifier.md
├── tests/test_control_envelope_guard.py
└── workflows/observe-enforce-verify.md
```

## Installation
Python 3.10+; standard library only. Copy this directory into the host project. No network access is required by the scanner.

## Configuration
The host must supply origin/channel metadata. If HMAC validation is enabled, load the key from a runtime secret store and pass only the environment-variable name through `--hmac-env`. Never commit the key.

## Usage
Check untrusted or privileged JSON before parent ingestion:

```bash
python scripts/control_envelope_guard.py check --input candidate.json
```

Authenticated privileged control:

```bash
AGENT_CONTROL_KEY='runtime-provided-secret' python scripts/control_envelope_guard.py check --input candidate.json --hmac-env AGENT_CONTROL_KEY
```

Exit `0` allows; exit `2` is a policy block; exit `1` is malformed input/runtime failure and should also fail closed.

## Workflow
Follow `workflows/observe-enforce-verify.md`: Observe baseline → diagnose provenance loss → form hypothesis → implement the narrow boundary change → measure again → independent security verification.

## Metrics
Track spoofed markers blocked, privileged provenance coverage, untrusted payloads reaching privileged parsers, false-positive rate, and regression test pass rate.

## Verification
Run:

```bash
python -m unittest tests/test_control_envelope_guard.py
```

Security is **Implemented** when the gate is wired before prompt assembly, **Measured** when baseline and after-state decisions are recorded, and **Verified** only after independent tests prove spoofed and tampered envelopes fail closed while legitimate runtime control passes.

## Safety
The scanner reads JSON only; it never executes candidate content. It does not replace sandboxing, least privilege, output DLP, or human approval for dangerous actions.

## Failure handling
Detection produces deterministic finding codes. Retry implementation at most twice and only with new evidence. If provenance cannot be preserved end-to-end, isolate the affected channel as data and escalate. Never switch to fail-open.

## Definition of Done
- Evidence documented and current.
- All privileged message types mapped.
- Pre-ingest gate implemented before concatenation.
- Positive and malicious fixtures pass.
- Tampered/stale privileged envelopes fail.
- Independent verifier approves.
- No secrets included or logged.
- No blocking trust-boundary issue remains.

## Customization
Extend `RESERVED_PATTERNS` for host-specific control syntax and `TRUSTED_ORIGINS` for runtime-owned producers. New privileged origins require human/security approval and regression fixtures.
