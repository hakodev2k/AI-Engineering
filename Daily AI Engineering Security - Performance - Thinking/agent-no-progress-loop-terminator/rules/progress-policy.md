# Rules — Progress-Aware Agent Loops

- Every tool step MUST emit a canonical action signature and a progress classification.
- A retry MUST NOT be considered progress merely because a model produced new prose.
- Equivalent tool arguments MUST be canonicalized before repeat detection.
- Repeated non-transient errors beyond policy limits MUST terminate or enter an explicit recovery path.
- Transient retries MUST be separately bounded.
- A recovery retry MUST change at least one of: hypothesis, tool, arguments, prerequisite state, or evidence source.
- The hard global turn/step limit MUST remain enabled as a final bound.
- Loop detection MUST NOT weaken approval, security, data-integrity, or correctness checks.
- Productive fixtures MUST be measured for false-positive termination before rollout.
- Termination MUST include machine-readable evidence and the repeated signature/error responsible.
- No autonomous retry loop MAY be unbounded.
- Missing or ambiguous progress telemetry SHOULD fall back to the hard step cap and human review.
