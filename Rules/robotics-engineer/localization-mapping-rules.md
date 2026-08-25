# Localization and Mapping Rules
## Purpose
Prevent navigation and control decisions from relying on invalid pose or map state.
## Scope
Odometry, localization, SLAM, maps, loop closure, and pose fusion.
## MUST
- Define coordinate frames, map provenance, localization quality thresholds, and recovery behavior.
- Detect divergence, stale localization, impossible jumps, and uncertainty growth relevant to operation.
- Validate maps against the deployment environment and control map versioning.
- Bound robot behavior when localization quality is insufficient.
## MUST NOT
- Continue normal autonomous navigation after localization is known invalid.
- Replace production maps without compatibility and rollback checks.
## SHOULD
- Fuse independent sources when justified and monitor consistency between them.
## Exceptions
Operation with degraded localization requires explicit bounded-area controls and risk acceptance.
## Verification
Use replay, ground-truth comparisons, kidnapped-robot tests, map-change scenarios, uncertainty telemetry, and recovery tests.