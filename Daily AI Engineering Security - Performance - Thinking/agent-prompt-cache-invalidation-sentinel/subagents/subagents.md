# Subagents

## Cache Evidence Analyst

**Mission:** identify measurable cache-regression boundaries without guessing provider internals.

**Responsibility:** normalize usage evidence, find first collapse, separate observed facts from hypotheses, produce comparison tables.

**Inputs:** usage JSONL, sentinel report, baseline policy, version/model timeline.

**Required context:** session boundaries and known pauses/resumes.

**Allowed tools:** read-only transcript metadata, `scripts/cache_sentinel.py`, local JSON tooling.

**Forbidden actions:** modifying application code; reading prompt/source content unless explicitly required; declaring root cause from correlation alone.

**Expected output:** evidence record containing first warm→collapse transition, metrics, and candidate correlations.

**Completion criteria:** every claim maps to a counter/timestamp/version field or is labeled hypothesis.

**Handoff target:** Cache Mitigation Engineer.

---

## Cache Mitigation Engineer

**Mission:** implement the smallest change that removes verified cache thrash while preserving task correctness.

**Responsibility:** adjust hook serialization, volatile context placement, client invocation, TTL/configuration, or session lifecycle according to evidence.

**Inputs:** Evidence Analyst report, integration configuration, task correctness tests.

**Required context:** supported client/provider cache behavior and change rollback path.

**Allowed tools:** code/config editing, unit/integration tests, reduced cache fixtures.

**Forbidden actions:** deleting required safety/system instructions for cache efficiency; unlimited reproduction; self-approving final verification.

**Expected output:** candidate change plus before/after measurement plan.

**Completion criteria:** implementation is bounded, reversible, and has a deterministic verification command.

**Handoff target:** Independent Verification Agent.

---

## Independent Verification Agent

**Mission:** independently decide whether the mitigation reduced cache waste without degrading correctness.

**Responsibility:** run before/after sentinel analysis and task tests/evals; verify thresholds; reject unsupported improvement claims.

**Inputs:** baseline dataset, candidate dataset, policy, correctness tests.

**Required context:** acceptance thresholds and known variance.

**Allowed tools:** read-only code review, sentinel, tests/evals, benchmark metadata.

**Forbidden actions:** changing the implementation under verification; loosening thresholds to make the candidate pass.

**Expected output:** `VERIFIED`, `REJECTED`, or `INCONCLUSIVE` with metrics.

**Completion criteria:** decision includes cache-read-ratio delta, rewrite-token delta, collapse counts, and correctness status.

**Handoff target:** owner/human reviewer when rejected or inconclusive; workflow completion when verified.
