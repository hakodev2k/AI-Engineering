# Test Selection Governance

## MUST
- Capture the complete changed-file set against a declared base ref before selecting tests.
- Bind every test plan to a deterministic change fingerprint.
- Classify changed paths using the configured policy.
- Include every mandatory suite triggered by risk rules.
- Broaden test scope when impact confidence falls below configured thresholds.
- Treat unknown impact as evidence of insufficient coverage, not as no impact.
- Record skipped, not-discovered, quarantined, and failed tests separately from passed tests.
- Require independent coverage review for high-risk changes.
- Preserve test command, exit code, duration, and executed test identifiers where available.
- Require explicit human approval before production deployment, destructive database actions, breaking API changes, security weakening, or irreversible migrations regardless of test status.

## MUST NOT
- Do not select tests only from filename similarity.
- Do not infer safety because unit tests passed when integration/E2E suites are policy-mandated.
- Do not suppress failing mandatory tests to obtain a green gate.
- Do not reduce the suite because tests are slow without policy evidence.
- Do not reuse a plan after the diff fingerprint changes.
- Do not classify test execution as verified coverage when selected tests were not discovered or were skipped.
- Do not allow the implementation agent to be the only verifier for high-risk changes.
- Do not use selective testing to bypass repository-required CI checks.

## SHOULD
- Prefer explicit repository mappings over heuristic mappings.
- Prefer one-hop dependency expansion, then broaden only when evidence justifies it.
- Keep reasons for each selected suite concise and machine-readable.
- Run cheap targeted tests first, then mandatory broader suites.
- Promote frequently observed heuristic mappings into explicit policy mappings after review.