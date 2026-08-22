# Engineering Rules

## MUST

- Every model call MUST pass a preflight against the final rendered request, not a pre-template fragment.
- Every call MUST carry explicit target-model identity and effective context limit.
- Subagents MUST use their own model limits; coordinator limits MUST NOT be inherited implicitly.
- Output/reasoning reserves and a safety margin MUST be deducted before calculating admissible input.
- Token-count provenance MUST be recorded as exact/provider/measured/estimated.
- A changed payload MUST be recounted; previous-turn usage is not a valid count for a new payload.
- Near the configured context boundary, an exact/provider-supported counter MUST be used or the request MUST fail closed.
- `context_length_exceeded` MUST be classified as a deterministic payload/budget failure; the identical payload MUST NOT be retried.
- Reduction MUST preserve current user requirements, security constraints, approvals, active acceptance criteria, and critical evidence.
- Reduction loops MUST be bounded to the configured maximum attempts.
- Estimate-vs-measured error MUST be captured when a measured count later becomes available.
- Policy/model metadata changes MUST trigger regression tests.

## MUST NOT

- MUST NOT treat bytes/4, chars/4, word counts, or any fixed ratio as an exact tokenizer result.
- MUST NOT decide compaction using only stale server usage after adding new tool/user/retrieved content.
- MUST NOT silently discard required context to make a request fit.
- MUST NOT retry an oversized request without changing either payload, model/limit, or reserved budget under an explicit policy decision.
- MUST NOT route to a larger/more expensive model solely to avoid reduction unless policy or a human explicitly allows it.
- MUST NOT overwrite a measured token count with an approximation for the same rendered request hash.
- MUST NOT mix calibration data across tokenizer/model versions without recording the version boundary.

## SHOULD

- SHOULD prefer provider/local tokenizer counting over estimation.
- SHOULD retain durable references to evicted tool outputs so they can be rehydrated on demand.
- SHOULD remove duplicate/stale context before semantic summarization.
- SHOULD expose headroom, utilization, count source, and reduction reason in observability.
- SHOULD maintain token-dense fixtures covering JSON, code, Unicode/CJK/Vietnamese text, punctuation, long tool schemas, and mixed context.
- SHOULD keep at least 8% or 4096 tokens of safety margin unless a model-specific policy justifies another value.
- SHOULD compare preflight estimates with provider-reported usage and alert on systematic drift.

## Testable invariants

1. `input_count + reserves + safety_margin <= context_limit` for every admitted request.
2. Every admitted request has non-empty model identity and count source.
3. No request hash that received `context_length_exceeded` is immediately resubmitted unchanged.
4. Reduction never removes protected component IDs.
5. Exact/measured count for a request hash is never replaced by a lower-confidence estimate.
