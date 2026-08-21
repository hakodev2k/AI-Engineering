# Agent Context Runaway Guard

**Category:** Token  
**Run date:** 2026-08-20 (UTC+7)

## Problem
Agent compaction can technically succeed while leaving context so close to the trigger threshold that the next small turn compacts again. Large inline images, tool outputs, duplicates, and persisted payloads are especially dangerous when the estimator budgets mostly text.

## Evidence
See `evidence/research.md`. Current Codex reports include a modern image-heavy session with hundreds of compactions, multi-gigabyte rollout growth, retained base64 payloads, and only a small amount of post-compaction headroom.

## Existing approach and limitations
Automatic compaction and summaries reduce some text, but text-only budgeting, single-threshold triggering, repeated inline payload retention, and lack of post-compaction verification can create a feedback loop. Starting a new session is a workaround, not a durable fix, and can lose task state.

## Proposed improvement
Treat compaction as a measurable engineering operation with hysteresis: measure the real context, preserve a required-facts ledger, reduce high-cost reloadable payloads, then require a materially lower post-compaction utilization and minimum headroom. A deterministic gate prevents endless compact→compact loops.

## Architecture
`context export → profiler → contributor diagnosis → required-facts ledger → bounded reduction → profiler → post-compaction budget gate → independent correctness verification`

## Package tree
```text
README.md
evidence/research.md
config/budget.example.json
skills/context-budget-analysis.md
rules/context-budget.md
subagents/context-verifier.md
workflows/measure-compact-verify.md
hooks/post-compaction.md
scripts/profile_context.py
scripts/check_budget.py
templates/required-facts.md
```

## Installation
Python 3.9+; no third-party packages. Copy the directory into an agent platform repository or CI/diagnostics toolkit.

## Configuration
Edit `config/budget.example.json` for the model context window and workload. Keep the post-compaction target materially below the trigger. The included 70% target and 50k-token minimum headroom are examples, not universal model requirements.

## Usage
Profile an exported context using an actual provider input-token count when available:
```bash
python scripts/profile_context.py session.jsonl --context-window 258400 --estimated-input-tokens 236000 --compactions 4 --turns 20 > profile-before.json
python scripts/check_budget.py --profile profile-before.json --budget config/budget.example.json --phase pre
```

After a bounded reduction:
```bash
python scripts/profile_context.py session-after.jsonl --context-window 258400 --estimated-input-tokens 170000 --compactions 5 --turns 21 > profile-after.json
python scripts/check_budget.py --profile profile-after.json --budget config/budget.example.json --phase post
```

If provider tokens are unavailable, omit `--estimated-input-tokens`; the profiler uses a rough chars/4 estimate for diagnosis only.

## Workflow
Follow `workflows/measure-compact-verify.md`. Freeze `templates/required-facts.md` before reduction. Apply `rules/context-budget.md`. Use `hooks/post-compaction.md` to block automatic continuation when compaction did not create durable headroom.

## Metrics
- Input tokens/task and cost/task when provider data is available.
- Context utilization and headroom.
- Compactions per 10 turns.
- Data-URL/base64 chars, tool-output chars, duplicate chars.
- Session/rollout bytes.
- Compaction and next-turn latency.
- Required-fact retention and task-test regression rate.

## Verification
**Implemented:** profiler, budget gate, hysteresis config, rules, bounded workflow, required-facts template, independent verifier role.  
**Measured:** scripts expose the payload contributors and compare post-compaction state to explicit thresholds.  
**Verified:** only after actual workload before/after provider usage is collected, the post gate passes, required facts remain, and task verification is equal or better.

## Safety and correctness
Never remove acceptance criteria, unresolved blockers, approvals, security boundaries, or verification state merely to meet a token target. Keep full artifacts outside model context when they are needed for audit, and use references/retrieval rather than deleting the source of truth.

## Failure handling
Detection: repeated compaction, failed post gate, lost required fact, or unchanged dominant payload. Evidence: keep before/after profiles and the ledger. Retry policy: at most two reduction attempts per incident. Fallback: verified fresh-context handoff with the ledger and references. Escalation: platform owner when required state cannot fit or measurements disagree. Stop rather than loop indefinitely.

## Definition of Done
- Current public evidence documented.
- Baseline provider/context metrics captured.
- Dominant payload contributors identified.
- Required-facts ledger frozen.
- Reduction strategy implemented without deleting required source data.
- Post-compaction target and minimum headroom pass.
- Payload and frequency budgets pass.
- Task correctness/verification does not regress.
- Independent verifier confirms the comparison.

## Customization
Integrate real tokenizer/provider usage, image token estimation, content-addressed blob storage, retrieval precision metrics, or platform-native compaction APIs. The invariant is more important than the implementation: compaction must create durable measured headroom while retaining correctness-critical state.
