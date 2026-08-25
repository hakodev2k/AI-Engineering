# Cryptographic Protocol Review

## Purpose
Review a cryptographic protocol for composition errors, authentication gaps, replay, downgrade, state confusion, and unsafe assumptions.

## When to use
Use for new protocols, extensions to standardized protocols, security-sensitive message exchanges, or interoperability changes.

## Inputs
Protocol specification, state machine, message formats, threat model, key schedule, identities, and implementation behavior.

## Context to inspect
Transcript construction, roles, negotiation, versioning, key confirmation, replay state, error messages, time assumptions, and downgrade paths.

## Core knowledge
Secure primitives can compose into insecure protocols. Reviews must reason about identities, roles, transcript binding, freshness, key separation, state transitions, and adversarial message ordering.

## Procedure
1. Restate security goals and attacker capabilities.
2. Draw actors, trust boundaries, and protocol states.
3. Enumerate every message and authenticated field.
4. Trace key establishment and derivation.
5. Verify role, identity, context, and transcript binding.
6. Analyze replay, reflection, reordering, truncation, and downgrade.
7. Check error behavior and oracle exposure.
8. Test state-machine violations and duplicate messages.
9. Prefer replacing custom mechanisms with standardized protocols.
10. Document residual assumptions and independent review needs.

## Decision points
Extend a standard only when its extension points preserve security invariants; otherwise select a protocol designed for the requirement. Add explicit key confirmation when the chosen protocol and threat model require it.

## Common failure patterns
Unauthenticated negotiation; role confusion; missing transcript fields; same keys both directions; replayable commands; custom handshakes; accepting messages in invalid states.

## Verification
Use adversarial test cases, protocol traces, implementation/state-machine tests, and formal analysis where risk justifies it.

## Expected output
A protocol security review with invariants, attack scenarios, findings, required changes, and test evidence.

## Stop conditions
Stop and escalate if the design invents novel cryptography for high-impact use or security goals cannot be stated precisely.