# Rule — Streaming Tool-Argument Parse Performance

- Every optimization **MUST** start from a measured baseline using representative argument sizes and chunk distributions.
- A runtime **MUST NOT** claim streaming performance improved solely because output arrives incrementally.
- Benchmarking **MUST** record final argument bytes, chunk count, total parse CPU, and per-delta parse latency.
- Implementations **SHOULD** avoid full-prefix parsing on every delta when argument size can grow materially.
- Cooperative yielding **MUST NOT** be reported as a CPU-complexity fix; it only bounds responsiveness.
- Buffer-size caps **SHOULD** exist as a safety bound but **MUST NOT** substitute for algorithmic regression testing.
- Any parser replacement **MUST** preserve final argument semantics for valid streams.
- Malformed/truncated streams **MUST** have explicit tested behavior and **MUST NOT** execute incomplete tool calls.
- Before/after tests **MUST** use the same fixtures and chunk boundaries.
- The optimization loop **MUST** be bounded to at most 3 hypothesis/implementation attempts before escalation.
- A change is **Verified** only when budgets pass and correctness tests show no critical regression.
