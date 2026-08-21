# Agent Quality Metrics

Measure trends per capability rather than optimizing one vanity score.

## Outcome
- task success rate by task class
- acceptance-criterion pass rate
- human correction rate

## Tool reliability
- tool call success by operation
- invalid-call rate
- duplicate side-effect incidents
- partial-success reconciliation rate

## Recovery
- retry rate by failure class
- successful resume rate
- mean attempts to recovery
- unreconciled state incidents

## Safety / control
- approval-gate compliance
- permission-denied handling correctness
- destructive-action near misses

## Efficiency
- median/p95 task latency
- tool calls per successful task
- token/model cost per successful task

## Orchestration
- delegation success rate
- conflict/rework rate
- verifier rejection rate

A metric is useful only when it leads to a concrete design or operational decision.