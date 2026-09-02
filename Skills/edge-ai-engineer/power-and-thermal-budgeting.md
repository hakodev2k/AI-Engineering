# Power and Thermal Budgeting

## Purpose
Engineer edge AI workloads that remain within device power and thermal envelopes during sustained operation, preserving latency, battery life, hardware reliability, and user experience.

## When to use
Use for battery-powered products, passively cooled devices, sustained camera/audio inference, accelerator selection, duty-cycle design, or thermal-throttling investigations.

## Inputs
Device power limits, battery capacity, thermal design, workload profile, model/runtime settings, sensor duty cycles, target latency, and telemetry.

## Preconditions
Measurements must be taken on representative enclosures and hardware revisions because bench boards can misrepresent thermal behavior.

## Context to inspect
CPU/GPU/NPU utilization, DVFS state, temperature sensors, fan policy, battery discharge, wake/sleep behavior, sensor power, network usage, and background processes.

## Core knowledge
Peak benchmark performance is irrelevant if the device cannot sustain it. Thermal throttling creates time-dependent latency regressions; higher accelerator utilization may lower total energy if it shortens active time. Duty cycling, precision, frequency caps, batching, and workload shedding are system-level controls.

## Procedure
1. Define sustained workload scenarios and environmental temperature assumptions.
2. Measure idle, startup, active, and steady-state power.
3. Correlate temperature, frequency, utilization, and latency over time.
4. Identify the component driving the power or thermal limit.
5. Evaluate lower precision, reduced sensor rates, smaller models, or accelerator offload.
6. Design duty cycles and sleep states where product behavior permits.
7. Define graceful workload shedding before severe throttling.
8. Test battery-state and charger-state effects when relevant.
9. Validate worst-case enclosure and ambient conditions.
10. Record sustainable—not burst—performance limits.

## Decision points
Prefer efficiency improvements that reduce joules per useful inference. Cap frequency when small latency losses materially improve thermal stability. Reduce inference rate rather than allowing uncontrolled queue growth.

## Common failure patterns
Short benchmarks, testing open-air development boards, ignoring sensor/network power, assuming constant clock rate, and optimizing watts while missing battery-life impact from wakeups.

## Verification
Run long-duration thermal soak tests and confirm latency, temperature, power, battery drain, and workload-shedding behavior remain within requirements.

## Expected output
A sustainable power/thermal operating envelope with validated runtime controls and headroom.

## Stop conditions
Stop when representative thermal hardware is unavailable or sustained operation exceeds safety, battery, or component-temperature limits.