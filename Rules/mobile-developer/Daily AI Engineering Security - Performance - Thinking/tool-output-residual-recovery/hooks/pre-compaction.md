# Hook — Pre Compaction Evidence Check

## Trigger
Before compaction, history truncation, session handoff, or any operation that may remove full tool outputs from model-visible context.

## Preconditions
The host can enumerate tool results relevant to unfinished decisions.

## Action
For each relevant tool result:
1. determine whether exact evidence is already durable;
2. if not, run `python scripts/residualize_output.py capture ...`;
3. validate the generated residual;
4. retain the residual identifier/hash and unresolved evidence requirement in the checkpoint.

## Expected result
Every exact-output dependency required after compaction has a valid durable residual.

## Failure behavior
Retry persistence once. If required evidence still cannot be persisted, block compaction or clearly terminate the task with an evidence-persistence failure.

## Blocking
Yes when unfinished work depends on exact output that would otherwise become unavailable. No for tool output proven irrelevant to remaining work.