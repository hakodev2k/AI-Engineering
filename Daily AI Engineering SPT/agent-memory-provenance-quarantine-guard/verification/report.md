# Verification Report

## Implemented
- Provenance-required memory policy with explicit trust classes and states.
- Deterministic content digest and rule-based classification.
- Fail-closed handling for missing provenance.
- Quarantine and restricted decisions with reason codes.
- Tenant/state/trust retrieval filtering.
- Transitive lineage-based revocation.
- Store audit for duplicate IDs, missing metadata, digest drift, unknown parents and unsafe retrieval flags.
- Skills, enforceable rules, subagent separation, bounded workflows and integration hooks.
- Regression tests covering benign, malicious, cross-tenant, revoked, missing-provenance and lineage cases.

## Measured
The package defines measurements but does not claim production improvement without target-system baselines. Required rollout metrics are:
- persisted-memory provenance coverage;
- malicious-fixture quarantine rate;
- benign false-positive quarantine rate;
- poisoned/revoked retrieval leakage;
- cross-tenant retrieval leakage;
- useful-memory recall/precision;
- guard latency overhead;
- descendants found/revoked during incident drills;
- time to containment.

## Verified by included contract tests
The supplied unit suite deterministically verifies:
1. benign authenticated memory can be allowed;
2. configured injection text is quarantined and excluded from retrieval;
3. low-trust web memory does not meet retrieval trust threshold;
4. cross-tenant memory is blocked;
5. revoked memory is blocked;
6. missing source provenance fails closed;
7. source revocation traverses descendants;
8. content-digest tampering is detected;
9. unknown lineage parents are detected;
10. quarantined memory cannot advertise retrieval enabled without audit failure.

Run:
```bash
python -m unittest tests/test_memory_guard.py
```

## Production verification gate
Do not call a production integration verified until:
- every durable write path supplies the required envelope;
- every model-facing persistent-memory retrieval path runs the security gate;
- tenant isolation probes return zero foreign records;
- configured malicious fixtures never reach context;
- revoked fixtures and descendants never reach context;
- benign corpus false-positive rate is measured and accepted by the owning team;
- high-risk incident/re-trust operations have the required independent/human approval;
- a store audit reports no blocking problems.

## Residual risks
- Pattern matching is deterministic but cannot recognize every semantic/adaptive injection.
- Source trust may itself be wrong if connector/service identity is compromised.
- Missing lineage from legacy data reduces revocation precision.
- A compromised storage administrator can potentially alter both content and metadata unless integrity controls are stronger than local digests.
- Retrieval gating does not replace sandboxing, least-privilege tool permissions, output validation, or prompt-injection defenses at other boundaries.

These residual risks are why the package treats provenance/quarantine as an architectural boundary, not as a complete prompt-injection solution.