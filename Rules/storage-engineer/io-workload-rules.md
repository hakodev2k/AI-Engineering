# I/O Workload Rules

## Purpose
Align storage configuration with actual application I/O behavior.

## Scope
Read/write patterns, sequentiality, queue depth, alignment, burstiness, metadata, and small-file/object workloads.

## MUST
- Workload characterization MUST use measured production or representative traces when available.
- Storage tier and protocol choices MUST account for latency sensitivity, concurrency, access pattern, and consistency needs.
- Sustained and burst requirements MUST be distinguished.
- Application changes that materially alter I/O patterns MUST trigger capacity and performance reassessment.

## MUST NOT
- MUST NOT infer I/O requirements from dataset size alone.
- MUST NOT assume vendor maximum IOPS or throughput is simultaneously achievable for every workload.
- MUST NOT ignore metadata or namespace pressure in file- and object-heavy workloads.

## SHOULD
- Segment workloads with conflicting access characteristics when isolation improves predictability.

## Exceptions
Modeled workloads may substitute for traces when evidence is unavailable, provided assumptions and validation plans are recorded.

## Verification
Inspect workload telemetry, traces, queue statistics, protocol metrics, application benchmarks, and saturation behavior.