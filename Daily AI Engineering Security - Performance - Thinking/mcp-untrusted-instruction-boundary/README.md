# MCP Untrusted Instruction Boundary

## Topic
MCP Untrusted Instruction Boundary

## Category
Security

## Problem
Remote MCP metadata can contain natural-language instructions or tool descriptions that influence an LLM before tool invocation. Treating those fields as trusted prompt material lets a malicious or compromised server steer tool selection, request secrets, or exploit ambiguous tool identity.

## Evidence
See `evidence/research.md` for current public evidence from MCP issue #3213, MCP security discussion #2457, WeKnora GHSA-67q9-58vj-32qx, and the 2026-07-28 MCP authorization specification.

## Existing approach
Clients commonly use prompt delimiters, injection classifiers, server allowlists, OAuth scopes, and tool namespacing.

## Existing limitations
These controls are useful but incomplete: prose remains semantically executable to the model, classifiers are probabilistic, metadata can change after initial trust, and OAuth does not prevent harmful selection of an already-authorized tool.

## Proposed improvement
Add a deterministic provenance and capability gate before remote metadata becomes model-visible or executable. Canonicalize and fingerprint descriptors, label remote prose untrusted, detect collisions and suspicious imperatives, and keep permission/approval decisions outside the model.

## Architecture
```text
MCP discovery
  -> raw metadata capture
  -> scripts/mcp_metadata_gate.py
  -> provenance + fingerprints + capability classification
  -> security review
  -> allow | quarantine | block
  -> model-visible normalized metadata / enabled tools
```

## Package tree
```text
README.md
evidence/research.md
skills/assess-mcp-metadata-trust.md
rules/mcp-trust-boundary.md
subagents/mcp-security-reviewer.md
workflows/discover-assess-activate.md
hooks/pre-activation-metadata-gate.md
scripts/mcp_metadata_gate.py
config/policy.json
```

## Installation
Requires Python 3.10+; script uses only the standard library.

## Configuration
Edit `config/policy.json` to set metadata limits and high-impact capability classes. Never put secrets in configuration.

## Usage
Prepare a redacted `metadata.json` with `server_id`, `instructions`, and `tools`; each tool may include `name`, `description`, `input_schema`, `capabilities`, and `human_approved`.

Run:
`python3 scripts/mcp_metadata_gate.py metadata.json --policy config/policy.json --strict`

Exit 0 permits activation. Exit 3 means quarantine/block. Exit 2 means invalid input/configuration.

## Workflow
Follow `workflows/discover-assess-activate.md`. The implementing component is not the only verifier; `subagents/mcp-security-reviewer.md` performs independent review.

## Metrics
Metadata provenance coverage, changed-schema detection rate, malicious-fixture block rate, false-positive review rate, unauthorized scope expansion count, and secret leakage count.

## Verification
Implemented: gate, policy, hook, workflow, reviewer, and rules exist. Measured: run benign and malicious fixtures and capture decisions. Verified: all malicious fixtures quarantine, benign approved fixtures allow, collisions block, high-impact unapproved tools quarantine, and no credentials appear in output.

## Safety
Never forward access tokens across MCP servers. Never grant permission from remote prose. Dangerous or irreversible actions require explicit human approval immediately before invocation.

## Failure handling
Detection: nonzero gate result or reviewer finding. Evidence: preserve redacted metadata hash and findings. Retry: at most two transient discovery retries; validation is retried only after input/policy changes. Fallback: keep capability disabled. Escalation: human security review. Stop: unresolved identity, collision, approval, or validation failure.

## Definition of Done
- Evidence documented.
- Metadata provenance and fingerprints generated.
- Tool identity collision checks pass.
- High-impact capability policy enforced.
- Malicious fixtures blocked/quarantined.
- Benign approved fixtures pass.
- Independent review complete.
- No secrets exposed.
- No blocking issue remains.

## Customization
Extend suspicious-pattern detection only as supplemental evidence; do not replace deterministic capability and approval controls with regex or model classification alone.
