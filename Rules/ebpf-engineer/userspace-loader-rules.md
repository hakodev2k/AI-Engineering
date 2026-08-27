# Userspace Loader

## Purpose
Make eBPF loading, configuration, attachment, and teardown deterministic and diagnosable.

## Scope
Loaders, libbpf integration, skeletons, privileges, feature detection, object lifecycle, and startup/shutdown.

## MUST
- Loader MUST validate required capabilities before activation.
- Partial load/attach failures MUST clean up owned resources or record recoverable state.
- Configuration MUST be validated before modifying kernel state.
- Program/map/link ownership MUST be explicit across process restarts.
- Loader errors MUST preserve verifier and syscall diagnostics needed for investigation.

## MUST NOT
- MUST NOT continue as healthy after required programs fail to attach.
- MUST NOT retain broader privileges than needed after privileged setup where privilege dropping is feasible.
- MUST NOT delete pinned objects it does not own.

## SHOULD
- Use link-based lifecycle management where supported.
- Make startup idempotent and shutdown bounded.

## Exceptions
Exceptions require lifecycle rationale, failure-mode analysis, and operational recovery instructions.

## Verification
Exercise clean start, restart, crash, partial failure, duplicate start, and shutdown; inspect kernel objects and privilege state afterward.