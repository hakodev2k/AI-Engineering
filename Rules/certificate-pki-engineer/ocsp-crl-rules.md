# OCSP and CRL Rules

## Purpose
Provide reliable, authentic certificate-status information.

## Scope
CRL generation/distribution, OCSP responders, signing keys, caching, and freshness.

## MUST
- Status artifacts MUST be signed by authorized keys and remain within defined freshness windows.
- CRL distribution points and OCSP endpoints MUST be capacity-planned and monitored.
- Responder signing keys MUST have narrowly scoped usage and lifecycle controls.
- Publication failure MUST generate actionable alerts before stale status becomes systemic.

## MUST NOT
- MUST NOT publish unsigned or unverifiable status data.
- MUST NOT assume responder availability from host health alone.
- MUST NOT extend freshness windows without documented relying-party and risk analysis.

## SHOULD
- Status infrastructure SHOULD tolerate loss of a single serving location where availability requirements justify it.

## Exceptions
Exceptions require quantified availability/security trade-offs and approval.

## Verification
Validate signatures, nextUpdate/thisUpdate behavior, endpoint probes, failover tests, and monitoring history.