# Cross-Browser Compatibility Rules

## Purpose
Ensure automation provides evidence about supported browser behavior rather than assuming one engine represents all supported clients.

## Scope
Applies to browser engines, versions, device profiles, feature differences, and compatibility validation.

## MUST
- The automation matrix MUST reflect the project's declared browser support policy.
- Critical user journeys MUST be exercised on each materially different supported browser engine unless an approved risk-based strategy states otherwise.
- Browser-specific workarounds MUST be isolated, documented, and linked to the behavior that requires them.
- Failures MUST record browser engine, version, platform, and relevant execution configuration.
- Compatibility claims MUST be based on executed evidence, not a single-engine result.

## MUST NOT
- Browser-specific failures MUST NOT be suppressed globally to keep the suite green.
- One browser's implementation details MUST NOT be encoded as universal web behavior without verification.
- Unsupported or obsolete browser versions MUST NOT silently remain in the execution matrix without an ownership decision.

## SHOULD
- Fast feedback SHOULD run a representative subset while broader compatibility coverage runs at an appropriate release cadence.
- Standards-based APIs and accessibility semantics SHOULD be preferred when they improve portability.

## Exceptions
A reduced matrix is acceptable when supported-client telemetry, business requirements, and risk justify it; record rationale and review date.

## Verification
Compare support policy with CI configuration, inspect browser/version metadata in reports, execute critical flows across engines, and review all conditional browser logic.