# Quality Performance and Scalability Rules
## Purpose
Keep quality controls effective without destabilizing data platforms.
## Scope
Scan cost, latency, sampling, incremental checks, compute, and large-scale validation.
## MUST
- Expensive quality checks MUST have measured resource and latency impact before broad production rollout.
- Sampling MUST NOT replace deterministic full-population checks where rare failures have unacceptable impact unless risk is explicitly accepted.
- Quality workloads MUST respect production capacity and workload isolation requirements.
## MUST NOT
- MUST NOT claim optimization without before/after measurements.
- MUST NOT disable critical checks solely to improve pipeline duration without an approved alternative.
## SHOULD
- Checks SHOULD use partition pruning, incremental evaluation, metadata, or sketches when equivalent evidence is preserved.
## Exceptions
Reduced coverage requires quantified detection risk, duration, and approval.
## Verification
Review execution metrics, query plans, benchmark results, coverage comparisons, and capacity impact.