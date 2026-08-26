# Data Exfiltration Testing

## Purpose
Evaluate whether adversarial interactions can expose protected information.

## Scope
Prompts, context windows, retrieval stores, tool outputs, memory, logs, caches, connectors, and generated artifacts.

## MUST
- Test cross-user, cross-tenant, hidden-context, retrieval, memory, and tool-mediated leakage where applicable.
- Use synthetic or approved canary data when testing extraction paths.
- Record the exact boundary crossed and data class exposed for each finding.

## MUST NOT
- Introduce real secrets or unnecessary personal data merely to prove exfiltration.
- Publish sensitive extracted material in reports beyond need-to-know evidence.

## SHOULD
Test both direct disclosure and covert transformations that preserve sensitive meaning.

## Exceptions
Use of real sensitive data requires explicit approval and a defined handling and deletion plan.

## Verification
Review canary placement, access controls, attack traces, outputs, and evidence-handling records.