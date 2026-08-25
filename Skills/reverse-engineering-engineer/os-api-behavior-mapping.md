# OS and API Behavior Mapping

## Purpose
Translate low-level imports, syscalls, runtime helpers, and OS interactions into accurate behavioral semantics.

## When to use
Use when binary behavior is primarily expressed through operating-system or framework APIs.

## Inputs
Imports, call sites, API documentation, runtime traces, platform/version information.

## Preconditions
Match documentation and prototypes to the target OS/runtime version and architecture.

## Context to inspect
API arguments, return values, error handling, handles/descriptors, filesystem, registry/configuration, processes/threads, synchronization, networking, memory management, services, and IPC.

## Core knowledge
An API name alone does not establish intent. Argument values, access masks, object names, flags, ordering, and error paths determine semantics. Wrapper libraries and syscalls may bypass familiar high-level APIs.

## Procedure
1. Resolve imported and dynamically resolved API prototypes.
2. Group APIs by subsystem and resource lifecycle.
3. Trace argument provenance and return-value consumers.
4. Decode flags, access masks, constants, and object names.
5. Pair creation/open operations with use and cleanup.
6. Map wrappers to underlying OS behavior where needed.
7. Observe ambiguous dynamic values under controlled tracing.
8. Summarize behavior in platform-neutral terms while retaining exact evidence.

## Decision points
Use documentation for contract semantics and runtime traces for actual values. Do not label behavior malicious, safe, or intentional solely from capability APIs.

## Common failure patterns
Ignoring flags; using wrong API version; missing dynamic resolution; overlooking error paths; confusing capability with observed action; failing to track handle ownership.

## Verification
Behavioral claims should identify the exact call, relevant arguments, result, and surrounding control flow. Reproduce dynamic claims where practical.

## Expected output
An evidence-backed map of OS interactions, resources, and lifecycle semantics.

## Stop conditions
Stop if required tracing would interact with sensitive production resources or if platform/version ambiguity makes API semantics uncertain.