# Secure Integration Architecture

## Purpose
Design secure trust boundaries for APIs, messaging, webhooks, file exchange, partner connectivity, and third-party services.

## When to use
Use when systems exchange data or commands across organizational, network, tenant, or platform boundaries.

## Inputs
Integration contracts, identities, data classifications, protocols, retry behavior, trust model, availability requirements, third-party constraints.

## Preconditions
The producer, consumer, data sensitivity, and intended trust relationship are known.

## Context to inspect
Authentication methods, authorization scope, certificates, API gateways, brokers, webhook verification, queues, file-transfer mechanisms, rate limits, and audit logging.

## Core knowledge
Integrations must authenticate both parties where appropriate, constrain authorization, validate data, limit replay, protect confidentiality and integrity, and fail safely. Reliability mechanisms can create security problems when retries or dead-letter handling duplicate sensitive actions.

## Procedure
1. Define the trust boundary and protected operations.
2. Choose mutually appropriate identity and authentication mechanisms.
3. Restrict authorization to required resources and actions.
4. Protect transport and message integrity.
5. Validate schemas, size limits, and accepted content types.
6. Design replay resistance, idempotency, timeout, and retry behavior.
7. Define rate limits and abuse protections.
8. Secure dead-letter, error, and fallback paths.
9. Add audit events and third-party failure monitoring.
10. Test revocation and dependency outage scenarios.

## Decision points
Prefer asynchronous messaging when decoupling and durability matter, but account for replay and duplicate delivery. Use signed webhooks when callbacks cross untrusted networks.

## Common failure patterns
Shared static credentials, overbroad scopes, trusting internal callers, unsigned callbacks, retry storms, and sensitive payloads in error logs.

## Verification
Test positive and negative authentication, authorization, malformed payloads, retries, duplicate delivery, revocation, and outage behavior.

## Expected output
A secure integration pattern with trust assumptions, controls, failure semantics, and verification criteria.

## Stop conditions
Stop when the external party cannot meet minimum trust requirements or the integration contract is too ambiguous to define safe behavior.