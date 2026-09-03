# End-to-End Workflow

## Trigger
Telemetry-related code change, observability cost/series incident, high-cardinality alert, or request to verify bounded telemetry dimensions.

## Entry conditions
Repository readable; policy exists; task scope known; no dangerous action implicitly authorized.

## Inputs
Repository root, task/change description, changed files/diff when available, optional JSONL telemetry sample, policy.

## Stages

1. **Preflight — Repository Explorer**: validate inputs/policy, record repository state. Stop on invalid input or permission failure.
2. **Context — Repository Explorer**: locate instrumentation and affected producers; trace dimension sources and tests; separate facts/hypotheses.
3. **Deterministic assessment — Repository Explorer**: run scanner and sample analyzer when available; treat findings as leads requiring context.
4. **Plan — Implementation Agent**: choose smallest bounded representation and focused checks. Stop for approval if remediation crosses protected boundaries.
5. **Execute — Implementation Agent**: edit minimally; add tests; run formatter/linter, tests/build, scanner/sample analysis; inspect diff.
6. **Verify — Verification Agent**: independently reconstruct claim, rerun checks, validate evidence, set `verified`, `blocked`, or `failed`.
7. **Complete**: only `verified` satisfies Definition of Done; `executed` alone does not.

## Produced artifacts
Producer/dimension map, scan JSON, optional sample JSON, host test/build output, diff review notes, evidence JSON.

## Checkpoints
Preflight before edits; plan before changes; deterministic checks after edits; independent verification before completion.

## Retry rules
Maximum implementation retries: **2 total**. Retryable: localized test failure caused by remediation, incomplete normalization finding, formatting/lint failure, or clearly transient tool failure. A tool itself may be retried once if transient. Preserve failing command, exit code, output artifact, diff, scan/sample report, and revised hypothesis on every attempt.

## Stop conditions
Permission denial requiring elevation, missing approval, ambiguous public telemetry contract, destructive/production-only requirement, invalid business requirement, exhausted retry budget, or unrecoverable environment failure.

## Approval points
Production deployment/configuration, retention/sampling/exporter change, infrastructure/secret change, destructive action, security weakening, force push/history rewrite, breaking telemetry contract, or large dependency upgrade.

## Failure paths
Validation failure stops before edits. Missing sample allows continuation only if focused tests prove boundedness; otherwise verification is blocked. Unattributable baseline build/test failure is preserved and escalated. Approval-required action stops before execution.

## Definition of Done
Affected producers mapped; dimensions classified; confirmed defects minimally remediated; focused verification exists; deterministic gate passes or findings are legitimately explained; sample analysis passes when applicable; host checks pass; evidence validates; independent verifier returns `verified`; remaining risks recorded; no pending approval/blocker remains.
