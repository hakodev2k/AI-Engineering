# Sandboxing and Process Isolation

## Purpose
Maintain strong containment of untrusted web content and reduce the blast radius of renderer compromise.

## When to use
Use for process-model changes, privileged IPC, file/device access, sandbox policy, or site isolation work.

## Inputs
Threat model, process topology, IPC interfaces, OS sandbox configuration, feature requirements.

## Context to inspect
Privileges per process, broker interfaces, sandbox profiles, handles/capabilities, site assignment, process reuse.

## Core knowledge
Sandboxing assumes untrusted processes may be compromised. Security depends on minimizing ambient authority, validating IPC in privileged processes, and preserving isolation boundaries across navigation and resource access.

## Procedure
1. Define attacker-controlled processes and data.
2. Inventory required privileges and resources.
3. Remove unnecessary privileges.
4. Route unavoidable operations through narrow broker APIs.
5. Validate every privileged request independently of renderer assertions.
6. Check process reuse and site assignment rules.
7. Test compromised-client style malformed requests.
8. Exercise sandbox denial and crash recovery paths.

## Decision points
Prefer capability-style narrow APIs over general filesystem or system access. Accept additional process cost when isolation materially reduces security risk.

## Common failure patterns
Trusting renderer-provided paths or origins; overly broad broker methods; inherited handles; silent sandbox relaxations; process reuse across incompatible isolation domains.

## Verification
Sandbox tests, negative IPC tests, privilege inspection, site-isolation tests, and security review pass.

## Expected output
A constrained design with explicit privileges, validation, and isolation guarantees.

## Stop conditions
Escalate any request to weaken sandbox policy, expand privileged surface substantially, or change isolation guarantees without security approval.