# Skill: Discover Log Exposure

## Purpose
Find where a change can emit sensitive data into logs, traces, metrics labels, exception payloads, or incident bundles.

## Inputs
Repository, diff/task, logging configuration, representative payload models, tests.

## Preconditions
Repository and relevant configuration are readable.

## Allowed tools
Read/search, static inspection, deterministic scanner, approved local/non-production tests.

## Process
1. Inspect repository structure and changed files.
2. Locate logging/tracing wrappers, middleware, exception handlers, request/response capture, serializers, and telemetry enrichers.
3. Trace values from user/request/database models into log arguments and structured properties.
4. Identify existing redaction/sanitization utilities.
5. Classify candidate fields as credential, direct identifier, network identifier, business-sensitive, or non-sensitive.
6. Locate tests covering affected paths.
7. Capture representative sanitized samples; never copy production secrets into fixtures.
8. Run the deterministic scanner on available samples.
9. Record facts, hypotheses, evidence, and open questions separately.

## Output
Exposure finding, source path, logging sink, sensitive category, evidence, confidence, recommended control, verification target.

## Failure handling
Unknown payload shape is a blocking uncertainty when the change touches that payload. Escalate rather than assume safety.

## Stop conditions
Production-only inspection requiring elevated access, secret retrieval, destructive action, or insufficient evidence to classify exposure.