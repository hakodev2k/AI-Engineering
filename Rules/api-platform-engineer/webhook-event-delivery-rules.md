# Webhook and Event Delivery

## Purpose
Provide reliable, secure asynchronous API delivery.

## Scope
Webhooks, callbacks, signatures, retries, ordering, and delivery records.

## MUST
- Outbound webhooks MUST authenticate origin using a documented cryptographic mechanism where confidentiality alone is insufficient.
- Delivery MUST define retry, duplicate, timeout, and ordering semantics.
- Sensitive payloads MUST be minimized and protected in transit.
- Delivery attempts MUST be traceable without logging secrets.

## MUST NOT
- MUST NOT assume exactly-once delivery over an unreliable network.
- MUST NOT retry indefinitely.
- MUST NOT permit arbitrary callback destinations without SSRF-aware validation when destinations are user-controlled.

## SHOULD
- Consumers SHOULD receive event identifiers and timestamps suitable for deduplication.

## Exceptions
Weaker delivery guarantees require explicit documentation and risk review.

## Verification
Test signatures, duplicate delivery, endpoint failure, retry exhaustion, destination validation, and telemetry.