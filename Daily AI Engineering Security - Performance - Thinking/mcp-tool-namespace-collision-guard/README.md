# MCP Tool Namespace Collision Guard

Category: **Security**

## Problem
Multi-server MCP clients can receive identical or normalization-colliding tool names. Current implementations may reject the whole toolset, silently skip a tool, or overwrite/shadow one registration. That makes tool identity ambiguous and can route an agent to an unintended provider.

## Evidence
See `evidence/research.md`. Current 2026 signals include MCP specification review issue #3180, Hermes Agent #72032, DeepAgents #4666, and OpenClaw #54886.

## Existing approach and limitation
Frameworks typically rely on globally unique names, registration order, ad-hoc prefixes, or name sanitization. These fail when prefixes themselves collide, sanitization is lossy, or the client cannot rename third-party tools.

## Proposed improvement
Build a deterministic namespace registry from `(server identity, raw tool name, schema digest)`, detect raw and normalized collisions before model exposure, assign stable aliases, and block ambiguous or drifting mappings. Never silently replace a tool.

## Package tree
- `evidence/research.md` — evidence, root causes, existing approaches.
- `skills/namespace-audit.md` — audit procedure.
- `rules/namespace-integrity.md` — enforceable rules.
- `workflows/register-and-verify.md` — bounded registration workflow.
- `hooks/pre-exposure-check.md` — deterministic hook contract.
- `scripts/mcp_namespace_guard.py` — dependency-free registry validator.
- `config/policy.json` — safe defaults.

## Installation
Python 3.10+ only. No third-party packages.

## Usage
Prepare a JSON manifest with `servers[].id` and `servers[].tools[].name/schema`, then run:

`python scripts/mcp_namespace_guard.py manifest.json --policy config/policy.json`

Exit `0` means safe deterministic aliases were produced; exit `3` means collision/drift blocks exposure; exit `2` means invalid input.

## Metrics
Track collision count, normalized-collision count, alias churn, unresolved ambiguity, and unexpected provider changes. Target: zero silent replacement, zero unstable alias mappings for unchanged manifests.

## Verification
Use fixtures covering raw duplicates, sanitized collisions (`read-file` vs `read_file`), server-ID collisions, stable repeat runs, and schema drift. A high-impact tool alias must resolve to exactly one server/tool/schema triple.

## Safety
This guard does not grant permissions. Existing authentication, authorization, approval, input validation, and human confirmation remain required.

## Failure handling
Detection is deterministic. Retry only after the manifest changes or a registry/config race is resolved; maximum 2 registration rebuilds. Ambiguity remains blocking after retries.

## Definition of Done
Implemented: guard and policy exist. Measured: fixtures report expected collisions and stable aliases. Verified: no ambiguous alias reaches model exposure and no unrelated tool is discarded.