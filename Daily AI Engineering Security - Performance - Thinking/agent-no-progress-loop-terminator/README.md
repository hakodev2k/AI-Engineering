# Agent No-Progress Loop Terminator

**Category:** Thinking / Performance  
**Run date:** 2026-08-22 (UTC+7)

## Problem
Tool-using agents can repeat equivalent calls, validation failures, or unchanged recovery attempts until a coarse turn limit is reached. The run keeps spending model/tool calls without producing new evidence or state.

## Evidence
See `evidence/research.md`. Current public signals include LangChain #36139 on progress-aware termination, OpenAI Agents SDK's count-based `max_turns` boundary, and OpenAI Agents SDK #2426 showing a repeated-tool-call failure mode caused by session persistence.

## Existing approach
Frameworks commonly provide hard turn/call ceilings, manual counters, and bug-specific fixes.

## Existing limitations
A count-only ceiling detects the problem late and cannot distinguish a productive multi-step run from repeated equivalent failures. Raw payload comparison also misses semantically identical calls with reordered JSON.

## Proposed improvement
Maintain a deterministic progress ledger. Canonicalize tool calls, classify outcomes/errors, track explicit progress, separately budget transient retries, and return `continue`, `recover`, or `terminate` before the global hard limit is exhausted.

## Package tree
```text
README.md
evidence/research.md
config/policy.json
skills/progress-loop-analysis.md
rules/progress-policy.md
subagents/progress-verifier.md
workflows/detect-recover-terminate.md
hooks/post-tool-progress-check.md
scripts/progress_guard.py
scripts/test_progress_guard.py
tests/cases.json
```

## Installation
Python 3.10+ only; standard library; no network calls or secrets.

## Configuration
Tune `config/policy.json` from measured baseline runs. Keep `max_total_steps` enabled even after progress-aware detection. Add only genuine transient error classes and keep their retry limits bounded.

## Usage
```bash
python3 scripts/progress_guard.py run.jsonl --policy config/policy.json --strict
python3 scripts/test_progress_guard.py
```

## Workflow
Follow `workflows/detect-recover-terminate.md`: baseline stuck and productive trajectories, diagnose repeated signatures, integrate the post-tool hook, measure again on the same fixtures, then obtain independent verification.

## Metrics
Steps-to-stop, tool/model calls avoided, latency avoided, no-progress streak, recovery success rate, and false-positive termination rate.

## Verification
**Implemented:** policy, deterministic guard, rules, workflow, hook, tests, and verifier role exist.  
**Measured:** adopters must record pre/post metrics on representative runs; the package does not claim production savings without those measurements.  
**Verified:** `python3 scripts/test_progress_guard.py` must pass, productive fixtures must not terminate early, stuck fixtures must stop/recover for the expected reason, and an independent reviewer must confirm the hard cap remains active.

## Safety
The guard never weakens approvals, validation, security, or correctness checks to escape a loop. Ambiguous telemetry falls back to the hard step cap rather than inventing progress.

## Failure handling
Detection is deterministic from the event stream. At most two recovery attempts are allowed for a repeated pattern; transient retries have a separate configured cap. If telemetry is invalid, preserve evidence, fall back to the hard cap, and escalate. Never retry indefinitely.

## Definition of Done
- Current evidence documented.
- Baseline captured.
- Equivalent calls canonicalized.
- Explicit progress semantics recorded.
- Stuck fixtures stop earlier than the outer hard limit.
- Productive fixtures complete without false-positive termination.
- All retries remain bounded.
- Test suite and independent verification pass.
- No blocking issue remains.

## Customization
Extend event production to include stable state/evidence fingerprints appropriate to the agent. Do not include secrets in fingerprints; hash sensitive result material before logging.
