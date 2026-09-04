# Sampling and Cardinality Rules

## Purpose
Control observability volume and cost without destroying the evidence needed to investigate AI behavior.

## Scope
Applies to trace sampling, log sampling, metric labels, event dimensions, exemplars, and retention tiers.

## MUST
- Sampling policies MUST document rate, decision point, preserved event classes, and expected diagnostic loss.
- Error, security-relevant, and extreme-latency events MUST receive explicitly reviewed preservation treatment.
- Metric dimensions MUST be bounded and reviewed for worst-case cardinality before production use.
- Sampling changes MUST be evaluated for their effect on alerts, SLO calculations, investigations, and cost.
- Tail-based or conditional sampling MUST preserve deterministic correlation where investigation depends on related spans.

## MUST NOT
- Raw prompts, responses, arbitrary IDs, or exception text MUST NOT become unbounded metric labels.
- Sampling MUST NOT silently exclude the exact failure populations used by release or incident gates.
- Cardinality incidents MUST NOT be resolved solely by deleting useful dimensions without identifying safer aggregation.

## SHOULD
- Prefer low-cardinality semantic attributes and retain high-detail evidence in traces or bounded event stores.
- Use adaptive sampling only when behavior and bias are measurable.

## Exceptions
High-cardinality fields may exist in controlled logs or traces when required for diagnosis and protected by retention and access limits.

## Verification
Inspect cardinality reports, sampling configuration, preserved error traces, cost trends, and controlled failure traffic to verify critical evidence survives sampling.