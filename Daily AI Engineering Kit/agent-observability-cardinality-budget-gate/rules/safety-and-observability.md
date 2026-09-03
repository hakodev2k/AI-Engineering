# Safety and Observability Rules

## MUST

- Identify every changed telemetry producer before editing it.
- Classify each changed metric label, span attribute, and structured-log field as bounded, conditionally bounded, or unbounded.
- Preserve evidence showing where each risky value originates.
- Prefer route templates, operation names, enums, buckets, allowlists, and other bounded abstractions over raw identifiers.
- Run `scripts/scan-cardinality.py` after telemetry-related edits.
- Analyze a representative telemetry sample with `scripts/analyze-sample.py` when one is available.
- Preserve host-project build/test output used to support verification.
- Keep facts, hypotheses, and decisions distinct.
- Require independent verification when a confirmed high-cardinality defect was changed.
- Stop before any approval-required action.
- Treat identifiers, prompts, bodies, SQL, exception text, and arbitrary tool/model output as potentially sensitive as well as high-cardinality.

## MUST NOT

- Do not add user IDs, request IDs, session IDs, trace IDs, raw URLs, file paths, exception messages, prompts, completions, SQL, or arbitrary payload values as metric labels.
- Do not create metric names dynamically from request or business data.
- Do not remove useful telemetry solely to make the scanner pass; preserve observability through bounded alternatives when practical.
- Do not weaken thresholds, sampling, retention, exporter policy, privacy controls, or backend limits without explicit human approval.
- Do not infer that a regex finding is a confirmed defect without inspecting the actual call site and value source.
- Do not claim a cardinality issue is fixed because unit tests pass if the changed dimension remains unbounded.
- Do not deploy to production, change production telemetry configuration, modify secrets, alter infrastructure, perform destructive operations, force push/history rewrite, weaken security, break public telemetry contracts, or make large dependency upgrades without explicit approval.
- Do not silently elevate permissions or retry indefinitely.

## SHOULD

- Prefer low-cardinality semantic dimensions already standardized by the codebase or telemetry SDK.
- Convert URL paths to route templates before recording them.
- Bucket numeric values when exact values are not required for analysis.
- Use explicit allowlists for model, provider, tool, status, operation, and feature values when practical.
- Add focused tests that feed many unique inputs and prove the emitted dimension remains bounded.
- Document intentional exceptions with owner, reason, expected cardinality, review point, and evidence.
