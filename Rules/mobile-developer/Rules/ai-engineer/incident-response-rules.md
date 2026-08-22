# AI Incident Response Rules
## Purpose
Provide disciplined response to harmful, incorrect, unavailable, or uncontrolled AI behavior.
## Scope
Safety incidents, data exposure, prompt injection, provider outages, runaway cost, quality regressions, and tool-action failures.
## MUST
- Define severity, ownership, containment, evidence preservation, communication, and recovery steps for material AI incidents.
- Preserve relevant model, prompt, retrieval, tool, configuration, and deployment versions during investigation.
- Contain unsafe behavior before pursuing optimization or cosmetic fixes.
- Base root-cause conclusions on logs, traces, reproductions, provider evidence, and evaluation results.
## MUST NOT
- Hide or discard incident evidence to make metrics appear healthier.
- Restore a failed configuration without verifying the corrective action.
## SHOULD
- Convert confirmed incident causes into regression tests, guardrails, monitoring, or operational changes.
## Exceptions
Emergency containment may precede full diagnosis when user or system harm is ongoing.
## Verification
Review incident records, timelines, evidence, containment actions, regression tests, and follow-up completion.