# Hooks

## Hook 1 — Pre-model Catalog Validation

**Trigger:** immediately before building the model-visible tool list.

**Action:** validate catalog shape, unique names, required input-schema object, essential designations, and policy syntax.

**Command:**
`python scripts/schema_profiler.py catalog.json --policy config/tool-budget-policy.json --fail-on-budget`

**Expected result:** catalog is structurally valid; profiler produces deterministic metrics. If the full catalog exceeds budget, routing must run before model invocation.

**Failure behavior:** block eager exposure; do not pass an invalid catalog to the model.

---

## Hook 2 — Pre-model Tool Routing

**Trigger:** after task text is available and before model invocation.

**Action:** select a bounded full-schema subset using routing metadata and policy.

**Command:**
`python scripts/tool_router.py --catalog catalog.json --task-file task.txt --policy config/tool-budget-policy.json --output selected-tools.json --report routing-report.json`

**Expected result:** selected catalog is within count/token budget, includes all essential tools, and preserves original selected definitions.

**Failure behavior:** if routing cannot produce a safe bounded set, stop. Never automatically expose all tools.

---

## Hook 3 — Deferred Discovery Failure

**Trigger:** explicit tool-search error, unavailable discovery capability, timeout, or unexpected empty discovery result.

**Action:** invoke the router with `--fallback`.

**Command:**
`python scripts/tool_router.py --catalog catalog.json --task-file task.txt --policy config/tool-budget-policy.json --output selected-tools.json --report routing-report.json --fallback`

**Expected result:** essential tools plus a bounded number of smallest fallback tools fit budget.

**Failure behavior:** hard stop if essential tools alone exceed budget.

---

## Hook 4 — Catalog Change CI Gate

**Trigger:** tool catalog, tool description, schema, or routing metadata changes.

**Action:** profile the catalog and run regression tests.

**Commands:**
- `python scripts/schema_profiler.py examples/tool-catalog.sample.json --policy config/tool-budget-policy.json`
- `python -m unittest tests/test_tool_budget.py`

**Expected result:** catalog parses; tests confirm deterministic routing, budget enforcement, essential reachability, and schema preservation.

**Failure behavior:** block merge/release until fixed.

---

## Hook 5 — Post-run Metrics

**Trigger:** after tool selection and after task completion.

**Action:** emit aggregate metrics only: original/selected tool count, original/selected estimated tokens, reduction ratio, fallback flag/reason, expected-tool hit when fixture/eval labels exist, and tool-call success.

**Expected result:** telemetry supports trend/regression detection without storing tool arguments or secrets.

**Failure behavior:** telemetry failure must not expand tool permissions or tool count; record local diagnostic if safe.

---

## Hook 6 — Final Verification

**Trigger:** before enabling a new routing policy in production.

**Action:** compare measured metrics against `regression` thresholds in policy.

**Expected result:** token reduction >= configured minimum, selection recall/call success >= minimums, fallback rate <= maximum, and no schema-preservation violation.

**Failure behavior:** keep previous verified policy; require explicit owner review for threshold changes.
