# App Integrity and Abuse Rules
## Purpose
Limit abuse from tampered clients, automation, replay, and unofficial distributions without trusting the device as a secure authority.
## Scope
Integrity signals, attestation, replay prevention, rate limiting, fraud controls, and tamper resistance.
## MUST
- High-value server operations MUST enforce authorization and abuse controls independently of client UI restrictions.
- Integrity/attestation signals MUST be treated according to documented reliability and fallback policy.
- Replay-sensitive operations MUST use server-verifiable freshness, nonce, idempotency, or equivalent controls.
## MUST NOT
- Root/jailbreak detection or obfuscation MUST NOT be the sole security boundary for valuable assets or actions.
- Legitimate users MUST NOT be permanently locked out solely by a weak integrity heuristic without an approved policy.
## SHOULD
- Abuse defenses SHOULD combine server telemetry, rate controls, protocol design, and device signals proportionate to risk.
## Exceptions
Low-risk public operations may accept minimal integrity controls.
## Verification
Test replay, modified clients where feasible, failed attestation, automation, rate limits, false-positive handling, and server authorization.