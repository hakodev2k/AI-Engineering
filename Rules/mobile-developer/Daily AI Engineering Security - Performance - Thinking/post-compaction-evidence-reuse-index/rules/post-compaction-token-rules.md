# Rules — Post-Compaction Evidence Reuse

- The agent **MUST** establish a baseline before claiming token/performance improvement.
- After compaction/resume, the agent **MUST** check the durable evidence index before re-reading a known large file or re-running a known expensive command when an entry may exist.
- File reuse **MUST** require an exact current content hash match.
- Command-result reuse **MUST** require an exact caller-defined state fingerprint match; command text alone is insufficient.
- If freshness cannot be proven, the agent **MUST** refresh from the source of truth.
- Exact large tool outputs **SHOULD** remain outside active context until a current decision actually requires them.
- Compact metadata **SHOULD** include source key, hash/fingerprint, artifact location, observation time, and evidence type.
- The agent **MUST NOT** discard correctness-critical context merely to save tokens.
- The index **MUST NOT** store secrets or sensitive output unless the adopting system provides appropriate protected storage and explicitly opts in.
- Missing/corrupt index entries **MUST** fail safe to source refresh, not guessed reuse.
- Stale entries **SHOULD** be replaced after a successful refresh.
- Reuse decisions **MUST** be observable as hit, miss, stale, or invalid.
- Evaluation **MUST** measure tokens/task, duplicate reads/runs, latency, compactions/hour, stale rejection rate, and correctness regression rate.
- Optimization retries **MUST** be bounded to two measurement cycles before re-evaluation.
