# Protocol Discovery Metadata Injection Gate

**Category:** Security  
**Run date:** 2026-08-31 (UTC+7)

## Problem
Modern agent protocols expose natural-language discovery metadata such as MCP `instructions` and A2A AgentCard descriptions/skills. That metadata is controlled by a remote server yet is commonly inserted into an LLM prompt to help tool/agent selection. This creates a control/data boundary violation: discovery data can become instructions with the authority of trusted orchestration context.

## Evidence
See `evidence/research.md`. Current signals include MCP issue #3213 (2026-08-07), A2A samples issue #687 (2026-08-09), the MCP 2026-07-28 discovery specification defining server-controlled `instructions`, and current OWASP Agentic AI guidance to treat external/tool-originated content as untrusted.

## Existing approach
Protocol clients authenticate transports or registry identities, then often render discovered metadata directly into prompts. Prompt wording, regex sanitization, or model-side refusal may reduce obvious attacks, but do not provide deterministic provenance or action authorization.

## Proposed improvement
Create a deterministic ingress gate between protocol discovery and model context:

1. classify every discovery field by provenance and trust;
2. normalize and size-limit metadata;
3. score instruction-like and secret-exfiltration patterns;
4. convert untrusted descriptions to quoted data, never system authority;
5. bind allowed tools/actions to an explicit policy independent of metadata;
6. require human approval for high-impact actions influenced by remote metadata;
7. log the source-to-action chain for verification.

## Package tree
```text
README.md
evidence/research.md
config/policy.example.json
skills/discovery-metadata-threat-audit.md
rules/untrusted-discovery-metadata.md
subagents/security-reviewer.md
workflows/observe-gate-verify.md
hooks/pre-ingest-discovery-metadata.md
scripts/discovery_metadata_guard.py
tests/test_discovery_metadata_guard.py
```

## Installation
Python 3.10+. No third-party dependencies.

## Configuration
Copy `config/policy.example.json`. Configure maximum metadata length, allowed discovery fields, risky phrases, and action classes that require approval.

## Usage
```bash
python scripts/discovery_metadata_guard.py discovery.json --policy config/policy.example.json --out guarded.json
python -m unittest tests/test_discovery_metadata_guard.py
```

Input may contain MCP-style `instructions`, `serverInfo`, tool descriptions, or A2A-style `description` and `skills`. The guard emits a normalized envelope with provenance, risk findings, and a `trusted_as_instruction=false` invariant for remote metadata.

## Workflow
Follow `workflows/observe-gate-verify.md`: Observe → establish trust boundary → reproduce malicious metadata → gate → rerun attack cases → verify legitimate discovery still functions.

## Metrics
- malicious metadata cases blocked from instruction authority;
- unauthorized high-impact actions triggered: target 0;
- legitimate discovery records preserved;
- false-positive rate on benign metadata;
- metadata bytes admitted vs rejected;
- source-to-action audit coverage: target 100% for governed actions.

## Verification
**Implemented:** deterministic metadata envelope, risk detection, policy gate.  
**Measured:** benign and adversarial fixtures produce explicit outcomes.  
**Verified:** malicious discovery text cannot elevate itself to trusted instructions or expand the action allowlist; tests pass; a reviewer distinct from the implementer signs off.

## Safety
The package does not weaken authentication, TLS, sandboxing, tool permissions, or human approval. Sanitization is defense-in-depth, not an authorization mechanism. Remote metadata MUST NOT change permissions.

## Failure handling
Malformed input, unknown provenance, policy parse failure, or suspicious metadata defaults to quarantine. Retry only after correcting deterministic input/config errors, maximum 2 attempts. High-impact action requests with unresolved provenance stop and require explicit human approval.

## Definition of Done
Evidence documented; trust boundaries mapped; malicious fixtures reproduced; ingress gate implemented; action policy independent from metadata; tests pass; no secrets logged; no permission expansion; audit records produced; independent verification complete; no blocking findings remain.
