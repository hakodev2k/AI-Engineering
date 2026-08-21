# Hooks

## Hook — pre-context-build baseline capture

**Trigger:** before enabling enforcement for a session/replay.

**Action:** serialize host-generated context events to the package JSONL schema without changing admission behavior.

**Command:**
`python scripts/context_injection_guard.py --policy config/policy.json --input examples/sample-events.jsonl --output /tmp/context-decisions.jsonl`

**Expected result:** deterministic decision stream is available for observe-only comparison; source identity and logical keys are populated.

**Failure behavior:** include all production context and fail the optimization run. Never drop unknown events because profiling failed.

---

## Hook — pre-injection admission gate

**Trigger:** immediately before a host-generated attachment/reminder/rule is added to model-visible context.

**Action:** map the event to `turn`, `source`, `logical_key`, `content`, optional `version`, and optional `always_include`; evaluate against the active ledger/policy.

**Command/script:** integrate the logic from `scripts/context_injection_guard.py` in-process or invoke the script for batch/replay environments.

**Expected result:** first/changed/required events are included; exact unchanged suppressible events inside the freshness window are suppressed.

**Failure behavior:** fail open for correctness: include the event, emit structured classification/guard failure metadata, and do not fabricate a suppress decision.

---

## Hook — post-context-build token measurement

**Trigger:** after the final model-input context is assembled but before request dispatch.

**Action:** measure total input tokens and host-generated token contribution. Prefer the provider's token-count API; use the estimator only when a real counter is unavailable.

**Command:**
`python scripts/context_metrics.py --events examples/sample-events.jsonl --decisions /tmp/context-decisions.jsonl --target-reduction 0.30`

**Expected result:** report includes baseline tokens, guarded tokens, suppressed tokens, duplicate ratio, target status, and required-context violations.

**Failure behavior:** mark the run Measured=false; do not claim improvement from byte counts alone when the production requirement mandates provider tokens.

---

## Hook — policy-change regression gate

**Trigger:** any change to `config/policy.json`, normalization, source classification, or logical-key mapping.

**Action:** run `tests/test_guard.py` and the representative long-session replay.

**Command:**
`python tests/test_guard.py`

**Expected result:** exit 0; required context retained, duplicate fixtures suppressed, changed versions included, unknown sources included, freshness behavior correct.

**Failure behavior:** reject the policy/config change. Maximum automated repair attempts: 2.

---

## Hook — final verification

**Trigger:** before enabling enforcement or declaring the package integrated.

**Action:** verify Implemented/Measured/Verified criteria from `verification/verification.md`.

**Expected result:** all mandatory criteria pass and evidence artifacts identify the exact policy version and replay dataset.

**Failure behavior:** remain in observe-only/include-all mode for the failing source and escalate with the failing fixture. Do not reduce correctness or required-context thresholds.
