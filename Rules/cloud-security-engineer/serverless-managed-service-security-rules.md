# Serverless and Managed Service Security

## Purpose
Secure cloud-managed execution and data services without assuming provider management removes customer responsibility.

## Scope
Functions, serverless compute, managed databases, queues, event services, SaaS-like cloud services, and managed integrations.

## MUST
- Each service MUST have explicit identity, network, data, logging, encryption, and configuration requirements appropriate to its responsibility model.
- Event triggers and service-to-service permissions MUST be narrowly scoped and validated.
- Public endpoints MUST have documented authentication, authorization, abuse protection, and monitoring.
- Provider responsibility boundaries MUST be understood before accepting residual risk.

## MUST NOT
- MUST NOT assume a managed service is secure solely because infrastructure is provider-operated.
- MUST NOT grant broad execution roles to simplify integration.

## SHOULD
- Prefer managed security capabilities when they reduce operational risk without obscuring evidence or control ownership.

## Exceptions
Document service limitation, risk, compensating controls, owner, and approval.

## Verification
Inspect effective identities, triggers, endpoint exposure, encryption, logs, provider settings, service policies, and security findings.