# MCP Tool Outcome Contract Verifier

**Category:** Thinking  
**Run date:** 2026-09-05 (UTC+7)

## Problem
Agents make decisions from observable tool-result status. Current MCP integrations have shipped failures where a denied or failed tool call is represented as success, or an `isError:true` MCP result is remapped to `completed`. The model can then continue from a false fact: "the action succeeded."

## Evidence
See `evidence/research.md`.

## Existing approach
MCP defines `isError` for tool-level failures; clients and adapters map protocol results into internal states; applications may verify side effects with read-after-write checks.

## Existing limitations
Error semantics cross several layers (tool implementation, middleware, MCP SDK, transport adapter, agent runtime, UI). A single catch-and-return or status mapping can silently invert meaning. Parsing error text is brittle, while read-after-write verification on every call is expensive and not always possible.

## Proposed improvement
Treat tool outcome as a testable contract. Normalize transport/protocol/runtime statuses into `success|failure|unknown`, reject contradictory states, require side-effect evidence for consequential writes, and run conformance fixtures against adapters before release.

## Architecture
- `skills/tool-outcome-investigation.md`
- `rules/outcome-integrity.md`
- `subagents/outcome-verifier.md`
- `workflows/diagnose-remediate-verify.md`
- `hooks/post-tool-contract.md`
- `scripts/verify_tool_outcome.py`
- `schemas/tool-event.schema.json`
- `examples/events.jsonl`
- `tests/test_verify_tool_outcome.py`
- `evidence/research.md`

## Installation
Python 3.10+, standard library only.

## Usage
`python scripts/verify_tool_outcome.py examples/events.jsonl`

Exit 0 = no contract violation; 4 = contradictory/unsafe outcome detected; 1 = malformed evidence.

## Workflow
Capture real tool events -> establish baseline misclassification rate -> map layer-by-layer status semantics -> form hypothesis -> fix mapping/middleware -> replay fixtures -> run side-effect verification for consequential writes -> independent review.

## Metrics
Contradictory outcomes per 1,000 calls; failed calls labelled success; unknown outcomes; consequential writes lacking verification; false completion reports; recovery/rework rate.

## Verification
**Implemented:** normalizer, rules, fixtures and bounded workflow.  
**Measured:** adapter traces are classified consistently.  
**Verified:** failure fixtures block; valid successes pass; consequential success requires explicit verification evidence; independent reviewer confirms no unsupported completion conclusion.

## Safety
This package never requests hidden reasoning. It uses only observable statuses, outputs and verification evidence. A permission denial must never be converted into success merely to keep an agent progressing.

## Failure handling
Malformed or contradictory outcome evidence becomes `unknown`/blocking. Retry collection once; then stop the affected workflow and escalate instead of guessing.

## Definition of Done
Current evidence documented; baseline captured; layer mapping explicit; conformance fixtures pass; consequential actions have verification evidence; no contradictory outcomes remain; independent verification complete.
