# AI Threat Modeling

## Purpose
Identify abuse paths before testing or release.

## Scope
AI systems, models, agents, tools, retrieval, data flows, and integrations.

## MUST
- Define protected assets, trust boundaries, attacker capabilities, entry points, and unacceptable outcomes before high-risk testing.
- Map threats to concrete system components and plausible attack paths.
- Reassess the model after material architecture, model, tool, or permission changes.

## MUST NOT
- Treat generic threat lists as evidence that a system-specific review occurred.
- Exclude human, supply-chain, or third-party boundaries without justification.

## SHOULD
Prioritize threats by plausible impact, exploitability, exposure, and detectability.

## Exceptions
Any reduced-scope assessment requires documented rationale, residual risk, and owner approval.

## Verification
Review the threat model against current architecture, permissions, data flows, and test findings; require traceability from material threats to controls or accepted risk.