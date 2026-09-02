# Tracing and Correlation

## Purpose
Enable cross-component investigation of ML requests without requiring sensitive payload capture.

## Scope
Applies to distributed traces, correlation identifiers, inference requests, feature retrieval, model serving, and downstream calls.

## MUST
- Production traces MUST permit correlation across material request stages when failures can cross service boundaries.
- Trace attributes MUST identify relevant model and deployment versions without embedding secrets or prohibited personal data.
- Sampling strategy MUST preserve sufficient evidence for rare critical failures and MUST be documented.
- Trace context propagation failures MUST be detectable for critical paths.

## MUST NOT
- MUST NOT put credentials, authentication tokens, raw sensitive features, or unrestricted prompts and outputs into trace attributes.
- MUST NOT assume absence of traces proves absence of failures.
- MUST NOT use high-cardinality identifiers without assessing telemetry cost and privacy impact.

## SHOULD
- Correlate traces with logs, metrics, deployment events, and evaluation evidence through stable identifiers.
- Use targeted elevated sampling during approved investigations when standard sampling is insufficient.

## Exceptions
Reduced tracing requires documented technical or privacy constraints and an alternative investigation mechanism.

## Verification
Inspect trace schemas, propagation tests, sampling configuration, privacy review, and incident examples demonstrating cross-service correlation.