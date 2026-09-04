# Privacy-Preserving Machine Learning

## Purpose
Select and apply privacy-preserving ML techniques when ordinary access control and minimization do not sufficiently reduce exposure.

## When to use
Use when training or analyzing sensitive datasets across organizational boundaries, when centralizing raw data is undesirable, or when formal privacy guarantees are required.

## Inputs
- ML objective and utility target
- Data sensitivity and distribution
- Threat model
- Compute and latency constraints
- Required privacy guarantees

## Context to inspect
Inspect current training topology, feature engineering, aggregation, gradient handling, model sharing, and downstream outputs.

## Core knowledge
Relevant techniques include differential privacy, federated learning, secure aggregation, trusted execution, homomorphic encryption, secure multi-party computation, split learning, and privacy-aware synthetic data. Each protects different attack surfaces and carries cost, complexity, and utility trade-offs.

## Procedure
1. Define the concrete privacy threat to mitigate.
2. Determine whether minimization or architectural separation solves it more simply.
3. Map candidate privacy-enhancing technologies to the threat.
4. Estimate utility, latency, compute, operational, and debugging cost.
5. Prototype the least complex approach that provides the required guarantee.
6. Measure model quality and system overhead.
7. Test assumptions against realistic adversaries.
8. Define key management, trust, and failure behavior where cryptography is involved.
9. Document guarantees and non-guarantees precisely.
10. Add regression tests and operational monitoring.

## Decision points
Use differential privacy for bounded contribution and statistical leakage guarantees; federated learning for decentralized data custody; cryptographic computation where parties must collaborate without sharing plaintext. Do not stack techniques without a clear threat-model benefit.

## Common failure patterns
- Choosing a privacy technology because it is fashionable
- Claiming privacy from federated learning without protecting updates
- Ignoring inference-time leakage
- Using weak parameter choices that invalidate formal guarantees
- Underestimating operational complexity

## Verification
Verify the claimed guarantee mathematically or against implementation documentation, benchmark utility and overhead, and test attack scenarios relevant to the original threat model.

## Expected output
A justified privacy-preserving ML design with threat coverage, configuration, measured trade-offs, residual risk, and verification evidence.

## Stop conditions
Escalate when required guarantees cannot be achieved within utility or performance limits, cryptographic trust assumptions are unresolved, or specialist review is required.