# Forensic Tool Validation Rules

## Purpose
Prevent forensic conclusions from depending blindly on tool behavior.

## Scope
Applies to acquisition, parsing, carving, recovery, timeline, memory, mobile, cloud, and reporting tools.

## MUST
- Tool name, version, configuration, and relevant modules MUST be recorded for reproducible work.
- Tools used for material findings MUST have validation evidence appropriate to the artifact and use case.
- Unexpected output MUST be investigated against raw evidence or an independent method.
- Tool upgrades that can alter parsing or acquisition results MUST be evaluated before case-critical use.
- Known limitations affecting conclusions MUST be reported.

## MUST NOT
- MUST NOT treat vendor reputation as validation.
- MUST NOT suppress parser errors or warnings that may affect evidence.
- MUST NOT claim exactness beyond a tool's demonstrated capability.

## SHOULD
- Maintain representative test corpora with known expected results.
- Cross-validate high-impact artifacts using independent implementations.

## Exceptions
A novel tool may be used when no validated alternative exists if test evidence, limitations, corroboration, and review are documented.

## Verification
Inspect validation records, test corpus results, version history, configuration, error logs, and cross-tool comparisons for material findings.