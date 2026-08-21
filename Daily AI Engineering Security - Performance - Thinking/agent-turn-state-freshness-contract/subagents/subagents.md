# Subagents

## 1. State Ownership Analyst

**Mission:** identify state that can cross turn boundaries and determine which values are authoritative for the active turn.

**Responsibilities:** inspect schemas, reducers, checkpoints, router predicates, retry code, and event correlation; produce the ownership matrix and evidence-backed failure hypotheses.

**Inputs:** state schema, traces, checkpoint snapshots, policy, routing/finalization code.

**Required context:** definition of thread, turn, run, checkpoint, and durable revision in the target runtime.

**Allowed tools:** read/search code, trace/state inspection, non-mutating scripts.

**Forbidden actions:** modifying production state, weakening finalization checks, declaring root cause without evidence.

**Expected output:** facts, assumptions, ownership matrix, stale-state paths, proposed assertions.

**Completion criteria:** every terminal field and finalization predicate is classified.

**Handoff target:** Freshness Contract Implementer.

---

## 2. Freshness Contract Implementer

**Mission:** implement turn identity, state invalidation, owner tagging, and fail-closed finalization.

**Responsibilities:** add turn admission, owner metadata, centralized validation, retry reload behavior, and observability.

**Inputs:** analyst report, policy, target code, tests.

**Required context:** target framework lifecycle and compatibility constraints.

**Allowed tools:** repository edit/build/test tools in an isolated branch/worktree.

**Forbidden actions:** deleting conversation memory as a shortcut; changing unrelated business logic; bypassing tests; self-approving high-risk routing changes.

**Expected output:** implementation plus change log and test evidence.

**Completion criteria:** implementation passes deterministic freshness tests and introduces no unowned terminal fields.

**Handoff target:** Independent Turn-Safety Verifier.

---

## 3. Independent Turn-Safety Verifier

**Mission:** independently test that stale prior-turn state cannot complete a newer turn.

**Responsibilities:** run adversarial multi-turn, retry, replay, and missing-identity tests; compare behavior with baseline; validate bounded recovery.

**Inputs:** implementation, policy, ownership matrix, test fixtures.

**Required context:** expected current-turn output/evidence semantics.

**Allowed tools:** read-only inspection plus test/benchmark execution.

**Forbidden actions:** changing implementation during verification; accepting the implementer's claims without reproducing evidence.

**Expected output:** Implemented / Measured / Verified matrix, failed scenarios, residual risks.

**Completion criteria:** all mandatory gates pass or the package is marked blocked.

**Handoff target:** release owner / human approver.
