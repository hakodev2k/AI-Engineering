# Sustainability Baseline Rules

## Purpose
Establish a measurable baseline before claiming software sustainability improvements.

## Scope
Applies to production services, batch systems, data workloads, build pipelines, and cloud-hosted applications.

## MUST
- Material sustainability decisions MUST begin with a documented baseline covering workload volume, compute use, storage use, network transfer, and energy or carbon indicators available to the project.
- Baselines MUST record the measurement window, workload mix, environment, assumptions, and data sources.
- Comparisons MUST normalize for relevant workload changes when possible.

## MUST NOT
- MUST NOT claim reduced environmental impact from intuition alone.
- MUST NOT compare measurements from materially different workload conditions without stating the limitation.

## SHOULD
- Prefer representative production-like periods over synthetic snapshots.
- Track both absolute impact and impact per useful unit of work.

## Exceptions
Exceptions require a documented reason, unavailable evidence, proxy metric, uncertainty, and reviewer approval when the claim will affect architecture or external reporting.

## Verification
Review dashboards, provider telemetry, benchmark records, workload-normalization logic, and the source data used for before/after comparisons.
