# Configuration Generation Rules

## Purpose
Make generated network configuration deterministic, minimal, reviewable, and safe.

## Scope
Templates, renderers, serializers, configuration fragments, and full-device generation.

## MUST
- Identical validated inputs and generator versions MUST produce semantically identical output.
- Generated output MUST be syntactically validated before deployment when a parser or validator exists.
- Templates MUST separate data from presentation and MUST make platform-specific behavior explicit.
- Generated changes MUST be diffable against intended or observed baseline before production execution.
- Ordering MUST be stable where device semantics permit it.

## MUST NOT
- MUST NOT embed credentials, environment-specific secrets, or hidden production values in templates.
- MUST NOT use nondeterministic iteration or timestamps in configuration unless operationally required.
- MUST NOT render unsupported commands based solely on approximate platform matching.

## SHOULD
- Generators SHOULD emit the smallest safe configuration delta rather than unrelated churn.
- Golden fixtures SHOULD protect critical rendering behavior across supported platforms.

## Exceptions
A nondeterministic or full-replacement generator requires documented rationale, blast-radius analysis, rollback method, and explicit production approval.

## Verification
Compare repeated renders, parse generated output, run golden tests, inspect diffs for unrelated churn, and test representative platform/version matrices.