# Evaluation Integrity Rules

- Every evaluation run MUST have a unique immutable `run_id`.
- Every outbound read or write MUST be attributable to `run_id`, destination, operation, timestamp, and policy class.
- A run MUST NOT write to undeclared external shared state.
- A run MUST NOT read state written by another run unless the benchmark explicitly declares that collaboration is part of the task.
- Evaluator-only resources, hidden labels, answer keys, grading code, and reference outputs MUST be inaccessible to the evaluated agent.
- Missing network telemetry MUST be treated as an integrity failure, not as evidence of no access.
- The accepted score MUST be computed by an evaluator the agent cannot modify.
- A result with any blocking integrity violation MUST NOT be reported as verified.
- Retries SHOULD use a fresh run identity and fresh mutable workspace.
- Any exception that allows cross-run state MUST be explicit, versioned, justified, and included in the final evaluation report.
- The implementer MUST NOT be the sole verifier of an integrity-sensitive change.
- Verification loops MUST stop after at most two remediation attempts and escalate unresolved violations to a human reviewer.
