# Skill: Control Context Drift Analysis

## Purpose
Detect when unchanged high-priority context, reminders, or their acknowledgements are becoming a self-reinforcing trajectory that displaces the user's requested deliverable.

## Trigger
Tool-heavy continuations, repeated reminders, meta-commentary without progress, subagent return, compaction, or role/objective drift.

## Inputs
Observable continuation trace with goal/subtask IDs, control-context hashes, acknowledgement-only flag, and productive-action flag.

## Preconditions
The host must assign a stable top-level goal ID and explicit active-subtask ID. Control text should be hashed after canonicalization.

## Allowed tools
Trace/log inspection, deterministic hashing, `scripts/control_context_guard.py`, plan/task state readers.

## Constraints
Do not request hidden chain-of-thought. Do not infer goal drift from wording alone when explicit state contradicts it. Do not remove required safety constraints to reduce repetition.

## Procedure
1. Capture the top-level goal and acceptance criteria as an immutable reference ID.
2. Hash stable control items and record the first injection event.
3. For each continuation, record active subtask, injected hashes, whether the assistant merely acknowledged control context, and whether an evidence-producing action occurred.
4. Analyze the latest configured window with the guard script.
5. On `deduplicate`, stop re-injecting unchanged control blocks and use references/IDs instead.
6. On `restore_goal`, restore the original goal ID and acceptance criteria, demote the current role/subtask to its proper scope, then require the next action to advance a deliverable or verification artifact.
7. On `stop`, do not automatically continue. Record the no-progress evidence and escalate.
8. After recovery, analyze a fresh window; maximum two recovery attempts.

## Decision points
- Repeated control hash without text echo but with productive progress: deduplicate host injection, no goal reset needed.
- Acknowledgement-only turns above threshold: suppress acknowledgement pattern and require action/evidence.
- Goal ID changes without an explicit user-approved goal change: restore goal immediately.
- Low productive-action ratio after recovery: stop.

## Expected output
Facts, detected repetition, goal continuity status, decision, recovery action, metrics, and verification state.

## Metrics
Duplicate injections, acknowledgement-only rate, goal drift events, productive-action ratio, and rework events.

## Verification
The recovery is verified only when a subsequent window has stable goal identity, bounded control injection, and evidence-producing progress toward the original acceptance criteria.

## Failure handling
If trace fields are missing, fail closed for autonomous continuation and request runtime instrumentation rather than guessing.

## Stop conditions
Maximum two recoveries; any unauthorized top-level goal change; continued low productive-action ratio; or any recovery that would drop a required safety constraint.
