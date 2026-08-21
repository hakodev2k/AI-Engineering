# Subagents

## Research Agent

**Mission:** confirm current evidence that tool-schema overhead and lazy/deferred discovery are real engineering concerns.

**Responsibilities:** collect primary/public sources, record dates/status, separate measurements from interpretation.

**Inputs:** category constraints, recent topic history.

**Required context:** MCP specification, relevant Codex/Claude Code/MCP issues.

**Allowed tools:** public web/GitHub read-only research.

**Forbidden actions:** inventing measurements, claiming vendor endorsement of this package, modifying production systems.

**Expected output:** evidence summary with source URLs and observed limitations.

**Completion criteria:** at least two meaningful independent signals and one current official/spec source.

**Handoff target:** Performance/Token Investigator.

---

## Token Investigator

**Mission:** establish the schema-token baseline and identify dominant contributors.

**Responsibilities:** run deterministic profiling, classify fixed vs selected schema cost, identify largest schemas and catalog churn.

**Inputs:** tool catalog, policy, provider token-count calibration when available.

**Allowed tools:** `schema_profiler.py`, token-count APIs in read-only counting mode.

**Forbidden actions:** changing schemas before baseline, substituting guessed provider limits as facts.

**Expected output:** baseline report and optimization hypotheses.

**Completion criteria:** every catalog tool accounted for; total/individual costs and budget utilization recorded.

**Handoff target:** Routing Designer.

---

## Routing Designer

**Mission:** construct a deterministic candidate-selection policy that reduces full-schema exposure without making essential tools unreachable.

**Responsibilities:** define tags/keywords, essential set, budget, fallback, and representative fixtures.

**Inputs:** baseline, task classes, catalog metadata.

**Allowed tools:** policy/config editor, `tool_router.py`.

**Forbidden actions:** changing authorization policy, silently expanding budgets, deleting schema constraints.

**Expected output:** policy and routing metadata.

**Completion criteria:** every essential tool has a tested direct/fallback path; selection remains bounded.

**Handoff target:** Implementation Agent.

---

## Implementation Agent

**Mission:** integrate profiler/router/hooks into the host or MCP client boundary.

**Responsibilities:** preserve original schemas, wire selection before model invocation, emit metrics and reason codes.

**Inputs:** approved policy, catalog adapter, hooks.

**Allowed tools:** repository edits, local tests, non-destructive integration environments.

**Forbidden actions:** production deployment without verification; arbitrary schema truncation; secret logging.

**Expected output:** working integration and test evidence.

**Completion criteria:** routed catalog is model-visible only after validation and budget enforcement.

**Handoff target:** Verification Agent.

---

## Verification Agent

**Mission:** independently determine whether token reduction is real and correctness is preserved.

**Responsibilities:** run tests/fixtures, calculate recall/reduction/call-success/fallback metrics, inspect essential reachability.

**Inputs:** baseline, routed outputs, benchmark fixtures, policy thresholds.

**Allowed tools:** test runner, profiler/router, non-destructive MCP calls.

**Forbidden actions:** changing implementation to make tests pass; weakening thresholds without explicit review.

**Expected output:** pass/fail verification report distinguishing Implemented, Measured, and Verified.

**Completion criteria:** all required thresholds are evaluated with evidence.

**Handoff target:** human/platform owner for rollout decision.
