# Threat Model AI System

## Purpose
Build an evidence-based adversarial threat model for an AI application before testing it.

## When to use
Use before a red-team engagement, major model/tool change, or expansion of trust boundaries. Do not substitute it for a full enterprise risk assessment.

## Inputs
Architecture, model/provider details, prompts, tools, data flows, identities, trust boundaries, policies, deployment context, known incidents.

## Preconditions
Obtain authorization, scope, test environment constraints, and named escalation contacts.

## Context to inspect
Trace user input through orchestration, retrieval, model inference, tool execution, storage, output filtering, telemetry, and external integrations. Identify privileged identities and sensitive assets.

## Core knowledge
AI threats combine conventional application abuse with prompt injection, model manipulation, unsafe agency, data exfiltration, retrieval poisoning, excessive permissions, and probabilistic control failures. Threat likelihood depends on reachable capabilities, not merely model behavior in isolation.

## Procedure
1. Define protected assets and unacceptable outcomes.
2. Map actors, entry points, data flows, trust boundaries, models, tools, stores, and external services.
3. Enumerate attacker goals and prerequisite access.
4. Identify abuse paths from untrusted input to sensitive action or disclosure.
5. Record existing preventive, detective, and recovery controls.
6. Rate exploitability, impact, detectability, and blast radius using the organization's risk model.
7. Convert high-value paths into testable hypotheses.
8. Prioritize tests by risk and evidence value.
9. Record assumptions and unknowns explicitly.
10. Review the model with system owners before active testing.

## Decision points
Prefer end-to-end abuse paths when component tests cannot represent composed risk. Use isolated tests when production-like execution could cause side effects. Treat externally controlled content as hostile unless a stronger trust basis is proven.

## Common failure patterns
Testing only jailbreak prompts; ignoring tools and identity; assuming provider controls cover application logic; omitting retrieval ingestion; rating theoretical attacks as exploitable without a path; missing cross-tenant impact.

## Verification
Confirm every high-value asset has plausible threat paths considered, every critical trust boundary has tests or rationale, and owners agree the architecture representation is current.

## Expected output
A scoped threat model, ranked abuse hypotheses, control inventory, assumptions, and red-team test plan.

## Stop conditions
Stop if authorization is unclear, architecture is materially incomplete, testing would cross an unapproved tenant/system, or a newly discovered critical exposure requires immediate containment.