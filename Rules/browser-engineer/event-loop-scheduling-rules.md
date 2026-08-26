# Event Loop and Scheduling Rules
## Purpose
Preserve web-observable ordering while keeping interactive work responsive.
## Scope
Tasks, microtasks, timers, rendering opportunities, workers, and scheduler integration.
## MUST
- Scheduling changes MUST preserve specified task and microtask ordering.
- Long-running engine work MUST expose cancellation, yielding, or chunking where feasible on interactive paths.
- Timer behavior MUST honor throttling, lifecycle, and privacy constraints.
## MUST NOT
- MUST NOT introduce starvation between task classes without an explicit policy.
- MUST NOT reorder observable callbacks solely for throughput.
## SHOULD
- SHOULD prioritize user-visible responsiveness using measured workload evidence.
## Exceptions
Ordering deviations require specification basis and interoperability review.
## Verification
Use ordering tests, scheduler traces, responsiveness benchmarks, background throttling tests, and worker tests.