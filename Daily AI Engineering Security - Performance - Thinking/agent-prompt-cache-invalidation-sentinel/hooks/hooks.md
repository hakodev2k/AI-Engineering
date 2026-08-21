# Hooks

## Hook 1 — Pre-session baseline validation

**Trigger:** before enabling cache-thrash blocking for a client/model/workflow combination.

**Action:** verify policy exists, is valid JSON, and baseline data has at least one warm-cache request above configured thresholds.

**Command:**
`python scripts/cache_sentinel.py examples/healthy-events.jsonl --policy config/policy.json`

**Expected result:** exit 0 and `status=ok`.

**Failure behavior:** keep sentinel observe-only; do not enable blocking.

---

## Hook 2 — Post-session cache-health check

**Trigger:** after a long-running agent session or after exporting request-level usage JSONL.

**Action:** analyze cache reuse and produce a machine-readable report.

**Command:**
`python scripts/cache_sentinel.py session-usage.jsonl --policy config/policy.json --output cache-report.json`

**Expected result:** report contains event counts, read/write totals, collapse events, and incident count.

**Failure behavior:** preserve raw metadata, mark analysis failed, and do not infer cache health from aggregate billing alone.

---

## Hook 3 — Release/regression gate

**Trigger:** before rolling out changes to hooks, history serialization, client invocation, resume logic, or cache-control configuration.

**Action:** run labeled healthy and pathological fixtures plus unit tests.

**Command:**
`python -m unittest tests/test_cache_sentinel.py`

**Expected result:** all tests pass; healthy fixture has no incident; pathological fixture detects repeated collapse.

**Failure behavior:** reject rollout until detector semantics or fixture expectation is resolved.

---

## Hook 4 — Incident escalation gate

**Trigger:** sentinel reports repeated collapse and estimated rewrite volume exceeds the team's accepted budget.

**Action:** stop automatic large-context reproductions and require a triage record before the next expensive attempt.

**Command/script:** use `cache-report.json`; no destructive command is run.

**Expected result:** first collapse request, preceding warm request, and available version/miss-reason metadata are recorded.

**Failure behavior:** start a fresh checkpointed session only when continuity can be preserved safely; otherwise escalate to a human/platform owner.
