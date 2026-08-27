# Runtime Security Threat Modeling

## Purpose
Threat-model a container runtime as a privileged host component and convert risks into concrete engineering controls and tests.

## When to use
Use before major runtime features, privilege changes, new host interfaces, or security reviews.

## Inputs
Architecture, data/control flows, privilege boundaries, host interfaces, runtime APIs, deployment model, attacker assumptions.

## Context to inspect
Map API clients, daemon/shim/runtime processes, bundles, sockets, filesystem paths, namespaces, cgroups, kernel interfaces, plugins, and image/snapshot inputs.

## Core knowledge
Container runtimes process attacker-influenced configuration while invoking privileged kernel APIs. Path traversal, symlink races, confused-deputy behavior, unsafe file descriptors, namespace mistakes, and plugin trust are recurring risk classes.

## Procedure
1. Define assets and attacker capabilities.
2. Draw trust boundaries and privileged transitions.
3. Enumerate untrusted inputs and filesystem paths.
4. Analyze TOCTOU and path-resolution risks.
5. Review namespace/capability/device escape opportunities.
6. Review API authorization and local socket exposure.
7. Review plugin/helper execution boundaries.
8. Define preventive and detective controls.
9. Add negative tests for highest-risk abuse cases.
10. Record residual risk and required operational controls.

## Decision points
Prefer capability removal and architectural isolation over input validation alone. Use privileged helpers only with narrow, auditable contracts.

## Common failure patterns
Assuming local clients are trusted, string-based path validation, following symlinks across trust boundaries, broad helper privilege, and relying on containers as VM-equivalent isolation.

## Verification
Validate mitigations with adversarial tests, static review, and runtime evidence; confirm controls fail closed.

## Expected output
A threat model linked to specific mitigations, tests, and residual risks.

## Stop conditions
Stop and escalate when a feature introduces an unmitigated host-escape path or changes the security boundary materially.