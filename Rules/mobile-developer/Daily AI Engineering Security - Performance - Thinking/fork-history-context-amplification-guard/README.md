# Fork History Context Amplification Guard

## Category
Token

## Problem
Full-history forks can inherit append-only historical compaction snapshots and repeated inline image payloads even when later compactions supersede earlier model-visible history. The result can be extreme persisted/request amplification, higher token/latency cost, storage growth, and repeated transport failure.

## Evidence
See `evidence/research.md`. Current public reports include openai/codex#39499, #34268, and #24550 with measured multimodal/compaction amplification and transport failure reproductions.

## Existing approach and limitation
Compaction reduces active context, full-history fork maximizes continuity, and transport retries/fallback improve availability. These do not guarantee that inherited persisted history is minimal: old compactions and repeated inline blobs can still be copied or replayed.

## Proposed improvement
Measure before forking. Distinguish persisted history from effective context, fingerprint inline blobs, detect compaction amplification, enforce explicit budgets, and reject unsafe full-history inheritance unless required-context verification passes.

## Architecture
- `evidence/research.md` — public evidence, limitations, root causes.
- `skills/context-amplification-analysis.md` — reusable analysis procedure.
- `rules/context-budget-rules.md` — enforceable token/context rules.
- `subagents/context-auditor.md` — measurement role.
- `subagents/verification-agent.md` — independent quality verifier.
- `workflows/measure-dedup-verify.md` — bounded optimization loop.
- `hooks/preflight-context-budget.md` — blocking pre-fork hook.
- `config/budget.json` — explicit example hard budgets.
- `scripts/history_payload_audit.py` — deterministic read-only analyzer.
- `tests/test_history_payload_audit.py` — regression tests.

## Installation
Requires Python 3.10+ and only the standard library. Copy the package into an agent/runtime repository or call the analyzer directly.

## Configuration
Review `config/budget.json` for your platform. The defaults are guardrails, not claims about provider limits. Lower them for stricter environments; increases require documented evidence and approval.

## Usage
`python scripts/history_payload_audit.py path/to/rollout.jsonl --config config/budget.json --pretty`

Exit codes: `0` allow, `1` measured budget violation, `2` input/config error.

## Workflow
Observe → capture baseline → identify compaction/blob amplification → select one reversible optimization → measure again → independently verify required-context coverage → accept or re-evaluate. Maximum two optimization attempts.

## Metrics
Total/persisted bytes, compacted bytes/share, largest record, compaction count, inline encoded bytes, duplicate blob bytes, fork amplification, tokens/task when available, retries, latency, and task-quality regression rate.

## Verification
Run `python -m unittest tests/test_history_payload_audit.py`. For a real optimization, retain baseline/candidate audit outputs and a required-context fixture. Size reduction alone is insufficient.

## Safety
The included analyzer is read-only. It never rewrites rollout data. Do not delete the latest effective compaction or unique task-required context to meet a budget. Do not repeatedly resend an unchanged over-budget payload.

## Failure handling
Malformed JSONL, unresolved required-context semantics, or hard-budget violations block automated full-history fork. One unchanged transport retry is permitted; optimization attempts are capped at two before escalation.

## Definition of Done
**Implemented:** audit, budgets, workflow, rules, tests, and preflight hook exist. **Measured:** baseline and candidate metrics are captured on the target history. **Verified:** required context remains intact, target token/byte/latency metric improves, tests pass, and no hard budget violation remains.

## Customization
Extend blob detection for non-image binary payloads, add a tokenizer-specific estimator, or integrate the blocking hook with fork/spawn orchestration. Preserve the read-only preflight and independent verification boundaries.