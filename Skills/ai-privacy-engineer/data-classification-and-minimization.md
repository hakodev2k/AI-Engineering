# Data Classification and Minimization

## Purpose
Reduce privacy exposure by identifying which data is truly necessary for an AI capability and enforcing collection, transformation, and retention rules proportionate to that need.

## When to use
Use when designing datasets, prompts, telemetry, feature pipelines, RAG corpora, evaluation sets, analytics, or user-facing AI features. Re-run when scope, model provider, or data source changes.

## Inputs
- Intended AI use case and acceptance criteria
- Candidate data fields and schemas
- Training/inference/evaluation pipelines
- Retention requirements
- Security and legal constraints

## Context to inspect
Inspect raw ingestion, preprocessing, labels, metadata, prompts, tool calls, embeddings, generated outputs, traces, analytics events, and downstream exports.

## Core knowledge
Minimization applies to collection, granularity, purpose, access, and duration. Removing explicit identifiers is insufficient if quasi-identifiers, free text, embeddings, or linked metadata can re-identify individuals. Senior review should distinguish necessary data from merely convenient data and should favor purpose-bound transformations over broad copying.

## Procedure
1. Define the minimum information required to achieve the product objective.
2. Inventory collected and derived fields.
3. Classify direct identifiers, quasi-identifiers, sensitive attributes, free text, secrets, and low-risk operational data.
4. Challenge each field for necessity, precision, frequency, and retention duration.
5. Remove fields with no defensible purpose.
6. Reduce precision where exact values are unnecessary.
7. Tokenize, pseudonymize, aggregate, redact, or hash where compatible with the use case.
8. Separate identity data from model features when practical.
9. Restrict sensitive fields from prompts, logs, traces, and third-party APIs unless required.
10. Define retention and deletion rules per class.
11. Add automated schema or policy checks where feasible.
12. Measure model utility after minimization to validate the trade-off.

## Decision points
Prefer aggregation over row-level data when individual-level behavior is unnecessary. Prefer ephemeral processing over persistence when data is needed only transiently. Do not use irreversible hashing as a blanket anonymization claim when small domains or linkable metadata permit reversal by inference.

## Common failure patterns
- Collecting data because it may be useful later
- Copying full production records into ML datasets
- Sending complete documents when only excerpts are required
- Persisting prompts or traces indefinitely
- Ignoring free-text sensitivity
- Breaking model quality without measuring the impact of minimization

## Verification
Compare pre- and post-minimization schemas, inspect representative requests, validate redaction in logs and provider payloads, test retention jobs, and measure required model-quality metrics.

## Expected output
A classified data inventory, minimization decisions, approved transformations, retention limits, enforcement controls, and measured utility impact.

## Stop conditions
Escalate if necessity cannot be justified, sensitive data is required without approved controls, or minimization materially changes a regulated or high-impact decision process.