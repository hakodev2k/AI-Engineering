# Compatibility Rules
## Purpose
Protect supported clients, platforms, versions, and integrations from unintended breakage.
## Scope
Browsers, devices, operating systems, API consumers, schemas, file formats, and backward compatibility.
## MUST
- Maintain an explicit supported compatibility matrix for material product surfaces.
- Verify changes against affected supported combinations based on usage and risk.
- Identify breaking changes before release and require approved migration or versioning strategy.
## MUST NOT
- Remove support or change a public contract accidentally.
- Infer compatibility from one representative platform when behavior materially differs across targets.
## SHOULD
- Prioritize combinations using production usage while retaining coverage for contractual support.
## Exceptions
Unsupported combinations may be excluded when support policy is explicit and communicated.
## Verification
Review compatibility matrix, test results, contract diffs, usage data, and migration evidence.