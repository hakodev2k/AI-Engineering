# Research

## Topic
A2A Agent Card prompt-boundary enforcement

## Category
Security

## Problem
A client can discover an Agent Card from a remote A2A server and interpolate server-controlled `description` or skill prose into an LLM prompt. If that prose is treated as instructions rather than data, the remote server gains an instruction-injection channel.

## Why it matters now
A concrete report was opened against the official A2A samples on 2026-08-09, while A2A adoption and client SDK validation work are actively evolving. The same Agent Card object also carries URLs and security metadata, so applications already need a validation boundary; prompt-role isolation belongs at that boundary.

## Affected users
A2A client developers, agent gateways, multi-agent orchestrators, enterprise platform teams, and users connecting to third-party agents.

## Current public evidence

### Observed evidence
1. A2A samples issue #687, opened 2026-08-09, reports that the `no_llm_framework` sample renders discovered Agent Card `description` and `skills` directly through a Jinja template into the LLM prompt and provides a reproduction with instruction-like remote metadata. https://github.com/a2aproject/a2a-samples/issues/687
2. A2A Python issue #975 documents the lack of a general Agent Card validation hook for untrusted cards; issue #1023 tracks reusable URL validation infrastructure for Agent Card and webhook SSRF protection. https://github.com/a2aproject/a2a-python/issues/975 and https://github.com/a2aproject/a2a-python/issues/1023
3. The A2A specification states that Agent Cards may be signed and clients should verify signatures when present, and advises HTTPS for authenticity/integrity. Those controls authenticate card provenance but do not declare remote prose safe as model instructions. https://a2a-protocol.org/dev/specification/

### Interpretation
The recurring architectural gap is not only escaping template syntax. The core trust error is role confusion: authenticated remote metadata can still be adversarial content. A safe client needs provenance, explicit data-role rendering, bounded content, URL validation, and action-time authorization independent of what the remote card says.

## Existing approaches
- HTTPS and optional JWS Agent Card signatures.
- Agent Card schema validation.
- SDK/client URL validation work for SSRF.
- Authentication/security requirements advertised by Agent Cards.
- Application-specific prompt templates.

## Remaining limitations
- Origin integrity does not imply instruction trust.
- Schema validity does not constrain semantic prompt-injection content.
- Escaping Jinja/JSON syntax does not stop natural-language instruction injection.
- A single generic trust decision can accidentally authorize both network access and privileged prompt placement.
- Pattern detectors have false positives/negatives and therefore cannot be the sole security boundary.

## Root-cause analysis
1. Remote metadata is mixed into model instructions without an explicit trust type.
2. Discovery, display and LLM-consumption paths reuse the same strings without role-specific policy.
3. Integrity/authentication controls are conflated with semantic authorization.
4. Clients lack deterministic preflight limits and provenance assertions before prompt construction.

## Improvement opportunity
Create a reusable pre-consumption gate: validate structure/URLs, bound remote prose, flag instruction-like content, attach provenance, and require downstream templates to place fields only in an untrusted-data section. Verify with adversarial cards and integration checks on final message roles.

## Relevant sources
- https://github.com/a2aproject/a2a-samples/issues/687
- https://github.com/a2aproject/a2a-python/issues/975
- https://github.com/a2aproject/a2a-python/issues/1023
- https://a2a-protocol.org/dev/specification/
