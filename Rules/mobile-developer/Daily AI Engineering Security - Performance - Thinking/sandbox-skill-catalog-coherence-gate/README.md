# Sandbox Skill Catalog Coherence Gate

## Topic
Verify that a sandboxed AI agent plans from one complete, immutable, readable skill-capability snapshot.

## Category
Thinking

## Problem
Agent planning becomes unreliable when `<available_skills>` or an equivalent capability catalog is incomplete, stale, cross-generation, or points to files the sandbox cannot read. Current OpenClaw reports show both concurrent partial catalogs and advertised-but-unreadable skill paths.

## Evidence
See `evidence/research.md`. The strongest current signal is OpenClaw #122554 (2026-08-12), where concurrent sandboxed runs saw inconsistent subsets of the same expected skill set. Independent sandbox path/materialization failures are documented in #105854 and #46257.

## Existing approach
Platforms commonly materialize/mirror skills into sandbox workspaces and then scan a live directory to construct the model-visible catalog. Some use partial locking or regenerate on sandbox creation.

## Existing limitations
A shared destructive refresh can expose a partial directory to concurrent readers. Separately generated prompt paths can disagree with sandbox path resolution. Retrying failed reads does not prove capability-snapshot coherence and can waste model/tool calls.

## Proposed improvement
Bind each run to an immutable generation: build in staging, validate expected/advertised/readable entries, publish atomically (or bind directly to the immutable staged result), hash the catalog, and allow skill-dependent planning only after deterministic verification.

## Architecture
- `evidence/research.md` — current signals, existing approaches, gaps, root causes, metrics.
- `config/policy.json` — strict completeness/readability and bounded-rebuild policy.
- `skills/verify-skill-catalog-coherence.md` — reusable verification procedure.
- `rules/catalog-coherence-invariants.md` — enforceable planning-input invariants.
- `subagents/capability-snapshot-verifier.md` — independent verifier.
- `workflows/build-verify-publish.md` — bounded diagnose/build/publish/verify flow.
- `hooks/pre-planning-catalog-gate.md` — deterministic pre-planning gate.
- `scripts/skill_catalog_guard.py` — executable snapshot validator.
- `tests/test_skill_catalog_guard.py` — dependency-free regression tests.

## Actual package tree
```text
sandbox-skill-catalog-coherence-gate/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-planning-catalog-gate.md
├── rules/
│   └── catalog-coherence-invariants.md
├── scripts/
│   └── skill_catalog_guard.py
├── skills/
│   └── verify-skill-catalog-coherence.md
├── subagents/
│   └── capability-snapshot-verifier.md
├── tests/
│   └── test_skill_catalog_guard.py
└── workflows/
    └── build-verify-publish.md
```

## Installation
Python 3.9+ is sufficient for the guard and tests; no third-party packages are required. The host platform must export a trusted expected-eligibility set and sandbox-visible read/stat evidence for the run-scoped materialization generation.

## Configuration
`config/policy.json` defaults to zero missing and zero unreadable skills, one rebuild attempt, and no security downgrade. Adjust eligibility policy only when the platform intentionally excludes a capability; never redefine the expected set merely to hide a materialization failure.

## Usage
Run tests:

`python3 tests/test_skill_catalog_guard.py`

Validate a snapshot:

`python3 scripts/skill_catalog_guard.py snapshot.json --policy config/policy.json`

The snapshot schema is documented in the script. Exit codes are `0` allow, `2` invalid, `3` rebuild, and `4` block.

## Workflow
Follow `workflows/build-verify-publish.md`: Observe → baseline → diagnose → hypothesis → immutable/atomic rebuild → measure again → at most one retry → independent verification. Planning never proceeds on a silently incomplete catalog.

## Metrics
Measure catalog completeness/readability ratios, missing/extra skills, cross-run catalog-hash variance for identical inputs, skill-read failure rate, rebuild count, mismatch-related tool/model retries, and capability-related planning rework.

## Verification
A valid run has one generation ID and catalog hash, all expected eligible skills are advertised, every advertised `SKILL.md` is readable inside the effective sandbox, and controlled concurrent runs with identical inputs produce equivalent complete snapshots. Hidden chain-of-thought is not used as evidence.

## Safety
Do not disable sandboxing, relax path validation, or copy secrets into the workspace to repair a catalog. Validation reads metadata/instructions only and does not execute skill code. Security boundaries take precedence over availability.

## Failure handling
Detection: missing, unreadable, hash/generation mismatch, or divergent concurrent catalogs. Evidence: preserve normalized snapshot and read results. Retry: rebuild at most once by default. Fallback: explicit blocked/degraded capability state, not silent omission. Escalation: platform owner when atomic publication/path mapping cannot be established. Stop: retry budget exhausted or security downgrade required.

## Definition of Done
- **Implemented:** run-scoped generation and atomic/immutable publication strategy integrated.
- **Measured:** baseline and post-change completeness/readability/hash metrics captured, including concurrency results.
- **Verified:** deterministic tests pass; all expected skills are present; all advertised paths are readable; identical concurrent inputs do not observe partial generations; sandbox protections remain enforced; no blocking issue remains.

## Customization
Extend the snapshot with version, source, content digest, or capability metadata as needed. Preserve the core invariant: planning must consume exactly the verified capability generation that the sandbox can actually read.
