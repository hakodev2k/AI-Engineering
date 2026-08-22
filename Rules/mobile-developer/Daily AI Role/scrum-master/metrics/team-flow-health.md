# Team Flow Health Metrics

Use metrics to ask better questions, not to rank people.

## Core signals
- Work item age: highlight growing uncertainty and hidden blockers.
- Blocked time: measure duration and recurrence by dependency category.
- Review latency: identify queues in code/product/security/QA review.
- WIP: compare active work with finishing capacity.
- Sprint Goal stability: count material goal changes and reasons.
- Carryover rate: investigate causes, never punish the team.
- Improvement-action closure: measure whether retrospectives produce durable change.
- Unplanned work ratio: identify interruption pressure.

## Interpretation rules
Prefer rolling trends and context. A single bad Sprint is a diagnostic trigger, not proof of dysfunction. Never target velocity growth as a goal in itself.

## Suggested alert thresholds
Use `config/role-config.yaml` as defaults and adapt with team context.
