# Secure Aggregation

## Purpose
Design and review secure aggregation so the server learns only approved aggregate updates rather than individual client updates.

## When to use
Use when individual model updates are sensitive, clients do not fully trust the coordinator, or privacy policy requires update-level confidentiality.

## Inputs
Threat model, client count, dropout rate, cryptographic protocol choice, key-management constraints, network limits, and aggregation semantics.

## Context to inspect
Inspect honest-but-curious versus malicious assumptions, collusion thresholds, dropout handling, metadata exposure, replay risk, and operational key lifecycle.

## Core knowledge
Secure aggregation protects update contents but not all metadata and does not by itself provide differential privacy. Protocol robustness depends on participant thresholds, cryptographic setup, and dropout recovery.

## Procedure
1. Define attacker capabilities and protected assets.
2. Specify exactly what the coordinator may learn.
3. Select a protocol matching client scale and dropout behavior.
4. Define enrollment and key-establishment flows.
5. Validate masking/unmasking and threshold behavior.
6. Test normal, dropout, duplicate, replay, and malformed-update cases.
7. Bound metadata exposure and logging.
8. Integrate aggregation weighting without breaking protocol assumptions.
9. Benchmark communication and compute overhead.
10. Document recovery and incident procedures.

## Decision points
Do not add secure aggregation if update confidentiality is not a requirement and complexity outweighs value. Combine with differential privacy when aggregate information itself can leak sensitive properties.

## Common failure patterns
- Treating encryption in transit as secure aggregation.
- Assuming secure aggregation equals differential privacy.
- Ignoring collusion and minimum-participant thresholds.
- Logging client updates before masking.
- Protocol failure under realistic dropout.

## Verification
Verify with protocol tests, threat-model review, dropout simulations, and evidence that individual plaintext updates are unavailable to the coordinator.

## Expected output
A secure-aggregation design with threat assumptions, protocol parameters, test evidence, and operational controls.

## Stop conditions
Stop if the trust model is undefined, cryptographic requirements exceed available expertise, or key-management responsibilities are unresolved.