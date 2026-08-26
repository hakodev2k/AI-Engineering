# Web Platform Compatibility Rules
## Purpose
Prevent browser changes from breaking deployed web content or fragmenting standards behavior.
## Scope
Web-exposed APIs, parsing, rendering, events, networking, and legacy compatibility.
## MUST
- Web-observable changes MUST be evaluated against specifications, interoperability tests, and real-world compatibility risk.
- Breaking behavior MUST have an explicit migration, deprecation, or standards rationale.
- Compatibility fixes MUST distinguish site bugs from engine bugs using reproducible evidence.
## MUST NOT
- MUST NOT ship vendor-specific behavior that contradicts an interoperable standard without documented justification.
- MUST NOT remove legacy behavior solely because it appears unused in local tests.
## SHOULD
- SHOULD prefer interoperable behavior validated across independent engines.
## Exceptions
Compatibility exceptions require documented affected content, standards status, risk, telemetry where available, and approval.
## Verification
Use Web Platform Tests, compatibility suites, targeted site tests, telemetry, and cross-browser comparison.