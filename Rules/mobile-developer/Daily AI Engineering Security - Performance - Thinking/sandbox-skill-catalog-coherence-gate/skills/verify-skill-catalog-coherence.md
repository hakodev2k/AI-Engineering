# Skill — Verify Skill Catalog Coherence

## Purpose
Establish a trustworthy, run-scoped capability snapshot before an agent plans or invokes skill-dependent tools.

## Trigger
Sandbox start/resume, skill set update, first skill-dependent task, concurrent-run admission, or any missing/unreadable skill symptom.

## Inputs
Expected eligible skill IDs, advertised catalog entries, effective sandbox paths, materialization generation ID, catalog hash, run/session identity, and `config/policy.json`.

## Preconditions
Expected eligibility is computed from trusted platform configuration; sandbox path checks can run without executing skill code.

## Required context
Facts only: skill IDs, paths, generation, hashes, sandbox root/mount mapping, and read/stat results. Do not request hidden chain-of-thought.

## Allowed tools
Filesystem metadata/readability checks within the sandbox boundary, deterministic scripts, trusted skill manifest APIs, logs, and controlled concurrency tests.

## Constraints
- MUST NOT disable sandboxing to make a skill readable.
- MUST NOT silently omit an expected eligible skill.
- MUST NOT use a catalog generated from a different materialization generation.
- MUST NOT execute skill code as a validation method.
- SHOULD minimize repeated scans by validating one immutable generation.

## Procedure
1. Record the trusted expected eligible skill set for the run.
2. Capture materialization generation ID and publication path.
3. Capture advertised catalog entries from that exact generation.
4. Normalize skill IDs and sandbox-visible paths.
5. Run `scripts/skill_catalog_guard.py` against the snapshot.
6. For every advertised entry, verify the declared `SKILL.md` exists/readable inside the effective sandbox namespace.
7. Compare expected vs advertised IDs and compute completeness/readability ratios.
8. Compare catalog hash across identical concurrent runs when running a regression/benchmark.
9. If guard returns `rebuild`, rebuild into a new staging generation once, atomically publish/bind the run, and repeat verification.
10. If still incoherent, block planning and preserve evidence.

## Decision points
- Complete + readable + valid generation/hash: allow planning.
- First incoherence and rebuild budget available: rebuild once.
- Missing/unreadable skill after rebuild: block.
- Security downgrade would be required: block and escalate.
- Expected set cannot be determined: block because completeness cannot be measured.

## Expected output
Structured Facts, Assumptions, Evidence, Decision, Risks, and Verification status containing expected/advertised IDs, missing/extra/unreadable entries, generation/hash, and bounded remediation outcome.

## Metrics
Completeness ratio, readability ratio, catalog-hash consistency, missing/extra count, read failures, rebuild count, and skill-discovery retries/tool calls.

## Verification
Run deterministic fixtures plus a concurrent test where identical inputs must produce the same complete catalog hash and every advertised path remains readable throughout the run.

## Failure handling
Detection is deterministic. Preserve the snapshot; rebuild at most once. Fallback is explicit block/degraded capability reporting, never sandbox disable. Escalate when materialization and path mapping remain inconsistent.

## Stop conditions
Stop on exhausted rebuild budget, any required security downgrade, unknown expected eligibility, or catalog/path generation mismatch.
