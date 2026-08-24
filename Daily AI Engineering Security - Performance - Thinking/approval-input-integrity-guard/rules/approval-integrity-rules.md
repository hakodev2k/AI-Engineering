# Approval Integrity Rules

- Approval-bearing calls MUST preserve a stable tool identity from request through execution.
- Approval-bearing arguments MUST be parsed without silent fallback; malformed or lossy parsing MUST block approval.
- A human or policy engine MUST review the canonical post-validation/post-transform arguments that are eligible to execute.
- The runtime MUST bind approval to a cryptographic digest of tool identity plus canonical arguments.
- Execution MUST recompute the digest immediately before side effects and MUST block on mismatch.
- A missing argument object MUST NOT be treated as equivalent to malformed, defaulted, or discarded input.
- Any deterministic argument rewrite after approval MUST invalidate prior approval and require a new decision.
- Nested/delegated tool calls MUST surface the actual approval-bearing inner tool identity and arguments.
- Approval records SHOULD include tool-call ID, session ID, timestamp, decision source, and digest, but MUST NOT include secrets unnecessarily.
- Audit logs MUST redact sensitive values while retaining enough metadata to prove digest continuity.
- Retry logic MUST NOT reuse an approval for a different digest.
- Failures MUST remain fail-closed; implementations MUST NOT weaken validation to preserve automation throughput.
