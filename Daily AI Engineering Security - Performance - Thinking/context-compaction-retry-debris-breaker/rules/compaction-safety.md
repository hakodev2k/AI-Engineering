# Compaction Safety Rules

- The compaction pipeline MUST separate semantic conversation items from retry/debug/transport debris before building a summary request.
- The pipeline MUST enforce `max_compaction_input_chars` before sending a compaction request.
- A retry MUST NOT resend an equivalent or larger failed compaction payload unless a human explicitly overrides the policy.
- A retry MUST either reduce payload size by `min_payload_reduction_ratio` or switch to a different bounded recovery strategy.
- Compaction attempts MUST stop after `max_retries`.
- A previously verified summary MUST NOT be discarded unless the replacement passes continuity checks for active goal, completed work, unresolved work, constraints, and critical facts.
- Failure diagnostics SHOULD be stored out-of-band from the semantic history used for compaction.
- The recent-tail preservation window MUST remain bounded.
- The system MUST record whether a summary is Implemented, Measured, and Verified; generated text alone is not verification.
- Any destructive reset of durable session state MUST require explicit human approval.
