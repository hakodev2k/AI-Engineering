# Rules: Safe Tool Batching

- A baseline MUST be captured before claiming an efficiency improvement.
- Only calls proven independent and non-conflicting MUST execute concurrently.
- Dependent, adaptive, approval-sensitive, wait/resume, or conflicting mutation calls MUST remain sequential.
- A batch MUST be bounded to calls already justified by the task; concurrency MUST NOT expand investigation scope.
- Every result in a partial-success batch MUST be inspected before the next decision.
- The workflow MUST measure outer model cycles separately from nested tool calls.
- Token/cost savings MUST NOT be accepted when required task coverage decreases.
- Security and permission boundaries MUST NOT be weakened to increase batching.
- A regression above configured thresholds MUST block completion until explained or reverted.
- Optimization retries MUST be bounded to two attempts.
- Benchmark comparisons SHOULD use fixed task prompt, repository state, model, reasoning effort, and permissions.
- Mutation-heavy workloads SHOULD use smaller stages and explicit conflict checks.