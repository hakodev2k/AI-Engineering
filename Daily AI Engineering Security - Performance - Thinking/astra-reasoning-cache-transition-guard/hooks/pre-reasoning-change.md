# Hook: Pre-Reasoning-Change Cache Gate

## Trigger
Before enabling or shipping a dynamic reasoning-effort transition in a long-running GPT-6 Astra flow.

## Preconditions
Representative telemetry exists with at least three baseline turns, a quality oracle is defined, and the intended transition representation is observable.

## Action
Block rollout unless the proposed change is represented by the compatible cache-preserving transition path and the measured post-change behavior passes configured thresholds.

## Script / command
`python scripts/cache_transition_analyzer.py --events <events.jsonl> --thresholds <thresholds.json> --output <report.json>`

Then run:
`python -m unittest tests/test_cache_transition_analyzer.py`

## Expected result
Analyzer exit code 0, report status `verified`, quality passing, and unit tests passing.

## Failure behavior
- Exit 2: block rollout as a measured regression or forbidden transition representation.
- Exit 3: block as incomplete/invalid evidence.
- Unit-test failure: block until deterministic verification is repaired.
- Maximum two evidence-backed rework/retest cycles; persistent failure escalates.

## Blocking
Yes for claims that the transition is token/cache optimized. The hook MUST NOT permit context removal, quality relaxation, or threshold widening solely to obtain a pass.
