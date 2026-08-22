# Context Compaction Feedback Loop Guard

## Topic
Context Compaction Feedback Loop Guard

## Category
Token

## Problem
Automatic context compaction can become a token-wasting control loop when a failed or low-progress compaction is retried against substantially the same source state. Long-running agents can repeatedly summarize oversized context, preserve too much tail, retain retry debris, or resume still near the trigger threshold.

## Evidence
See `evidence/research.md`. Current reports from Prime Agent, Hermes Agent, Claude Code, and OpenAI Codex show repeated compaction, insufficient reduction, context-limit failures, and large unproductive token spend.

## Existing approach
Most runtimes trigger compaction near a context threshold, summarize part of history, preserve recent turns, and retry after context-limit failures.

## Existing limitations
A successful summary call is often treated as successful compaction even when the next request remains too large. Retries may reuse the same state, include retry/error artifacts, or run with no meaningful compressible range. Thresholds alone do not guarantee progress.

## Proposed improvement
Treat compaction as a measurable optimization controlled by a source-state fingerprint, minimum progress invariant, bounded attempts, rolling rate limit, retry-debris separation, post-compaction utilization target, and cooldown/manual-recovery circuit breaker.

## Architecture
- `evidence/research.md` documents observed signals and limitations.
- `config/policy.json` defines deterministic retry/progress budgets.
- `skills/compaction-diagnosis.md` provides evidence-driven investigation.
- `rules/compaction-control-rules.md` makes progress and stop conditions enforceable.
- `subagents/compaction-verifier.md` provides independent verification.
- `workflows/detect-break-verify.md` defines the bounded control loop.
- `hooks/pre-compaction-check.md` blocks unsafe/redundant automatic attempts.
- `scripts/compaction_guard.py` makes deterministic decisions from a ledger.
- `tests/test_compaction_guard.py` covers first attempt, low progress, attempt cap, target utilization, and rate limiting.

## Package tree
```text
README.md
config/policy.json
evidence/research.md
hooks/pre-compaction-check.md
rules/compaction-control-rules.md
scripts/compaction_guard.py
skills/compaction-diagnosis.md
subagents/compaction-verifier.md
tests/test_compaction_guard.py
workflows/detect-break-verify.md
```

## Installation
Requires Python 3.10+ and no third-party packages.

## Configuration
Adjust `config/policy.json` only from measured workloads. The defaults allow at most two attempts per unchanged source fingerprint, require at least 20% progress, target 60% context utilization, and impose cooldown/rate limits.

## Usage
Create a JSONL ledger containing compaction attempts and their source fingerprint plus before/after token counts, then run:

```bash
python3 scripts/compaction_guard.py decide ledger.jsonl --policy config/policy.json --context-limit 400000
```

For deterministic replay, pass `--now <unix-seconds>`.

Run tests:

```bash
python3 -m unittest tests/test_compaction_guard.py -v
```

## Workflow
Follow `workflows/detect-break-verify.md`: Detect → Measure → Diagnose → Form hypothesis → Apply bounded controller → Measure next request → Cooldown/manual recovery if insufficient → Independent verification.

## Metrics
Track attempts per fingerprint, compactions per 10 minutes, pre/post tokens, progress ratio, post-compaction utilization, failed/insufficient compaction token spend, retry-debris size, compressible/protected ratio, and required-context retention.

## Verification
The guard must stop repeated low-progress attempts in replay while retaining required active-task fixtures. Actual provider usage should be used when available; estimate-only results must remain labeled estimates.

## Safety
The package never recommends dropping correctness-critical context solely to save tokens. It preserves the current session when the circuit opens and selects explicit recovery rather than silent truncation. Sensitive session content should be hashed/redacted in diagnostic ledgers.

## Failure handling
Malformed accounting blocks automatic compaction. Low progress opens cooldown. Reaching the same-fingerprint attempt cap requires manual/new-session recovery. Benchmark/accounting retries are bounded. The fallback preserves current state and diagnostic evidence instead of weakening thresholds or deleting required context.

## Status model
- **Implemented**: controller and hook integrated; deterministic tests pass.
- **Measured**: real/synthetic timelines include pre/post metrics and compaction token spend.
- **Verified**: independent replay proves bounded attempts, required-context retention, and supported token savings/no-progress prevention.

## Definition of Done
Evidence documented; baseline captured; source fingerprinting works; token buckets measured; root cause supported; controller integrated; loop fixture is bounded; successful compaction path passes; required context retained; before/after metrics recorded; independent verification passes; no blocking regression remains.

## Customization
Integrations may enrich ledger events with provider-specific token buckets, image counts, reasoning/tool-envelope sizes, retry-debris counts, and actual usage. Keep the decision interface stable so the controller remains independently testable.
