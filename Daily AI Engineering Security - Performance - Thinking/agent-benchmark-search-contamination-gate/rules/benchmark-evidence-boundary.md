# Benchmark Evidence Boundary Rules

- Benchmark score admission MUST depend on an explicit contamination status.
- Runs with definite contamination MUST NOT be counted as clean benchmark results.
- Runs with incomplete required retrieval telemetry MUST be classified indeterminate and MUST NOT be counted until resolved.
- All external search queries, requested URLs and retrieved-artifact identifiers MUST be observable in the evaluation trace when those tools are enabled.
- The harness MUST NOT provide gold patches, answer keys or benchmark-specific solution artifacts to the evaluated agent.
- Task-specific forbidden patterns SHOULD be narrow, versioned and reviewable.
- Known answer artifacts SHOULD be represented by cryptographic hashes when possible rather than copied into model-visible context.
- Evaluation tooling MUST separate observed evidence, interpretation and proposed remediation.
- The implementer MUST NOT be the sole contamination verifier.
- Retry loops MUST be bounded; a failed trace export gets at most one regeneration attempt before quarantine.
- Hidden chain-of-thought MUST NOT be requested, stored or used as the contamination signal.
- Benchmark owners MUST report the number of clean, contaminated and indeterminate runs alongside aggregate scores.