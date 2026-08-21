# Engineering Rules

## MUST
- MUST define durable progress independently of assistant prose.
- MUST keep loop detection external to hidden reasoning and based on observable actions/results/state.
- MUST fingerprint normalized tool name + material arguments; volatile timestamps/request IDs MUST NOT create false novelty.
- MUST track the last durable progress marker.
- MUST bound identical-action repetition, unchanged polling, recovery attempts, and automatic continuation after STOP.
- MUST emit machine-readable reasons when WARN or STOP fires.
- MUST distinguish `Implemented`, `Measured`, and `Verified` in reports.
- MUST preserve evidence needed to diagnose the loop without storing secrets unnecessarily.
- MUST require a materially different recovery trajectory before auto-resuming after STOP.
- MUST treat an explicit external blocker as a terminal/wait state rather than synthetic progress.

## MUST NOT
- MUST NOT count statements such as “continuing”, “working”, “I’ll check again”, or a new plan phrasing as progress unless state changes.
- MUST NOT use unlimited retries or unlimited auto-continuation.
- MUST NOT disable the breaker merely because the model says it is not looping.
- MUST NOT stop productive pagination/polling solely because the same tool name repeats; result/state novelty and configured allowance matter.
- MUST NOT silently reset loop counters on compaction, reconnect, subagent handoff, or session resume.
- MUST NOT clear a STOP until a new recovery key and subsequent durable progress are observed.
- MUST NOT expose or request private chain-of-thought as diagnostic evidence.

## SHOULD
- SHOULD start integrations in WARN mode on representative traces before enabling STOP.
- SHOULD record action/result hashes rather than full outputs when full content is unnecessary.
- SHOULD attach progress markers to repository diff/test/task-state events at the host layer.
- SHOULD maintain separate thresholds for polling-heavy workflows.
- SHOULD measure false-stop and missed-loop rates with regression fixtures.
- SHOULD include the repeating trajectory and last progress checkpoint in escalation output.
- SHOULD re-evaluate policy thresholds after material toolset/workflow changes.
