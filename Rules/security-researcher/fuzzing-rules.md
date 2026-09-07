# Fuzzing Rules

## Purpose
Make fuzzing campaigns reproducible, safe, coverage-oriented, and useful for discovering distinct security defects rather than generating unactionable crashes.

## Scope
Applies to mutation, generation, coverage-guided, grammar-aware, protocol, API, file-format, and differential fuzzing.

## MUST
- Fuzz targets MUST define the security-relevant input boundary, expected invariants, and failure signals before campaign execution.
- Harnesses MUST minimize unrelated initialization and preserve behavior relevant to the target.
- Crash artifacts MUST capture the input, build/version, sanitizer or fault evidence, and execution context needed for reproduction.
- Crashes MUST be deduplicated by defensible root-cause indicators rather than raw count alone.
- Resource limits MUST bound CPU, memory, storage, process count, and network effects.
- Coverage or equivalent reachability evidence MUST be monitored to identify stalled or superficial campaigns.
- High-value findings MUST be reproduced outside the fuzzer before security conclusions are finalized.
- Corpus additions MUST be reviewed for secrets, personal data, and licensing restrictions.

## MUST NOT
- MUST NOT treat every crash as a unique vulnerability.
- MUST NOT run uncontrolled network fuzzers against systems outside explicit authorization.
- MUST NOT suppress sanitizer findings solely because they are difficult to exploit.
- MUST NOT delete unreproduced crash inputs before triage unless retention is prohibited and the limitation is documented.
- MUST NOT claim a target is safe because a finite fuzzing campaign found no defect.

## SHOULD
- Use sanitizers, assertions, differential oracles, and structure-aware generation when they materially improve signal.
- Seed corpora SHOULD represent meaningful valid states and boundary cases.
- Campaigns SHOULD track execution rate, coverage growth, unique faults, timeout rate, and corpus evolution.

## Exceptions
Production-like fuzzing may be justified for environment-specific behavior only with explicit approval, bounded traffic, strong rate controls, and monitored stop conditions.

## Verification
Inspect harness code, corpus provenance, resource limits, coverage metrics, crash deduplication, reproducer artifacts, and triage records. Confirm important crashes map to independently validated root causes.