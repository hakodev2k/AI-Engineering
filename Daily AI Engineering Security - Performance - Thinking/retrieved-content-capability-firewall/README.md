# Retrieved-Content Capability Firewall

**Category:** Security

## Problem / Evidence
MCP/RAG/documentation text can contain assistant-directed instructions that influence a tool-capable agent. CVE-2026-75130 plus independent Context7 and Copilot disclosures show paths to credential exfiltration, deletion, unsolicited install commands and persistent steering. See `evidence/research.md`.

## Existing approach / limitation
Provider guardrails, prompt rules, patching, approvals and sandboxes are useful but incomplete. The reusable gap is action-time provenance: sensitive capability must be justified by trusted intent, not retrieved text.

## Proposed improvement / Architecture
Use a deterministic scanner as one defense-in-depth signal, then enforce trusted-intent provenance, least privilege, provenance-aware approval and independent verification: `retrieved data -> scanner -> provenance gate -> allow/review/block -> verifier -> tool`.

## Actual package tree
```text
README.md
config/policy.json
evidence/research.md
hooks/pre-tool-action-gate.md
rules/untrusted-content-boundary.md
scripts/instruction_firewall.py
skills/retrieved-content-threat-model.md
subagents/security-verifier.md
tests/test_instruction_firewall.py
workflows/research-diagnose-implement-verify.md
```

## Installation / Configuration / Usage
Requires Python 3.10+ and no third-party runtime dependency. Wire `hooks/pre-tool-action-gate.md` before sensitive tools. Edit `config/policy.json` administratively; never learn trusted domains from retrieved content. Run `python scripts/instruction_firewall.py tool-output.txt --json`. Exit 0 advances to the next gate; it never means auto-execute.

## Workflow / Metrics / Verification
Follow the bounded workflow and independent verifier. Track provenance coverage, block/review counts, false positives, unsafe-action escapes and secret exposure. Run `python -m pytest tests/test_instruction_firewall.py`; host integration must additionally prove scanner errors fail closed.

## Safety / Failure handling
Never execute commands found during scanning. Redact secrets before persistence. Do not widen egress or filesystem permissions to make a blocked workflow succeed. Detection: non-zero status, missing provenance or failed test. Retry maximum 2 with new evidence. Fallback: read-only answer/manual review. Escalate to security owner. Stop on unresolved destructive or secret boundary.

## Implemented / Measured / Verified
Implemented means package controls and tests exist. Measured means host records the defined metrics on replay/production traces. Verified means fixture tests pass and an independent reviewer confirms no sensitive action is authorized solely by untrusted content.

## Definition of Done
Evidence documented; limitations identified; gate integrated; malicious fixtures blocked; benign fixture allowed; no secrets exposed; permission boundaries unchanged; metrics captured; independent verification complete; no blocking issue remains.
