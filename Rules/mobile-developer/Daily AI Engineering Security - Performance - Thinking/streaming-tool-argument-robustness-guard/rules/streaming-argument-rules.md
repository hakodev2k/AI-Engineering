# Rules: Streaming Tool Arguments

1. The runtime MUST identify each argument event as a delta, cumulative snapshot, or final authoritative payload before aggregation.
2. The runtime MUST NOT blindly concatenate cumulative snapshots.
3. The runtime MUST treat the final provider payload as authoritative when `final_payload_authoritative` is enabled.
4. The runtime MUST NOT execute a side-effecting tool from partial arguments unless that exact tool is listed in `allow_incremental_execution_tools` and its incremental contract is tested.
5. The runtime MUST enforce `max_argument_bytes`, `max_chunks`, and `max_stream_seconds` before tool execution.
6. A missing final event MUST produce an explicit truncated-stream outcome; it MUST NOT wait indefinitely.
7. Partial parsing for UI preview MUST be throttled and MUST NOT be used as execution authorization.
8. The implementation MUST avoid full-prefix parse/repair on every chunk in the common path.
9. The implementation MUST record final-argument mismatches between preview state and authoritative final state.
10. Benchmarks MUST use at least four payload sizes and MUST compare the same fixtures before and after changes.
11. Performance improvement MUST NOT be claimed without measured elapsed work and unchanged final-argument correctness.
12. A benchmark regression above `max_benchmark_regression_percent` MUST block completion unless explained and explicitly accepted by a human reviewer.
13. Logs MUST NOT contain secrets or full sensitive tool payloads; hashes, sizes, structural metadata, and redacted snippets SHOULD be used instead.
14. Retry loops MUST be bounded to at most 3 attempts for measurement noise and MUST NOT retry malformed/truncated payloads without new input.
15. The agent implementing a high-impact execution-gate change MUST NOT be the only verifier.
