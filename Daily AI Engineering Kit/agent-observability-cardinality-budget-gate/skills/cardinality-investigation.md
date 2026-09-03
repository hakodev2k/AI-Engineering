# Cardinality Investigation Skill

## Purpose
Find and prove observability dimensions that can grow with traffic, users, requests, prompts, documents, paths, exceptions, or arbitrary application data.

## When to use
Telemetry changes, observability cost incidents, series-limit alerts, or suspected high-cardinality regressions.

## Inputs
Repository root, task/change description, policy config, changed files when known, optional telemetry sample/backend evidence.

## Preconditions
Repository is readable; policy JSON is valid; no unapproved dangerous action is required.

## Required context
Repository structure, telemetry initialization, affected producers, direct value sources, and nearby tests. Expand only when evidence requires it.

## Allowed tools
Read/search repository files, run deterministic scripts and non-destructive host checks, inspect non-secret telemetry samples.

## Constraints
Do not mutate code. Do not treat scanner output as confirmed root cause. Do not load secrets or raw sensitive payloads solely for investigation.

## Process
1. Identify telemetry entry points and instrumentation libraries.
2. Locate changed or suspect metrics, spans, and structured logs.
3. Enumerate emitted dimensions at affected call sites.
4. Trace each value to its source.
5. Classify each source as bounded, conditionally bounded, or unbounded.
6. Run `scripts/scan-cardinality.py` and record findings.
7. Run `scripts/analyze-sample.py` when a representative sample exists.
8. Separate facts from hypotheses.
9. Validate one hypothesis at a time using call-site inspection, focused tests, sample data, or backend evidence.
10. Produce a table with producer, dimension, source, expected domain, observed distinct count when available, risk, and evidence.
11. Hand confirmed findings to remediation.

## Expected output
Facts, hypotheses, affected components, dimension inventory, confirmed findings, evidence paths/commands, and unresolved questions.

## Verification
Every confirmed finding identifies the exact producer, dimension, concrete value source, and evidence that the domain is unbounded or exceeds policy.

## Failure handling
Retry a failed tool once only if clearly transient. Insufficient evidence remains `unverified`. Production-only access or permission escalation causes a stop and escalation.

## Stop conditions
All affected dimensions classified; evidence insufficient; approval boundary reached; or blocking environment/permission failure.
