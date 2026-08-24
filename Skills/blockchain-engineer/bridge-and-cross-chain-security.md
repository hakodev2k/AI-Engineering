# Bridge and Cross-Chain Security

## Purpose
Design and review cross-chain asset/message flows with explicit verification, replay, finality, custody, and failure assumptions.

## When to use
Use for bridges, cross-chain messaging, omnichain assets, remote governance, and settlement across chains.

## Inputs
Source/destination chains, bridge/messaging protocol, asset model, finality assumptions, relayers/validators, recovery requirements.

## Preconditions
The trust and verification model of each cross-chain component is documented.

## Context to inspect
Message identifiers, source-chain proofs, validator sets, relayer permissions, mint/burn/lock logic, replay protection, rate limits, pause controls, chain reorg behavior.

## Core knowledge
Cross-chain systems compose multiple security domains. The effective security is often bounded by the weakest verifier, signer set, custody contract, or finality assumption.

## Procedure
1. Map every trust boundary from source action to destination effect.
2. Define canonical message identity and replay domain.
3. Determine when source events are final enough for destination execution.
4. Validate chain IDs, sender contracts, domains, and payload integrity.
5. Model duplicate, delayed, reordered, and conflicting messages.
6. Review asset conservation across lock/mint or burn/release flows.
7. Add rate limits and pause controls for high-value pathways.
8. Define recovery for stuck or partially executed messages.
9. Test reorg, validator/relayer outage, and replay scenarios.
10. Monitor outstanding value and anomalous message activity.

## Decision points
Prefer canonical/native verification when available; accept externally validated bridges only when their trust assumptions fit value at risk.

## Common failure patterns
Assuming instant finality, missing replay domains, privileged relayer bypasses, inconsistent asset accounting, and unlimited bridge throughput.

## Verification
Cross-chain integration tests prove uniqueness, conservation, authorization, and recovery under delayed/replayed messages.

## Expected output
Trust model, message lifecycle, asset accounting model, rate-limit policy, recovery plan, and test evidence.

## Stop conditions
Stop when bridge security assumptions are weaker than the protocol’s acceptable loss model.