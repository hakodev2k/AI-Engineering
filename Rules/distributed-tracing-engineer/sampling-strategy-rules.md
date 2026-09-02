# Sampling Strategy Rules

## Purpose
Balance diagnostic coverage, statistical validity, cost, and tracing overhead.

## Scope
Applies to head sampling, tail sampling, adaptive policies, priority sampling, and incident overrides.

## MUST
- Sampling policy MUST document target coverage, cost constraints, and which high-value traces are retained.
- Error, high-latency, and security-relevant sampling rules MUST be evaluated against actual incident needs.
- Sampling decisions MUST preserve trace completeness where the chosen architecture supports it.
- Changes to production sampling MUST be measured for ingestion volume, storage cost, and diagnostic impact.

## MUST NOT
- MUST NOT assume sampled trace counts equal request counts without statistical qualification.
- MUST NOT reduce sampling solely to control cost when doing so removes required incident evidence.
- MUST NOT enable unbounded 100% tracing in high-volume production without capacity validation and approval.

## SHOULD
- Prefer tail or adaptive sampling when rare failures matter more than uniform coverage.
- Maintain a documented emergency sampling procedure.

## Exceptions
Exceptions require evidence, bounded duration, operational owner, rollback criteria, and approval for material cost or load increases.

## Verification
Inspect sampler configuration, compare sampled versus source traffic metrics, test retention of representative failure traces, and review cost/volume dashboards after changes.
