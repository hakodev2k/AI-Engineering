# Database Technology Selection

## Purpose
Ensure database technologies are selected from workload evidence, operational constraints, and lifecycle risk.

## Scope
Database engines, managed services, storage models, extensions, and major platform capabilities.

## MUST
- Technology selection MUST trace to documented functional and non-functional requirements.
- Evaluations MUST include consistency, availability, scale, latency, operational maturity, security, portability, cost, and team supportability.
- Critical assumptions MUST be validated through representative prototypes, benchmarks, or reference evidence before commitment.
- Vendor-specific dependencies MUST document lock-in and exit implications.

## MUST NOT
- MUST NOT adopt a database because of popularity, novelty, or a single benchmark.
- MUST NOT compare products using materially different workload conditions.
- MUST NOT accept unsupported operational gaps for critical workloads without explicit risk approval.

## SHOULD
- Prefer mature capabilities already supported by the organization when they satisfy requirements.
- Prefer managed services when they reduce operational risk without violating control requirements.

## Exceptions
Exceptions require evidence, alternatives considered, lifecycle risk, cost impact, and accountable approval.

## Verification
Review decision records, benchmark methodology, requirement matrix, support model, cost analysis, and exit strategy.