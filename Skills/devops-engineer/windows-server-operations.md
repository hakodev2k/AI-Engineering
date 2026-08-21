# Windows Server Operations

## Purpose
Operate and troubleshoot Windows-based infrastructure and application hosts safely.

## When to use
Use for Windows services, IIS, scheduled tasks, certificates, event logs, networking, resource pressure, or deployment failures.

## Inputs
Server role, symptoms, deployment state, service/IIS config, logs, certificates, recent changes.

## Context to inspect
Event Viewer, services, IIS sites/app pools, bindings, certificate store, Task Scheduler, performance counters, firewall, disk and memory.

## Core knowledge
Understand service accounts, Windows ACLs, IIS process model, TLS bindings, event logs, PowerShell remoting, scheduled tasks, and patch/reboot behavior.

## Procedure
1. Confirm server and workload identity.
2. Review recent deployment/patch changes.
3. Inspect service/app-pool state.
4. Review relevant event logs.
5. Validate bindings, certificates, and ports.
6. Check CPU/memory/disk/handles.
7. Verify service-account permissions.
8. Test locally before external path.
9. Apply controlled remediation.
10. Move manual fixes into configuration automation.

## Decision points
Recycle app pool before full server reboot when scope is isolated; use managed service identities where available; centralize certificates when lifecycle permits.

## Common failure patterns
Reboot-first troubleshooting, expired certs, app-pool identity drift, local-only config edits, weak ACLs.

## Verification
Service responds through expected binding, events are clean, certificates valid, and config is reproducible.

## Expected output
Safe operational diagnosis with automated or documented durable fix.

## Stop conditions
Stop before domain-wide or certificate-authority changes without specialist approval.