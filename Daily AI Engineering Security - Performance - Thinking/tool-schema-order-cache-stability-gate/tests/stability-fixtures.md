# Stability Fixtures

## Fixture A — reordered equivalent tools
Create two arrays containing the same tools in opposite order. Expected: `canonicalize_tools.py` emits the same SHA-256 fingerprint.

## Fixture B — reordered nested schema keys
Use equivalent JSON Schema objects with different object-key order. Expected: same fingerprint.

## Fixture C — volatile discovery metadata
Use the same tool set but change `request_id`, `session_id`, `discovered_at`, and `timestamp`. Expected with default behavior: same fingerprint.

## Fixture D — semantic change
Change a tool name, namespace, version, description, parameter type, or required field. Expected: different fingerprint.

## Fixture E — duplicate stable identity
Two tools with identical namespace/name/version. Expected: exit 2 with `duplicate stable tool identity`.

## Runtime benchmark
For representative repeated tasks, capture at least 20 requests before and 20 after when traffic permits. Compare cached-input ratio, uncached input tokens/task, p50/p95 latency, and task/tool-selection correctness. Do not claim success from fingerprint stability alone.

## Acceptance
Equivalent fixture fingerprint match = 100%; semantic-change mismatch = 100%; zero missing required tools; no critical quality regression; measurable improvement in at least one runtime metric without worsening the others beyond the documented budget.
