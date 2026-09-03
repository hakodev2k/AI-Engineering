# Trace Payload Rules

- Agent telemetry MUST establish a measured baseline before optimization.
- Trace payloads MUST have explicit total-trace, per-span, and per-attribute byte budgets.
- Structural identifiers, timing, status, and error fields MUST NOT be removed merely to save bytes.
- Payload reduction MUST NOT be reported as a performance improvement without before/after measurement.
- Exporter drops or payload-limit failures MUST be surfaced as regressions, not silently ignored.
- Large prompt, tool-output, document, and image attributes SHOULD be summarized, referenced, or selectively retained when diagnostic value can be preserved.
- Sampling MUST NOT be the only mitigation for deterministic oversized spans.
- CI SHOULD fail when configured p95/max payload thresholds are exceeded without an approved exception.
- Optimization loops MUST be bounded to three iterations before escalation/re-evaluation.
