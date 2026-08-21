# Compaction Governance Pinning Guard

## Category
Security

## Problem
Lossy context compaction can silently remove or stale security constraints, approvals, and trust boundaries while a long-running agent continues using tools.

## Evidence
See `evidence/research.md`. The package is motivated by 2026 governance-decay research plus production reports showing compaction can lose state, thrash, or trigger unexpectedly.

## Existing approach
Typical systems summarize/truncate conversation history and may re-inject policies through prompts or application code.

## Existing limitations
Generic summaries are not integrity-preserving storage. Semantic retrieval does not guarantee exact policy recovery. Repeated compaction can drift. Failed compaction can leave partial state. An action-time security decision should not depend on whether a summarizer happened to preserve the right sentence.

## Proposed improvement
Separate governance state from lossy conversation state. Store active constraints in an authoritative ledger with ID/version/hash/scope; pin deterministic references into compacted context; validate a candidate before commit; resolve current policy again before protected tool execution.

## Architecture
```text
authoritative governance ledger
      |                   |
      | stable pins       | action-time lookup
      v                   v
pre-context -> candidate compacted context -> validator -> commit
                    |                         |
                    +-- reject/rollback <-----+
```

## Package tree
```text
README.md
evidence/research.md
rules/governance-integrity.md
skills/governance-pinning-audit.md
subagents/governance-verifier.md
workflows/two-phase-compaction.md
workflows/regression-verification.md
hooks/pre-commit-governance-check.md
scripts/governance_coverage.py
```

## Installation
Python 3.9+ is sufficient for the deterministic coverage validator. Integrate the ledger/pinning contract in the host application; do not delegate authoritative governance storage to the model transcript.

## Configuration
Represent each constraint with `id`, `version`, `sha256`, `scope`, and `active`. Approval records should additionally bind the action, applicable actor/session, constraint version/hash, expiry, and revocation state.

## Usage
1. Build a `required.json` ledger snapshot and candidate `candidate-pins.json`.
2. Generate the compacted context without replacing the current context.
3. Run the pre-commit hook.
4. Execute protected-action decision parity tests.
5. Commit only after deterministic validation.
6. Independently run the regression workflow.

Example:
`python scripts/governance_coverage.py required.json candidate-pins.json`

## Workflow
Snapshot authoritative governance → generate candidate → pin references → validate → test authorization parity → adversarial omission test → atomic commit → reload and verify.

## Metrics
- active constraint coverage
- stale/mismatched reference count
- unauthorized protected actions in adversarial fixtures
- invalid candidate commit count
- rollback success rate
- protected-action decision parity
- context reduction after governance preservation

## Verification states
- **Implemented**: authoritative ledger, pins, deterministic validator, two-phase commit/rollback path, and action-time lookup exist.
- **Measured**: context size and security decision outcomes are captured before/after compaction.
- **Verified**: independent verifier passes normal, adversarial, failure, resume, and repeated-compaction fixtures with zero lost active constraints or unauthorized actions.

## Safety
Protected actions fail closed when authoritative governance state is unavailable or inconsistent. Never shrink context by dropping security constraints. Do not treat model-generated summaries as authoritative policy.

## Failure handling
Detection occurs at pre-commit validation or action-time lookup. Candidate generation may be retried at most twice with a different strategy. Validation failure preserves the last known-good context. Ledger corruption, unreconciled hashes, or missing active constraints require escalation rather than policy relaxation.

## Definition of Done
Current evidence documented; ledger and pin schema implemented; compaction candidate validated before commit; rollback proven; active constraint coverage is 100%; stale approvals are rejected; adversarial omission does not alter protected-action outcomes; repeated compaction shows no governance drift; independent verification passes; no blocking integrity issue remains.

## Customization
Add organization-specific policy fields only if canonicalization/hashing is deterministic. High-risk environments may sign ledger snapshots or place them in tamper-evident storage, but cryptographic signing is optional to this base package.
