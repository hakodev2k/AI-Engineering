# Subagents

## Replay Investigator
**Mission:** establish whether duplicate executions are model-generated, runtime retries, checkpoint replay, queue redelivery, or provider ambiguity.
**Inputs:** traces, operation logs, checkpoint/run IDs, tool args hashes, timestamps.
**Allowed tools:** read-only logs, metrics, repository search.
**Forbidden actions:** production writes, retry-policy changes.
**Output:** evidence table correlating one logical operation to all attempts.
**Completion criteria:** duplicate path and uncertainty points are identified.
**Handoff:** Idempotency Designer.

## Idempotency Designer
**Mission:** define effect class and stable business-operation identity for each relevant tool.
**Inputs:** tool contracts, provider semantics, Replay Investigator output.
**Allowed tools:** docs, schemas, test fixtures.
**Forbidden actions:** inventing provider guarantees not documented.
**Output:** tool-effect registry, identity fields, reconciliation strategy.
**Completion criteria:** every write has an enforceable key and ambiguous-outcome policy.
**Handoff:** Guard Implementer.

## Guard Implementer
**Mission:** integrate reservation, stored-result reuse, bounded waiting, and reconciliation hooks.
**Inputs:** approved design, policy, storage interface.
**Allowed tools:** repository edit/build/test tools.
**Forbidden actions:** weakening tenant isolation or bypassing unknown-state handling.
**Output:** implementation and tests.
**Completion criteria:** local contract suite passes and metrics are emitted.
**Handoff:** Independent Verifier.

## Independent Verifier
**Mission:** prove the guard suppresses duplicate effects under concurrency, retries, crashes, and ambiguous provider outcomes.
**Inputs:** implementation, fixtures, baseline data.
**Allowed tools:** tests, fault injection, read-only metrics.
**Forbidden actions:** changing production logic merely to make tests pass without review.
**Output:** verification report with Implemented/Measured/Verified separation.
**Completion criteria:** no duplicate side effect in required matrix, or blocking failure documented.
**Handoff:** owner/release gate.
