# Research — Evidence-Backed Completion Gate

## Problem
AI coding agents can report a task as complete without a durable mapping from each requirement to observable proof. This creates false-positive completion: code may exist while tests were not run, a focused test may be misrepresented as full coverage, or an automation may return success while the agent loop is still mid-task.

## Category
**Thinking** — completion judgment, evidence discipline, verification coverage, confidence calibration, and bounded recovery.

## Why it matters now
Autonomous and long-running coding agents increasingly operate with less continuous human supervision. A natural-language final summary is not a sufficient completion contract when downstream automation may merge, deploy, notify, or close work based on it.

## Current public signals

### Signal 1 — Codex request for evidence-backed completion reports
OpenAI Codex issue #36718, opened 2026-08-03, requests a structured mapping from each material requirement to externally inspectable evidence. The reporter specifically distinguishes implemented code, directly verified behavior, inferred behavior, skipped checks, and remaining uncertainty, and notes that users otherwise must reconstruct proof from long transcripts.

Source: https://github.com/openai/codex/issues/36718

Observed implication: current natural-language completion summaries do not reliably encode verification state at requirement granularity.

### Signal 2 — Claude Code assertions without supporting tool output
Anthropic Claude Code issue #72480, opened 2026-06-30, reports repeated claims such as tests passing, services being up, or files containing content without current supporting tool evidence. The user built an adversarial response hook to block unsupported assertions.

Source: https://github.com/anthropics/claude-code/issues/72480

Observed implication: prompt reminders or memory entries alone may not reliably prevent unsupported status claims; deterministic verification at the response boundary is useful.

### Signal 3 — process-level success while the agent is mid-task
Anthropic Claude Code issue #74761, opened 2026-07-06, reports headless runs exiting with code 0 while the transcript ends after `tool_use` and `tool_result`, with no continuation call. Automation consuming only exit status and result JSON therefore sees success although the task is incomplete.

Source: https://github.com/anthropics/claude-code/issues/74761

Observed implication: process success is not equivalent to semantic task completion.

### Signal 4 — repeated demand for per-agent goal verification
Anthropic Claude Code issue #74142, opened 2026-07-05, proposes reusable per-agent/per-phase goal verification with bounded retries because users otherwise hand-roll evaluator loops, retry budgets, and stop conditions.

Source: https://github.com/anthropics/claude-code/issues/74142

Observed implication: verification is currently fragmented and frequently implemented ad hoc at orchestration level.

## Existing approaches
1. Natural-language final summaries such as “implemented” or “all tests pass”.
2. Prompt rules telling the model to verify before claiming completion.
3. Agent self-review or evaluator-agent loops.
4. CI status and process exit codes.
5. Human review of transcripts and diffs.
6. Adversarial output hooks that scan final responses for unsupported claims.

## Observed limitations
- Natural-language summaries blur implementation and verification.
- Prompt-only controls depend on model compliance and can regress across turns/sessions.
- Self-review may share the same assumptions and missing context as implementation.
- Process exit code can indicate infrastructure success rather than task success.
- CI confirms only checks that actually ran; it does not prove every user requirement has evidence.
- Manual transcript review is expensive and difficult after compaction, handoff, or multi-agent execution.
- Hand-rolled evaluator loops vary in schema, retry policy, evidence freshness, and stop conditions.

## Root-cause hypotheses
1. Requirements are not normalized into durable acceptance items before execution.
2. Tool results are treated as transient conversation context rather than structured evidence records.
3. Completion is decided from prose or agent state instead of a machine-checkable evidence ledger.
4. Evidence freshness is not invalidated when relevant files change after a test.
5. Verification breadth is not encoded, so focused and full-suite checks are conflated.
6. Exit status and agent semantic completion are not separated.

These are engineering hypotheses derived from the signals above, not claims made by the issue reporters.

## Improvement target
Introduce a reusable **completion gate** that:
- creates requirement IDs before implementation;
- records file/change evidence and executed validation commands with timestamps and exit codes;
- marks evidence stale when covered files change afterward;
- distinguishes `implemented`, `verified`, `partially_verified`, `blocked`, `not_addressed`, and `unknown`;
- refuses a final `complete` verdict when mandatory requirements lack fresh evidence;
- fails closed when the run ends mid-tool-use or evidence integrity is invalid;
- allows bounded remediation retries and then escalates instead of looping indefinitely;
- emits a concise machine-readable report suitable for humans, CI, and parent agents.

## Success metrics
- Unsupported verified claims: target **0** in the verification corpus.
- Mandatory requirement evidence coverage: **100%** before `complete`.
- Stale evidence accepted as fresh: **0**.
- Mid-task process-success accepted as semantic completion: **0**.
- Verification retry count: bounded by policy, default **2**.
- Completion report parse/schema success: **100%**.
- False blocking rate on known-good fixtures: measured and reviewed before production rollout.

## Observed evidence vs interpretation vs proposed solution
- **Observed evidence:** the four public reports/requests above.
- **Interpretation:** completion state is insufficiently bound to durable, fresh, requirement-level evidence.
- **Proposed engineering solution:** the deterministic evidence ledger and completion gate in this package.

## Research date
2026-08-19 (UTC+7).
