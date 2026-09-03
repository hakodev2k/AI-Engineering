# Skill: Trace Context Investigation

## Purpose
Build an evidence-backed map of trace context across process boundaries before editing code.

## When to use
Broken traces, new outbound calls, message flows, workers, or tracing instrumentation changes.

## Inputs
Repository root, task/incident description, optional trace/log evidence, scanner output.

## Preconditions
Repository is readable; `config/trace-gate.json` validates.

## Allowed tools
Repository search/read, build/test commands, local logs/traces, deterministic scripts in this package.

## Constraints
Do not change code during discovery. Treat scanner findings as hypotheses. Do not expose secrets from telemetry.

## Procedure
1. Identify request/message/job entry points.
2. Identify active tracing abstraction and instrumentation library.
3. Trace inbound carrier extraction and validation.
4. Trace active context creation/selection.
5. Locate outbound HTTP/message/job boundaries.
6. Confirm context injection or framework auto-instrumentation at each boundary.
7. Locate consumer/worker extraction and parent/link semantics.
8. Compare with focused tests or runtime trace IDs when available.
9. Record facts, hypotheses, and open questions separately.
10. Produce a propagation map containing entry, active context, exit carrier, and evidence for every affected boundary.

## Expected output
Boundary map plus ranked findings with evidence and confidence.

## Verification
Every claimed defect must cite code, test output, or trace evidence. Absence of a scanner pattern alone is not proof.

## Failure handling
If instrumentation ownership is unclear, narrow the search to one boundary. If runtime evidence is unavailable, design a deterministic boundary test. Stop if proof would require production mutation.

## Stop conditions
Stop when all affected boundaries are mapped or when a required permission/approval/evidence source is unavailable.