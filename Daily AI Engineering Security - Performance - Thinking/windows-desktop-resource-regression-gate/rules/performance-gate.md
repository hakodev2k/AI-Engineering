# Rules — Windows Desktop Resource Gate

- The investigator MUST capture a baseline before claiming a regression when a known-good build is available.
- The gate MUST evaluate sustained samples, not a single instantaneous spike.
- Missing metrics MUST NOT be treated as zero.
- A disappeared target process MUST NOT be reported as a performance pass.
- CPU, I/O, memory and process churn SHOULD be measured together.
- Before/after comparisons MUST use the same sampling duration and interval unless deviation is documented.
- Failed candidate JSON evidence MUST be preserved.
- Defender, endpoint protection, sandboxing, approval controls and other security boundaries MUST NOT be disabled for performance.
- Unrelated processes MUST NOT be killed.
- Improvement MUST NOT be marked Verified until the deterministic probe passes and reproduction no longer breaches policy.
- Diagnostic retries MUST be bounded to at most three hypotheses per run.
- Threshold changes MUST be justified by baseline evidence and MUST NOT be raised only to convert failure into pass.
