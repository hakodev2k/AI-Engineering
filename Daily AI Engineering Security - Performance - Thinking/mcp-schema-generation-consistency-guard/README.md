# MCP Schema Generation Consistency Guard

**Category:** Security

## Problem
Dynamic MCP tool catalogs can refresh while calls are in flight. Recent TypeScript SDK issues show two distinct failure modes: an old call validated against a newer schema generation, and failed catalog compilation corrupting shared validator metadata so later calls may lose output validation.

## Evidence
See `evidence/research.md` for current public evidence and sources.

## Existing approach
MCP clients discover tools, cache metadata, compile JSON Schema validators, refresh lists, and validate structured tool output.

## Existing limitations
Mutable shared caches can create generation races; eager clearing can destroy the last known-good state; a post-await validator lookup can observe a schema different from dispatch time.

## Proposed improvement
Treat each complete catalog and all derived validators as an immutable generation. Build candidates off-path, publish only after complete validation, pin generation at call dispatch, and validate the response using that pinned generation.

## Architecture
```text
fetch candidate catalog
  -> canonical manifest/hash
  -> compile every schema in isolated registry
  -> failure: discard candidate, preserve active
  -> success: atomic publish generation N+1

call dispatch
  -> capture generation N + validator
  -> execute/await tool
  -> validate with captured validator
  -> audit outcome
```

## Actual package tree
```text
mcp-schema-generation-consistency-guard/
├── README.md
├── evidence/research.md
├── skills/guard-schema-generations.md
├── rules/schema-generation-rules.md
├── subagents/schema-verifier.md
├── workflows/refresh-and-call-safely.md
├── hooks/pre-publish-generation.md
├── scripts/schema_generation_guard.py
└── tests/test_schema_generation_guard.py
```

## Installation
Requires Python 3.10+ for the deterministic manifest utility. The host must still use its real JSON Schema compiler/validator.

## Configuration
Integrate the manifest generation with the host's catalog refresh path. Store only hashes/generation identifiers in telemetry unless full schemas are explicitly safe to log.

## Usage
Build a candidate manifest:
```bash
python scripts/schema_generation_guard.py build --catalog candidate-tools.json --output .agent-state/candidate-generation.json
```

Compare two manifests:
```bash
python scripts/schema_generation_guard.py compare --left old.json --right new.json
```

Run tests:
```bash
python -m unittest tests/test_schema_generation_guard.py
```

## Workflow
Follow `workflows/refresh-and-call-safely.md`. The utility proves catalog identity/shape; the host integration must additionally prove all schemas compile before publication and must retain the pinned validator until each in-flight call completes.

## Metrics
- partial generation publication: target 0;
- schema-bearing calls without validation: target 0;
- wrong-generation validations: target 0;
- refresh rollback count;
- concurrent refresh/call overlap count;
- schema compile and refresh latency.

## Verification
1. Unit tests pass.
2. Invalid/duplicate catalog fails before publication.
3. A failed validator compile leaves active generation unchanged.
4. A delayed call started on generation N completes after N+1 publication and is validated against N.
5. New calls after publication use N+1.
6. Independent verifier confirms no output-schema success path bypasses validation.

## Safety
This package strengthens validation boundaries and does not execute MCP tools. Do not weaken output validation to recover availability.

## Failure handling
Transport refresh may retry once. Invalid schema compilation must not retry without changed input. Preserve last known-good generation and escalate repeated publisher defects.

## Definition of Done
Evidence documented; baseline collected; generation publication is atomic; dispatch-time pinning implemented; race/rollback tests pass; metrics exist; skipped validation is zero; independent verification passes.

## Customization
Extend manifests with task-support metadata, protocol revision, server identity, cache scope, or signature/provenance fields when those affect call semantics.
