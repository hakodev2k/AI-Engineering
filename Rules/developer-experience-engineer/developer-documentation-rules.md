# Developer Documentation Rules
## Purpose
Keep operational developer guidance accurate, discoverable, and verifiable.
## Scope
Setup guides, runbooks, tool references, troubleshooting, migration guides, and examples.
## MUST
- Documentation for critical workflows MUST identify prerequisites, commands, expected results, and failure recovery.
- Behavioral changes MUST update affected documentation in the same change or through an explicitly tracked dependency.
- Examples MUST use safe placeholder values and supported interfaces.
- Time-sensitive guidance MUST identify version or applicability boundaries.
## MUST NOT
- MUST NOT publish real credentials, internal secrets, or sensitive production data.
- MUST NOT document commands known to be destructive without prominent safeguards and approval requirements.
- MUST NOT treat stale documentation as authoritative over verified runtime behavior.
## SHOULD
- Documentation SHOULD be tested or linted where practical.
- Troubleshooting SHOULD start from observable symptoms and evidence.
## Exceptions
Temporary gaps require owner, scope, risk, workaround, and remediation tracking.
## Verification
Run documented commands in representative environments, lint links/examples, review diffs with behavior changes, and analyze support/search failure signals.