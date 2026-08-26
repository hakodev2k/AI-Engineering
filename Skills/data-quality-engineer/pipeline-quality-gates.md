# Pipeline Quality Gates

## Purpose
Place enforceable quality checks at pipeline boundaries so defective data is prevented from propagating when the risk justifies blocking.

## When to use
Use around ingestion, transformation, publication, migration, and critical handoff stages.

## Inputs
Pipeline DAG, contracts, quality rules, failure impact, retry behavior, recovery procedures, and consumer SLOs.

## Preconditions
Every blocking gate needs an owner, diagnostic evidence, and a safe recovery path.

## Context to inspect
Inspect orchestration, transactional boundaries, partial writes, retries, checkpoints, downstream triggers, backfills, and alert routing.

## Core knowledge
Not every failed check should stop a pipeline. Gate policy should distinguish critical correctness violations, quarantinable records, warnings, and informational drift.

## Procedure
1. Map propagation boundaries and blast radius.
2. Rank rules by confidence and severity.
3. Select the earliest reliable enforcement point.
4. Define pass, warn, quarantine, and fail behaviors.
5. Make checks deterministic and idempotent where possible.
6. Preserve failed evidence without leaking sensitive data.
7. Prevent downstream publication on critical failure.
8. Define retry and manual override policy.
9. Test partial failure and restart behavior.
10. Instrument gate duration and failure rate.
11. Review gates that frequently block legitimate data.

## Decision points
Block only when publishing is riskier than delay. Quarantine when defective records can be isolated without corrupting aggregates. Warn when confidence is insufficient for enforcement.

## Common failure patterns
Failing on noisy anomaly detectors; gates after downstream publication; infinite retries; manual bypass with no audit; checks that mutate data; expensive full scans on every micro-batch.

## Verification
Fault-injection confirms critical defects stop publication, quarantined data is isolated, recovery is idempotent, and valid data proceeds within SLO.

## Expected output
Quality gates with severity policy, diagnostics, recovery workflow, observability, and tested enforcement behavior.

## Stop conditions
Escalate when no safe rollback/recovery exists, a gate could create unacceptable availability impact, or rule confidence is inadequate for blocking.