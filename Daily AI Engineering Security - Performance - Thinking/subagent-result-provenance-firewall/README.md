# Subagent Result Provenance Firewall

**Category:** Security

## Problem
Parent agents often receive child-agent text through a tool-result channel and may treat that text as trusted evidence or instructions even when the child made zero tool calls, fabricated system-like markup, or returned instruction-poisoning-shaped content. Recent Claude Code reports show this can steer the parent toward credential access or unauthorized actions.

## Proposed improvement
Insert a deterministic provenance gate between subagent completion and parent consumption. The gate validates transcript evidence, distinguishes observation from assistant-authored claims, detects system/tool-notification impersonation, quarantines suspicious results, and requires independent verification before any high-impact action is derived from quarantined text.

## Architecture
- `evidence/research.md` — current evidence and root cause.
- `scripts/audit_subagent_result.py` — dependency-free JSON/JSONL provenance analyzer.
- `rules/provenance-boundary.md` — enforceable parent/child trust rules.
- `skills/verify-subagent-result.md` — reusable verification procedure.
- `subagents/result-verifier.md` — independent verifier contract.
- `workflows/quarantine-and-verify.md` — bounded execution flow.
- `hooks/pre-parent-consume.md` — deterministic hook contract.
- `tests/test_audit_subagent_result.py` — executable regression tests.

## Usage
`python scripts/audit_subagent_result.py transcript.jsonl --result result.txt`

Exit codes: `0` verified/low-risk, `2` quarantine required, `3` invalid input.

## Metrics
Quarantine rate, false-positive rate, high-impact actions blocked before verification, claims backed by tool evidence, system-markup impersonations detected, verification latency.

## Safety
The scanner never executes child-provided commands and never upgrades assistant-authored text into trusted evidence. Quarantined output is data only.

## Failure handling
Malformed traces fail closed. A verifier may retry evidence reconstruction twice; unresolved provenance stops high-impact execution and escalates to a human.

## Definition of Done
Observed evidence documented; malicious fixtures quarantined; evidence-backed benign fixture passes; no child text is executed; verifier is independent of the originating child; all paths in this README exist.
