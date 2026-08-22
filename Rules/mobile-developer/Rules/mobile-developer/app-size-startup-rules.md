# App Size and Startup Rules
## Purpose
Control install footprint, download cost, launch latency, and startup reliability.
## Scope
Binary size, resources, native libraries, initialization, lazy loading, and startup dependencies.
## MUST
- Material binary-size increases MUST identify the contributing artifacts and product value.
- Startup-critical initialization MUST be bounded and failure-tolerant where nonessential.
- Required startup dependencies MUST define timeout/fallback behavior if they involve I/O.
## MUST NOT
- Nonessential SDK initialization MUST NOT block first usable interaction.
- Duplicate architectures/assets or unused resources MUST NOT remain unnoticed in release artifacts.
## SHOULD
- Large optional assets SHOULD use on-demand delivery or equivalent mechanisms when supported and beneficial.
## Exceptions
Offline-first products may intentionally carry larger assets when measured user value exceeds download/storage cost.
## Verification
Track release artifact size, dependency contribution, cold/warm startup traces, first-frame/interactive metrics, and startup failure tests.