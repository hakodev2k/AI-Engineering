# Compaction Budget Rules

- The runtime MUST distinguish configured context/compaction values from resolved effective values.
- The effective context window and effective compaction threshold MUST be measured or exposed by the executing runtime, not inferred only from static configuration.
- Session start, resume, model/provider switch, and config reload MUST trigger re-attestation.
- A configured/effective threshold divergence greater than the approved tolerance MUST produce an explicit reason and MUST NOT remain silent.
- Token policy SHOULD define both a ratio target and an absolute threshold ceiling when large model windows could make ratio-only control uneconomic.
- Runtime/provider context limits MUST take precedence over advertised metadata when the observed limit is smaller.
- Warnings and recommendations MUST be generated from the same effective-threshold computation used by execution.
- Automation MUST NOT lower required context merely to satisfy cost targets; quality and correctness constraints remain mandatory.
- Baseline tokens/task, latency, compactions/session, and rate-limit incidents MUST be captured before claiming improvement.
- A changed effective context window or threshold MUST invalidate the previous attestation.
- Hidden clamps, floors, ceilings, or fallback metadata MUST be surfaced as reason-coded policy resolution.
- Failure to resolve a trustworthy effective threshold MUST block automated claims of budget compliance.
