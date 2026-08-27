# Rules: Prompt Cache Stability

- Baseline cache-read and cache-creation tokens MUST be recorded before optimization.
- Stable system and tool blocks SHOULD remain byte-stable within a resumable session.
- Dynamic repository or session state SHOULD be placed after stable cacheable prefixes when correctness permits.
- A resume with changed early-prefix blocks MUST run the preflight guard before model submission.
- Large recache exposure MUST require explicit approval when policy thresholds are exceeded.
- Security instructions and correctness-critical context MUST NOT be removed to save tokens.
- Raw secret values MUST NOT be logged in cache diagnostics.
- Improvement MUST NOT be claimed without before/after metrics on an equivalent workload.
- A failed optimization MUST restore the last verified prompt layout before another attempt.
