# Resource Lifecycle

## Purpose
Prevent leaked, orphaned, duplicated, or incorrectly reused eBPF kernel resources.

## Scope
Programs, maps, links, BTF objects, pinned objects, file descriptors, namespaces, and process lifecycle.

## MUST
- Every created or pinned kernel object MUST have a defined owner and cleanup lifecycle.
- Startup MUST detect stale resources before creating replacements.
- Cleanup MUST distinguish owned resources from shared or foreign resources.
- Crash/restart behavior MUST be tested for persistent pinned state.
- Resource counts and memory growth MUST be observable for long-running systems.

## MUST NOT
- MUST NOT delete shared pinned objects based only on path naming assumptions.
- MUST NOT leak file descriptors or links across repeated reload cycles.
- MUST NOT reuse persistent maps across incompatible schemas.

## SHOULD
- Use explicit version/identity metadata for persistent resources.
- Prefer kernel link mechanisms that simplify attachment lifetime where supported.

## Exceptions
Intentional persistence requires documented owner, compatibility contract, retention, and recovery procedure.

## Verification
Run repeated load/unload/restart/crash tests; inspect bpffs, program/map/link inventories, FD counts, and memory before and after cycles.