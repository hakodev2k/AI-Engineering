# Agent Control Context Repetition Drift Guard

**Category:** Thinking

## Problem
Long-running agents may receive unchanged high-priority reminders after tool continuations and then repeatedly acknowledge those reminders. The acknowledgements become new history, can reinforce the repetition pattern, and may eventually displace the original user deliverable or promote a temporary review/planning role into the apparent top-level objective.

## Evidence
See `evidence/research.md`. Current signals include an August 2026 Codex report where repeated current-date developer context was echoed across continuations before a temporary review role replaced the implementation objective, a separate layered-instruction meta-work loop, and Claude Code reports where repeated system-reminder injection affected user-message/task interpretation.

## Existing approach
Persistent instructions, repository rules, reminder injection, plans/checklists, and compaction are commonly used to preserve constraints and goals.

## Existing limitations
Those mechanisms preserve visibility but do not prove trajectory integrity. Re-injecting unchanged control text can itself become part of the failure, while model-generated acknowledgements can amplify it.

## Proposed improvement
Maintain explicit observable state for `top_level_goal_id`, `active_subtask_id`, and canonical control-context hashes. Deduplicate unchanged control injection, detect acknowledgement-only loops, block unauthorized goal drift, and require evidence-producing progress after a bounded recovery.

## Package tree
```text
agent-control-context-repetition-drift-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/post-continuation-trajectory-check.md
├── rules/continuation-state.md
├── scripts/control_context_guard.py
├── skills/control-context-drift-analysis.md
├── subagents/trajectory-verifier.md
├── tests/test_control_context_guard.py
└── workflows/detect-recover-verify.md
```

## Installation
Python 3.9+ only; no third-party dependency. Copy the package intact and instrument one JSONL record per continuation.

## Configuration
Thresholds are in `config/policy.json`. Keep `max_goal_drift_events` at zero unless your host has a separate explicit, user-approved goal-change event. Do not remove safety reminders; deduplicate their representation while preserving authority.

## Usage
Example trace record:
```json
{
  "continuation_id": "42",
  "top_level_goal_id": "implement-ticket-123",
  "active_subtask_id": "review-diff",
  "control_hashes": ["sha256:policy-a"],
  "ack_only": false,
  "productive_action": true
}
```
Run:
```bash
python3 scripts/control_context_guard.py trace.jsonl --policy config/policy.json
```
Exit codes: 0 healthy, 3 deduplicate, 4 restore goal, 5 stop, 2 invalid instrumentation.

## Workflow
Use `workflows/detect-recover-verify.md`: Observe → Measure → Diagnose → Hypothesize → Deduplicate/restore → Measure again → independently verify.

## Metrics
Duplicate control injections per window, acknowledgement-only continuations, goal-drift events, productive-action ratio, recovery count, acceptance-evidence coverage, and rework caused by lost requirements.

## Verification
Run:
```bash
python3 -m unittest tests/test_control_context_guard.py
```
The package is **Implemented** when continuation instrumentation and the hook are active; **Measured** when repetition/drift metrics are collected; **Verified** when a fresh post-recovery window maintains the approved goal, remains within repetition thresholds, and increases concrete acceptance evidence.

## Safety
The package never requests hidden chain-of-thought. It uses goal IDs, control hashes, visible summaries, action records, and artifacts. Required security and permission controls remain authoritative; only redundant representation is suppressed.

## Failure handling
Detection comes from the deterministic guard and acceptance evidence. Recovery retries are capped at two. If trace integrity is missing, the fallback is to stop autonomous continuation rather than infer state. Unauthorized goal drift, exhausted recovery, or continuing low productive-action ratio requires escalation to the coordinator/runtime owner.

## Definition of Done
- Current evidence documented.
- Stable goal and subtask IDs established.
- Control context canonicalized/hashes recorded.
- Deterministic guard and tests pass.
- Repeated control injection bounded.
- Unauthorized goal drift produces a blocking decision.
- Recovery attempts bounded to two.
- Required safety controls preserved.
- Acceptance evidence increases after recovery.
- Independent trajectory verification passes.

## Customization
Hosts can define productive-action types appropriate to their workflow: file changes, tests, verified research evidence, deployment checks, or acceptance artifacts. Keep the definition observable and avoid counting commentary, plans, or reminder acknowledgements as productive by default.
