# Multi-Turn Conversation Tuning

## Purpose
Tune models to maintain goals, constraints, references, safety state, and conversational coherence across multiple turns without overfitting to synthetic dialogue patterns.

## When to use
Use when single-turn quality is strong but the model forgets prior constraints, repeats questions, mishandles corrections, persists stale refusals, or loses task state over longer interactions.

## Inputs
Multi-turn transcripts, task-state annotations where available, safety scenarios, user corrections, long-session evaluations, and context/token constraints.

## Preconditions
Conversation data is privacy-reviewed and turn boundaries/system-role semantics match production formatting.

## Context to inspect
Review chat templates, truncation policy, system/developer/user precedence, conversation lengths, synthetic dialogue generators, correction turns, topic shifts, and context packing.

## Core knowledge
Multi-turn tuning teaches state behavior as well as language. Common risks include blindly following the latest turn, over-weighting old context, memorizing synthetic dialogue rhythms, and propagating an early mistake. Training examples should demonstrate state updates, correction acceptance, selective forgetting, and policy consistency. Evaluation must test entire trajectories, not isolated final turns.

## Procedure
1. Define target state behaviors: remember, update, invalidate, clarify, summarize, and terminate.
2. Build trajectories containing constraint changes, corrections, ambiguous references, interruptions, and topic shifts.
3. Include examples where prior assumptions must be discarded after new evidence.
4. Add safety trajectories where benign follow-ups should recover after an earlier refusal.
5. Validate role-token formatting and context truncation exactly as served.
6. Mix short and long conversations so single-turn quality is preserved.
7. Train conservatively and evaluate full trajectories at checkpoints.
8. Score state retention, contradiction rate, repeated-question rate, correction adoption, and task completion.
9. Test paraphrased histories and irrelevant-context injections.
10. Measure behavior near context-window limits and after summarization if used in production.
11. Audit synthetic dialogue artifacts and unrealistic turn-taking.
12. Compare against inference-time memory/summarization solutions before adding more tuning data.

## Decision points
Use tuning for general conversational behavior; use explicit state stores for exact durable facts. Prefer context summarization when token pressure, not behavioral inability, causes forgetting. Do not train the model to treat prior user content as higher priority than governing instructions.

## Common failure patterns
Stale-state persistence; accepting contradictory history without reconciliation; synthetic dialogue cadence; failure to recover after refusal; repeating already answered questions; context truncation mismatch between train and serve.

## Verification
Run trajectory-level evaluations with state assertions at multiple turns, test corrections and topic changes, verify instruction precedence, and compare token-length slices. Confirm single-turn benchmarks remain stable.

## Expected output
A conversation-tuned checkpoint with trajectory metrics, context-length analysis, correction/state-update results, and known memory limits.

## Stop conditions
Stop if privacy requirements are unresolved, role formatting differs from production, long-turn gains cause material single-turn regressions, or failures require deterministic state rather than learned memory.