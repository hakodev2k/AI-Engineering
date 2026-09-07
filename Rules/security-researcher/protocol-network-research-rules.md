# Protocol and Network Research Rules

## Purpose
Ensure protocol and network security research is bounded, reproducible, and grounded in actual state-machine and trust-boundary behavior.

## Scope
Applies to custom protocols, network services, parsers, negotiation, authentication, routing interactions, encrypted transports, and stateful message exchanges.

## MUST
- Research MUST document protocol version, transport, endpoint role, authentication state, and relevant negotiation parameters.
- Malformed or adversarial message tests MUST be rate-bounded and isolated from unauthorized peers.
- Claims about parser, state-machine, downgrade, replay, or authentication weaknesses MUST include the message sequence and observable security effect.
- Packet captures and logs MUST redact secrets and unrelated traffic before wider sharing.
- Replay testing MUST use controlled identities and data when possible.
- Cryptographic protocol conclusions MUST account for both primitive choice and how keys, nonces, certificates, transcript state, and downgrade protections are used.
- Network topology assumptions that affect reachability or trust MUST be stated explicitly.

## MUST NOT
- MUST NOT broadcast disruptive test traffic onto shared networks without explicit approval.
- MUST NOT spoof or impersonate third-party systems outside authorized scope.
- MUST NOT conclude that encryption is broken merely because plaintext exists at an authorized endpoint.
- MUST NOT infer protocol guarantees from documentation when implementation behavior contradicts them.
- MUST NOT capture unrelated user traffic beyond what is necessary and authorized.

## SHOULD
- Use protocol-aware harnesses and state coverage when stateless mutation cannot reach meaningful paths.
- Compare implementation behavior with normative protocol requirements where applicable.
- Test failure, renegotiation, timeout, replay, and partial-message conditions relevant to the threat model.

## Exceptions
Tests with realistic congestion, amplification, routing, or interoperability effects require coordinated approval, explicit limits, monitoring, and a stop condition.

## Verification
Review captures, state traces, endpoint configuration, test topology, rate limits, and protocol specifications. Confirm the reported weakness is reproducible from the documented sequence and does not depend on an undeclared lab artifact.