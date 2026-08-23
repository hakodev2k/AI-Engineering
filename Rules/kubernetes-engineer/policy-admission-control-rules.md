# Policy and Admission Control Rules
## Purpose
Prevent unsafe or non-compliant resources from entering clusters.
## Scope
Admission webhooks, policy engines, schema validation, guardrails, and exemptions.
## MUST
- Enforce critical invariant policies at admission when preventive control is reliable and appropriate.
- Test policy changes against representative existing and new workloads before broad enforcement.
- Define failure behavior for admission dependencies and understand availability impact.
- Make exemptions narrow, attributable, reviewed, and time-bounded where practical.
## MUST NOT
- Introduce a blocking admission dependency without an availability and recovery plan.
- Grant blanket policy exemptions to solve isolated incompatibilities.
## SHOULD
- Run new policies in audit/dry-run mode before enforcement when supported.
## Exceptions
Emergency exemptions require explicit approval, documented risk, monitoring, and removal criteria.
## Verification
Inspect policy definitions, webhook configuration, exemption inventory, admission metrics, test suites, and denied-resource evidence.