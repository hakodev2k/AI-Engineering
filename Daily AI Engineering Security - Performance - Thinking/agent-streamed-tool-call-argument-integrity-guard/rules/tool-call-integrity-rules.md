# Tool-Call Integrity Rules

- The runtime MUST retain raw streamed argument provenance until the invocation is either executed or rejected.
- A side-effecting tool MUST NOT execute when its argument stream is incomplete, its finish state is ambiguous, or non-empty arguments were replaced by `{}` after repair failure.
- The executor MUST distinguish a model-authored empty object from a sanitizer-produced empty object.
- A genuinely zero-required-field tool MAY normalize empty or whitespace arguments to `{}` only when no non-whitespace payload was lost.
- Schema validation MUST occur after integrity validation; schema validity MUST NOT override known semantic loss.
- Retrying a malformed call MUST occur before execution and MUST be bounded by `max_retries_before_execution`.
- The runtime MUST NOT retry a side-effecting tool when execution outcome is unknown unless the operation has an idempotency contract.
- Blocked calls MUST produce an explicit model-visible/tool-visible error and audit event; warning-only logging is insufficient.
- Repair traces SHOULD include raw length/hash, parse error, completion state, provider/model, retry count, and canonicalization action without logging secrets.
- Security-sensitive tools SHOULD default to side-effecting when classification is missing.
- Completion MUST be blocked if tests show any lossy-repaired side-effecting invocation reaches the executor.
