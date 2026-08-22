# Skill — Guard MCP Schema Generations

## Purpose
Prevent tool calls from observing partially refreshed MCP metadata or validating responses against a schema generation different from the one active at dispatch.

## Trigger
Use when an MCP client supports dynamic `tools/list` refresh, `tools/list_changed`, cache refresh, hot reload, or multiple concurrent calls.

## Inputs
Current catalog, candidate catalog, compiled validators, active generation id, call metadata, refresh result.

## Preconditions
Tool identities are stable within a generation and schema compilation errors are observable.

## Allowed tools
Read tool catalogs, compile/validate JSON Schema, persist/hash metadata, emit metrics. No tool execution is required by this skill.

## Constraints
- Never publish a candidate generation until every required validator compiles.
- Never clear the active generation before a replacement is ready.
- Never validate an in-flight result against an unpinned later generation.
- Preserve the last known-good generation on refresh failure.

## Procedure
1. Canonicalize candidate tool metadata and compute a generation digest.
2. Compile all output validators into an isolated candidate registry.
3. If any compile fails, reject the candidate and keep the active registry unchanged.
4. Publish the complete registry with one generation id/digest.
5. At tool-call dispatch, capture tool name, generation id, and validator digest.
6. Await the call without rereading the mutable active registry.
7. Validate returned structured content with the captured validator.
8. Record generation, refresh status, validation status, and mismatch diagnostics.

## Decision points
- Candidate compilation failure → rollback/no publication.
- Tool absent from pinned generation → reject dispatch.
- Result lacks required structured content → validation failure.
- Generation changed while call was in flight → acceptable if pinned validator remains available; record overlap metric.

## Expected output
A generation-bound call record and deterministic allow/reject result.

## Metrics
Generation coverage, refresh rollback count, overlapping-generation calls, validation failures, skipped validations.

## Verification
Run race tests where a catalog refresh occurs between dispatch and response, plus failed-refresh tests proving the previous registry remains byte-for-byte equivalent.

## Failure handling
Retry a transient catalog fetch once. Do not retry a schema compile failure without changed input. Escalate repeated invalid catalogs.

## Stop conditions
Stop when the candidate is published safely, rejected with the previous generation preserved, or deterministic validation fails.
