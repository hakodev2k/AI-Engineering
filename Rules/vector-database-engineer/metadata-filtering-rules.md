# Metadata Filtering

## Purpose
Preserve correctness, security, and predictable performance when vector retrieval is constrained by metadata.

## Scope
Applies to scalar filters, pre/post filtering, tenancy predicates, authorization attributes, and filter indexes.

## MUST
- Mandatory tenant and authorization predicates MUST be applied in a way that cannot be bypassed by retrieval fallback.
- Filter semantics, null handling, types, and supported operators MUST be explicit and tested.
- Filter selectivity and interaction with ANN recall MUST be benchmarked for representative workloads.
- Frequently used high-cardinality or selective predicates MUST have an intentional indexing strategy.
- Query planners or application logic MUST bound pathological filter/search combinations.

## MUST NOT
- MUST NOT rely on client-provided tenant identifiers as authorization evidence.
- MUST NOT silently convert a failed mandatory filter into unfiltered search.
- MUST NOT assume post-filtering preserves requested top-k quality under highly selective predicates.

## SHOULD
- Pre-filter versus post-filter strategy SHOULD be chosen from measured recall/latency behavior.
- Filter cardinality distributions SHOULD be monitored as data evolves.
- Schemas SHOULD minimize ambiguous dynamic metadata for security-critical predicates.

## Exceptions
Exceptions require documented correctness and security analysis, workload evidence, risk acceptance, and approval when access boundaries are affected.

## Verification
Use integration tests, adversarial tenancy tests, query plans, benchmark results, schema inspection, and production filter/latency telemetry.