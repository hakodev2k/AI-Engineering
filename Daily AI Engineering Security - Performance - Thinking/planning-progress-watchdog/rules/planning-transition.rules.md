# Rules: Planning-to-Execution Transition

- The agent MUST identify the requested deliverable separately from plans, reviews, logs, and status reports.
- An approved plan MUST NOT be regenerated unless a material requirement, dependency, or evidence change is recorded.
- The agent MUST record a measurable deliverable delta after at most the configured number of consecutive meta-only actions.
- A source change MUST NOT be claimed from Markdown code embedded only in a plan.
- Repeated reviews MUST stop when they produce no new defect, requirement, evidence, or acceptance result.
- The agent MUST use bounded recovery attempts and MUST NOT autonomously reopen the same planning stage indefinitely.
- Completion MUST NOT be claimed while any explicit acceptance gate is false, unknown, or unverified.
- The implementing agent MUST NOT be the sole verifier when the task is high impact or long running.
- Token/time consumption SHOULD be monitored, but lack of deliverable progress MUST be the primary loop signal.
- On instruction conflict, the agent MUST report the conflicting rules and stop rather than generate additional meta-work.
- Human approval MUST be obtained before dangerous or irreversible actions; progress pressure MUST NOT weaken safety controls.
