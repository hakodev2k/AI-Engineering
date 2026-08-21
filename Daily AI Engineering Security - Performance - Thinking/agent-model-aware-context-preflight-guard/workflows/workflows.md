# Workflows

## Workflow A — Request Admission

**Trigger:** Any foreground/background/subagent model invocation.

**Goal:** Prevent context overflow and premature reduction using model-specific final-request accounting.

**Inputs:** rendered request, target model, model context limit, policy, token counter adapter.

**Baseline:** record current context-error rate, preflight coverage, average headroom, exact-counter coverage, and identical-payload retry count.

**Stages:**
1. **Render** — create the exact provider-bound request artifact.
2. **Identify** — resolve actual target model and context limit.
3. **Count** — exact/provider counter first; conservative fallback only under policy.
4. **Budget** — subtract output/reasoning reserves and safety margin.
5. **Decide** — `ALLOW`, `REDUCE`, `RECOUNT_REQUIRED`, or `BLOCK_CONFIGURATION`.
6. **Execute** — call provider only for `ALLOW`.
7. **Measure** — capture provider-reported usage when available.
8. **Reconcile** — compare measured usage with estimate and update observability, never silently changing policy.

**Responsible agents:** Context Budget Analyst for baseline; runtime/Implementation Agent for stages 1–7.

**Tools:** `scripts/context_preflight.py`, provider/local tokenizer, runtime tracing.

**Outputs:** budget-decision JSON, provider response or reduction request, metrics.

**Checkpoints:** final-render hash captured; model resolved; count provenance recorded; admission invariant true.

**Metrics:** context errors, headroom, utilization, count-source distribution, estimate error, latency overhead.

**Retry policy:** no identical retry after context overflow. Counter/transient service can retry once; budget failure must change payload/model policy.

**Stop conditions:** missing model limit; near-boundary estimate without exact counter; max reduction attempts reached.

**Failure path:** preserve request artifact/evidence, block provider call, route to Workflow B or human/model-policy decision.

**Verification:** replay token-dense fixtures and inspect every call path for preflight coverage.

**Definition of Done:** 100% call-path coverage, zero invariant violations in tests, no identical oversized retries.

---

## Workflow B — Oversized Request Reduction

**Trigger:** `REDUCE` decision.

**Goal:** Make the request fit while preserving correctness-critical context.

**Inputs:** componentized context, required reduction count, protected component set.

**Stages:**
1. Record Facts / Requirements / Constraints / Evidence / Open Questions.
2. Deduplicate exact/repeated content.
3. Replace stale bulky tool outputs with durable references where supported.
4. Remove low-relevance retrieval/context proven unnecessary for the active task.
5. Compress older history into a structured checkpoint only if still oversized.
6. Re-render, recount, and compare.
7. If still oversized, perform at most one additional reduction round.
8. If protected content itself does not fit, stop and require task split or explicit model-routing decision.

**Checkpoint:** protected IDs present after each reduction.

**Metrics:** tokens before/after, protected-content retention, number of reduction passes, downstream quality/eval delta.

**Retry policy:** maximum two reduction rounds.

**Failure path:** no silent deletion; emit blocking reason and required minimum capacity.

**Definition of Done:** final request passes Workflow A and protected-content verification.

---

## Workflow C — Context Accounting Regression Investigation

**Trigger:** new `context_length_exceeded`, unexpected early compaction, model/tokenizer upgrade, or estimate-error alert.

**Goal:** determine whether the cause is model metadata, request rendering, tokenizer drift, stale usage, or fallback estimation.

**Stages:** Observe -> capture exact request hash -> reproduce -> identify count provenance -> compare exact/measured vs estimate -> form one hypothesis -> implement minimal fix -> rerun corpus -> independently verify.

**Retry policy:** two hypothesis cycles maximum before escalation.

**Stop conditions:** cannot reproduce with preserved artifact; provider/model limit unknown; measurement unavailable near boundary.

**Verification:** require evidence showing the suspected accounting path changed and no regression fixture fails.

**Definition of Done:** root cause documented, fix measured, verification agent passes invariants, residual risk recorded.
