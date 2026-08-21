# Agent Observability Trace Governance

## MUST
- Every logical run MUST have one stable `trace_id`.
- Every span MUST have a unique `span_id`; child work MUST carry `parent_span_id`.
- Every started stage/tool span MUST end with a terminal state or explicit `unknown`/`abandoned` state.
- Retries MUST create new attempts and preserve the first failure evidence.
- Approval-required actions MUST reference an approval event bound to the same trace/action scope.
- `verified` MUST be backed by explicit verification events and evidence references.
- Tool/event attributes MUST be redacted before persistence.
- High-risk runs MUST be reviewed by an identity different from the primary executor.
- Exporter failure MUST preserve local buffered trace evidence when possible.

## MUST NOT
- Do not log raw secrets, bearer tokens, cookies, private keys, connection strings, passwords, or full sensitive request/response bodies.
- Do not overwrite failed attempts when a retry succeeds.
- Do not mark a task verified merely because the command/tool returned exit code 0.
- Do not reuse a `span_id` across retries.
- Do not fabricate missing timestamps, approvals, verifier identities, or evidence.
- Do not silently drop blocking observability findings.
- Do not increase tool permissions to collect richer traces.

## SHOULD
- Prefer fingerprints, counts, status codes, bounded excerpts, and artifact references over full payloads.
- Buffer traces locally before optional export.
- Use monotonic attempt numbers per logical operation.
- Correlate repository revision, workflow version, model/tool identifiers, and environment when available and non-sensitive.
- Keep the core contract vendor-neutral; isolate exporter-specific fields in `attributes.exporter`.
