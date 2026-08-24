# A2A AgentCard Prompt-Injection Trust Boundary

**Category:** Security

## Problem
A2A clients may discover remote AgentCards and render remote-controlled `description` or `skills` text into an LLM prompt. That metadata is descriptive protocol data, not trusted instructions. If the host does not preserve this boundary, a malicious or compromised A2A server can steer the coordinator before any tool call occurs.

## Evidence
Current public evidence is documented in `evidence/research.md`. The key August 2026 signal is a reproducible A2A sample issue showing AgentCard metadata rendered directly into a coordinator prompt. Related A2A work on AgentCard signature verification shows that provenance and trust-root handling are active protocol concerns, but signatures alone do not make descriptive text safe to execute as instructions.

## Existing approach and limitation
Common mitigations are generic prompt sanitization, escaping, server allowlists, or signed AgentCards. These help, but they do not enforce the semantic invariant that remote metadata remains data. String filtering is bypass-prone, and a valid signature proves origin rather than instructional authority.

## Proposed improvement
Treat discovered AgentCard text as typed untrusted data. Before any model rendering, validate structure, label provenance, reject instruction-like control language under strict policy, and pass metadata through a separate data channel or a quoted/structured representation. Never concatenate remote metadata into system/developer instructions.

## Package tree
- `evidence/research.md` — current evidence, existing solutions, gap, roots, metrics.
- `skills/agentcard-trust-analysis.md` — repeatable analysis procedure.
- `rules/agentcard-trust-rules.md` — enforceable trust-boundary rules.
- `subagents/agentcard-security-reviewer.md` — independent reviewer contract.
- `workflows/discover-validate-dispatch.md` — bounded end-to-end workflow.
- `hooks/pre-agentcard-render.md` — deterministic pre-render gate.
- `scripts/scan_agentcard.py` — dependency-free scanner.
- `tests/test_scan_agentcard.py` — executable regression tests.
- `schemas/policy.schema.json` — policy configuration schema.
- `config/policy.json` — secure default policy.

## Installation
Python 3.10+ is sufficient. No third-party packages are required.

## Usage
```bash
python scripts/scan_agentcard.py path/to/agent-card.json --policy config/policy.json
python -m unittest tests/test_scan_agentcard.py
```

Exit codes: `0` allow, `2` blocked by policy, `64` invalid invocation/input.

## Workflow
Observe discovered card → validate JSON/shape → classify remote text → apply policy → block or produce normalized data-only representation → independent review for policy changes → dispatch only after pass.

## Metrics
Track blocked cards, instruction-like findings per card, false-positive rate, percentage of dispatches gated, policy overrides, and successful malicious-fixture blocks.

## Safety
The scanner never executes card content, follows URLs, imports remote code, or weakens authentication. Approval of a server does not imply approval of its free-form metadata as instructions.

## Failure handling
Parse/schema failures block dispatch. Policy ambiguity blocks under strict mode. A reviewer may approve a policy exception only by changing explicit configuration and adding a regression fixture; the runtime must not silently downgrade.

## Definition of Done
Implemented: all package files exist and references resolve. Measured: malicious and benign fixtures run through the scanner. Verified: injection fixtures block, benign data-only cards pass, malformed cards fail closed, and no test requires executing remote content.

## Customization
Organizations may extend `instruction_patterns`, field length limits, and required provenance labels in `config/policy.json`; maintain the invariant that remote text is never elevated into a privileged instruction channel.