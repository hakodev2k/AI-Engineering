# Trace Verification Skill

## Purpose
Independently determine whether an agent run has enough trustworthy observability evidence to support debugging, audit, and a verified completion claim.

## Inputs
- trace JSONL
- trace policy
- expected workflow stages
- reviewer identity

## Preconditions
The reviewer did not produce all of the evidence being reviewed for high-risk runs.

## Process
1. Validate every event structurally.
2. Group events by `trace_id`, then reconstruct spans by `span_id` and `parent_span_id`.
3. Check stage ordering, terminal events, attempt numbering, approval references, and verification events.
4. Detect orphan spans, duplicate terminal events, impossible durations, missing first-failure evidence, and verification without evidence.
5. Check policy-required stages and required attributes by event type.
6. Run sensitive-key detection against attributes and evidence metadata.
7. Classify findings as `blocking`, `warning`, or `info`.
8. Emit a reviewer record with `verified`, `blocked`, or `observability-incomplete`.

## Expected output
A review record containing trace ID, reviewer ID, findings, evidence references, and status.

## Verification
A `verified` result requires zero blocking findings and a final successful verification event tied to explicit evidence.

## Failure handling
Do not infer missing events. If evidence is unavailable, return `observability-incomplete`.

## Stop conditions
Stop and block if secret leakage is detected, required approval evidence is missing, or the trace claims verification without verification evidence.
