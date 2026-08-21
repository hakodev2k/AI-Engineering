# Core Skills

## Skill 1 — Model-Aware Request Budgeting

**Purpose:** Admit a model request only when the final rendered payload fits the selected model with explicit output and safety reserves.

**Trigger:** Immediately before every provider/model invocation, including subagents, memory jobs, summarizers, retries, and background tasks.

**Inputs:** Final serialized/rendered request, model identifier, effective input/context limit, reserved output/reasoning budget, policy, optional exact-count adapter.

**Preconditions:** Model identity is resolved; request rendering is complete; tool schemas/system instructions/retrieved context are already attached.

**Required context:** Provider/model metadata, policy version, request hash, task type.

**Tools:** `scripts/context_preflight.py`; provider/local tokenizer when available.

**Procedure:**
1. Hash the final request artifact.
2. Resolve the *actual target model* and its effective context limit; never inherit the coordinator limit implicitly.
3. Compute `admissible_input = context_limit - output_reserve - reasoning_reserve - safety_margin`.
4. Obtain token count with provenance: `exact`, `provider`, `measured`, or `estimated`.
5. If utilization exceeds the policy threshold and count is only estimated, return `RECOUNT_REQUIRED` rather than sending.
6. If count <= admissible input, emit `ALLOW` with headroom.
7. Otherwise emit `REDUCE` with required token reduction; do not call the provider yet.
8. Record request hash, model, limits, count source, count, headroom, and decision.

**Decisions:** `ALLOW`, `REDUCE`, `RECOUNT_REQUIRED`, `BLOCK_CONFIGURATION`.

**Constraints:** Never use previous-turn usage as the count for a changed payload. Never use a universal byte/token ratio as an exact count.

**Expected output:** Machine-readable budget decision plus human-readable diagnostics.

**Metrics:** preflight coverage, exact-count coverage, headroom, context errors, estimate error.

**Verification:** Re-run the guard against token-dense fixtures and compare estimated counts with measured provider/local tokenizer counts when available.

**Failure handling:** Missing model metadata fails closed. Exact-counter outage may use conservative fallback only below configured fallback utilization.

**Stop conditions:** Allow only with valid model metadata and adequate headroom; otherwise reduce/block.

---

## Skill 2 — Evidence-Preserving Context Reduction

**Purpose:** Reduce an oversized request without silently removing correctness-critical information.

**Trigger:** Preflight returns `REDUCE`.

**Inputs:** Rendered request components with provenance/priority, required reduction tokens, task requirements, policy.

**Preconditions:** Components are separable or re-renderable; protected content is identified.

**Required context:** User requirements, active plan/constraints, tool result provenance, retrieval scores/timestamps, prior summaries.

**Tools:** context inventory, deduplication, retrieval filter, summarizer if permitted, `context_preflight.py` for re-check.

**Procedure:**
1. Freeze protected content: system safety rules, current user request, active acceptance criteria, irreversible-action approvals, critical evidence.
2. Remove byte-identical or semantically duplicate context first.
3. Evict stale tool outputs whose durable reference remains available.
4. Drop low-relevance retrieval chunks using configured relevance/recency rules.
5. Compress older history into a structured checkpoint containing Facts, Decisions, Open Questions, Constraints, Evidence References, and Verification State.
6. Re-render the full request.
7. Re-run exact/model-aware preflight.
8. Stop after two reduction attempts; escalate rather than repeatedly summarize.

**Decisions:** accept reduced request, perform one additional bounded reduction, or require a new thread/checkpoint/human decision.

**Constraints:** Do not silently remove required evidence. Do not summarize secrets into model-visible context if they were previously protected.

**Expected output:** Reduced request, change manifest, protected-content proof, new budget decision.

**Metrics:** tokens removed, retained-context ratio, verification regressions, reduction attempts.

**Verification:** Compare required facts/constraints before and after reduction; run task-specific tests/evals where possible.

**Failure handling:** If required content alone exceeds budget, split task or select an explicitly approved larger-context model.

**Stop conditions:** Maximum two reduction rounds; no unlimited compact-retry loop.

---

## Skill 3 — Estimate Calibration

**Purpose:** Keep fallback estimates conservative using measured traffic instead of a permanent magic constant.

**Trigger:** Periodically or after tokenizer/model changes; also when estimate error breaches threshold.

**Inputs:** Records containing serialized byte count, character count, estimated tokens, measured input tokens, model/tokenizer version.

**Procedure:**
1. Group observations by model/tokenizer version and content class where available.
2. Compute under-count error distribution.
3. Choose a fallback multiplier/floor that produced zero under-counts in the verification corpus plus configured safety margin.
4. Reject calibration sets with too few or nonrepresentative samples.
5. Version the policy and rerun regression fixtures.

**Expected output:** Versioned conservative fallback parameters and calibration report.

**Metrics:** max under-count, p95 absolute percentage error, fallback rejection rate.

**Verification:** Holdout corpus must have zero under-count beyond admitted safety margin.

**Failure handling:** Disable fallback for near-boundary calls if calibration confidence is insufficient.

**Stop conditions:** Calibration is complete only after holdout verification passes.
