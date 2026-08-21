# Investigate and Mitigate Workflow

## Trigger
The same SQL query exhibits material latency/read variance by parameter value or after recompilation/deployment.

## Entry conditions
Query identifier is known; safe benchmark environment or read-only production evidence is available; policy is loaded.

## Inputs
Query text/ID, parameter classes, baseline evidence, repository context, optional Query Store/plans.

## Flow
`Trigger → Evidence → Hypothesis → Benchmark → Mitigation → Review → Verify → Complete`

## Stages
1. **Evidence — Query Evidence Collector**: locate entry point, gather parameter classes, timings, plans, row counts, and competing-cause evidence.
2. **Hypothesis — Performance Investigator**: state falsifiable parameter-sniffing hypothesis and alternatives.
3. **Benchmark — Performance Investigator**: run `scripts/benchmark_parameter_sets.py`; maximum two retries for transient failures.
4. **Decision checkpoint**: stop as inconclusive if fewer than two parameter classes are reproducible or another cause explains the variance better.
5. **Mitigation — Performance Investigator**: select smallest reversible candidate using `skills/mitigation-selection.md`.
6. **Approval checkpoint**: stop for explicit human approval before query hints, forced plan, index/schema changes, production configuration, or any irreversible action.
7. **Verification — Independent Verifier**: repeat parameter matrix; run correctness/build/tests relevant to changed code; compare against thresholds.
8. **Complete**: emit verified result and residual risks.

## Artifacts
Benchmark JSON, evidence ledger, mitigation decision, verifier result.

## Retry rules
Connection/timeouts may retry twice. Benchmark instability may retry twice with evidence preserved. Validation, permission, safety, or business-rule failures are not blindly retried.

## Failure paths
- Permission/environment failure: stop and preserve diagnostics.
- Repeated benchmark variance: mark inconclusive.
- Candidate worsens any class past policy threshold: reject candidate.
- Approval missing: stop before action.

## Definition of Done
Diagnosis is evidence-backed; parameter matrix is reproducible; chosen mitigation is verified or explicitly rejected; approvals are recorded; no blocking failure is hidden; residual risks are documented.
