# Deep-Scan Artifact Checkpoint & Retry Guard

**Category:** Thinking

## Problem
Expensive multi-agent scans can do substantial useful work, then fail on a missing mandatory artifact or finalization error. Without transactional phase boundaries, the runtime may discard valid sibling work or restart the full scan and consume more quota without producing a report.

## Evidence
See `evidence/research.md`. Current signals include Codex #38453 (missing `candidate_ledger.json` followed by an automatic full rerun near quota exhaustion), #36588 (missing `threat_model.md` after repeated discovery work), and #35912 (substantive report artifacts existed but finalization/recovery failed). Official codex-security references define artifact contracts that can be deterministically validated.

## Existing approach and limitation
Terminal manifests and retry instructions exist, but completion can still diverge from durable artifact state. Natural-language "do not retry" guidance is not a deterministic interlock, and all-or-nothing recovery can waste valid sibling output.

## Proposed improvement
Make every expensive phase transition artifact-transactional: validate required files, bind hashes to scan id and immutable revision, preserve valid sibling checkpoints, and gate retries by minimum scope, repeated-failure count, explicit approval, and remaining budget.

## Architecture
- `evidence/research.md` — current evidence, gaps, root causes and metrics.
- `skills/checkpoint-recovery-analysis.md` — evidence-first recovery procedure.
- `rules/checkpoint-retry-rules.md` — enforceable completion/retry invariants.
- `subagents/recovery-verifier.md` — independent verification role.
- `workflows/failure-recovery.md` — bounded artifact-first recovery flow.
- `hooks/phase-completion-gate.md` — integration contract before completion/retry.
- `scripts/checkpoint_guard.py` — dependency-free artifact and retry gate.
- `tests/test_checkpoint_guard.py` — deterministic checkpoint/retry tests.

## Installation
Python 3.10+ only. Copy the package into the scan host; no third-party packages are required.

## Configuration
Define the required artifact list per phase, immutable target revision, minimum remaining-budget threshold, and which retry scopes require approval. The reference script treats a full retry after terminal failure as approval-gated.

## Usage
Run tests:
`python -m unittest tests/test_checkpoint_guard.py`

Validate a phase:
`python scripts/checkpoint_guard.py checkpoint --root artifacts --scan-id scan-1 --revision <git-sha> --phase discovery --required worker-1/candidate_ledger.json --out discovery-checkpoint.json`

Gate a retry:
`python scripts/checkpoint_guard.py retry --scope full --terminal-failure --quota-remaining 8 --min-quota 10`

## Workflow
Freeze failed state → measure consumed work/budget → validate durable artifacts → classify failure → choose smallest recovery scope → apply retry/budget gate → recover → measure again → independent verify.

## Metrics
Preserved-work ratio; repeated workers/phases; full reruns per logical scan; wasted token/compute after deterministic failures; checkpoint failure rate; quota per accepted finding/report; time to usable final output.

## Verification
**Implemented:** artifact/hash checkpoint and retry interlock exist.
**Measured:** baseline consumed work and post-recovery repeated work are recorded.
**Verified:** tests pass; missing artifacts block completion; changed content changes the checkpoint hash; full terminal-failure retry is blocked without approval; low quota and repeated deterministic failure block retry.

## Safety
The guard never fabricates artifacts or relaxes security-scan evidence requirements. Human approval is required before dangerous or expensive full restart after terminal failure. Existing valid evidence is preserved read-only during diagnosis.

## Failure handling
Detection: missing/empty required artifact, target/checkpoint mismatch, terminal failure, repeated failure, or budget gate. Evidence: checkpoint/retry JSON and original manifest. Retry: one narrower automatic retry maximum when cause changed. Fallback: finalize from already-valid canonical artifacts where possible. Escalation: coordinator/runtime maintainer. Stop: same deterministic failure twice, budget below threshold, or required approval absent.

## Definition of Done
Evidence documented; target identity bound; required artifacts validated; checkpoint hashes recorded; useful sibling work preserved; recovery scope is minimal; full rerun approval/budget policy enforced; tests pass; before/after metrics captured; independent verification passes; no blocking issue remains.

## Customization
Extend the required-artifact list and retry policy for other long-running agent workflows such as benchmarks, migrations, code review farms, or test matrices. Preserve the same invariants: durable evidence before completion and deterministic authorization before expensive replay.