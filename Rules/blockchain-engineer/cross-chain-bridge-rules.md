# Cross-Chain and Bridge Safety

## Purpose
Control trust, replay, finality, and failure risks introduced by cross-chain messaging.

## Scope
Bridges, cross-chain messages, wrapped assets, relayers, validators, and destination execution.

## MUST
- Document the bridge trust model, finality assumptions, validator/admin powers, and asset backing model.
- Bind messages to source chain, destination chain, sender, receiver, nonce, and payload semantics.
- Prevent replay and duplicate execution.
- Define behavior for delayed, reordered, censored, or permanently failed messages.
- Cap exposure where bridge compromise can create unbounded loss.

## MUST NOT
- Treat cross-chain messages as equivalent to local synchronous calls.
- Accept messages from unverified source domains or arbitrary bridge endpoints.
- Assume wrapped assets remain solvent without reconciliation evidence.

## SHOULD
- Add rate limits, pause controls, and independent monitoring for high-value flows.

## Exceptions
Higher trust or concentration risk requires explicit exposure limits and approval.

## Verification
Test replay, duplicate, delay, invalid-source and failure cases; inspect bridge configuration, message domains, limits, and backing reconciliation.