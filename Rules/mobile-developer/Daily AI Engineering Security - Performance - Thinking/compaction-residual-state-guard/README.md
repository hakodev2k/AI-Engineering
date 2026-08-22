# Compaction Residual State Guard

**Category:** Token

## Problem
Long-running AI-agent sessions need compaction, but truncation plus summarization can make previously completed tool state unreachable. The result is repeated repository reads, lost execution facts, higher token cost, and incorrect continuation even when full records still exist in persisted session storage.

See `evidence/research.md` for current public signals and root-cause analysis.

## Proposed improvement
Treat compaction as a state-preserving transformation. Required execution state may leave the active context only when it is fully retained or represented by a compact, authorization-safe, recoverable reference with integrity metadata.

## Architecture
- `skills/residual-state-audit.md` — procedure for state inventory and residualization.
- `rules/compaction-integrity.rules.md` — correctness/security invariants.
- `subagents/context-integrity-auditor.md` — read-only pre-compaction auditor.
- `subagents/recovery-verifier.md` — independent post-compaction recovery verifier.
- `workflows/precompact-residualize.md` — bounded measure/residualize/compact/verify flow.
- `hooks/precompact-residual-check.md` — deterministic blocking hook.
- `scripts/residual_guard.py` — executable manifest validator.
- `config/residual-policy.json` — default residual policy.
- `evidence/research.md` — evidence and sources.

## Installation
Requires Python 3.10+ with no third-party dependencies. Integrate manifest generation into the agent/runtime immediately before truncation or compaction.

## Configuration
`config/residual-policy.json` requires references and SHA-256 hashes for omitted required state and blocks unrecoverable required items. `max_inline_bytes` is an integration hint for deciding when to reference rather than embed; correctness-critical state must not be dropped merely to satisfy it.

## Manifest contract
Each item records `id`, `tool`, `status`, `required`, `recoverable`, `sha256`, `reference`, `retained_bytes`, `omitted_bytes`, and `reason`. For sensitive state, the reference should point to an access-controlled store and the manifest should not contain the secret payload itself.

## Usage
Generate `manifest.json`, then run:

`python3 scripts/residual_guard.py manifest.json --policy config/residual-policy.json --strict`

Exit `0` allows compaction. Exit `3` blocks because required residual state is incomplete. Exit `2` indicates invalid evidence/configuration.

## Workflow
Follow `workflows/precompact-residualize.md`: capture a baseline, inventory required execution state, create residuals, validate, compact, measure token reduction, then independently recover and hash-check required references.

## Metrics
Measure required residual coverage, pre/post context tokens, omitted bytes, recovery success, repeated tool/read calls after compaction, task quality, and regression rate. Token reduction alone is not success.

## Verification
**Implemented** means residual generation and the pre-compaction hook are integrated. **Measured** means before/after context and repeated-work metrics exist. **Verified** means required references recover after compaction with matching hashes, intended authorization scope is preserved, and task-quality fixtures show no critical context loss.

## Safety
Residual references must be identity/session scoped. A predictable record ID must not become an access capability. Never expose secrets in residual metadata. Never weaken authorization or sandbox boundaries to make recovery easier.

## Failure handling
When required state cannot be recovered, block compaction or preserve the state inline if safe. Allow at most two repair attempts. After that, escalate or create a controlled new-session handoff with explicit verified state; do not silently continue from incomplete context.

## Definition of Done
- Public evidence and existing limitations documented.
- Required execution state is inventoried.
- Required residual coverage reaches 100%.
- Unrecoverable required state blocks compaction.
- Before/after context usage is measured.
- Recovery references resolve with matching hashes.
- Unauthorized contexts cannot retrieve scoped residual state.
- Repeated-work and quality regressions are checked.
- No security or correctness boundary is weakened.

## Customization
Adapters may use database IDs, object-store URIs, session-log offsets, artifact IDs, or content-addressed blobs as references. Preserve the same contract: stable identity, integrity, recoverability, authorization scope, omission metadata, and explicit continuation reason.
