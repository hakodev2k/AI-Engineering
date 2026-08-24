# Rules — Change Byte Budgets

- A performance change MUST have a measured baseline before optimization.
- File tracking, rendered diff, event payload, log payload, persisted record, and task aggregate SHOULD each have explicit byte budgets.
- A runtime MUST NOT eagerly retain or clone full large-file content merely for change observability when a bounded metadata/reference representation satisfies verification needs.
- Exceeding a budget MUST produce an explicit `elided_due_to_budget` or equivalent marker; silent truncation is forbidden.
- A bounded fallback MUST preserve path, operation type, size, content hash when feasible, and enough evidence to retrieve/verify the change safely.
- Diff algorithm timeouts MUST NOT fall back to an unbounded whole-file textual replacement without a byte cap.
- Debug/trace logging MUST NOT serialize an unbounded diff or file body by default.
- Persisted single-record size MUST be bounded before writing; hydration MUST NOT require loading an arbitrarily large record into memory.
- Multi-agent fan-out SHOULD reference immutable parent artifacts rather than duplicate large history/context blobs into every child.
- Optimization MUST be evaluated with peak RSS, record/event size, and representative completion/review quality.
- The runtime MUST NOT weaken security, auditability, or correctness-critical verification to meet memory targets.
- A package is not `Verified` until before/after measurements show bounded resource use and regression tests pass.
