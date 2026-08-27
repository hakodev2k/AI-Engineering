# GPU Security and Isolation Rules

## Purpose
Protect data, tenants, credentials, and host systems across accelerator boundaries.

## Scope
Shared GPUs, device memory, containers/VMs, privileged interfaces, debugging, and multi-tenant execution.

## MUST
- Untrusted workload sharing MUST use an approved isolation model supported by the platform threat model.
- GPU-access permissions MUST follow least privilege.
- Sensitive device buffers MUST not be exposed across tenant or trust boundaries.
- Debug/profiling capabilities that can inspect other workloads MUST be access-controlled.
- Security-relevant driver and firmware vulnerabilities MUST be assessed against deployed exposure.

## MUST NOT
- MUST NOT expose device nodes broadly merely to simplify deployment.
- MUST NOT log model inputs, keys, tokens, or sensitive memory contents without an approved data-handling basis.
- MUST NOT weaken isolation controls to recover capacity without human approval.

## SHOULD
- Prefer hardware/platform isolation mechanisms with documented security guarantees.
- Include accelerator paths in threat modeling and incident response.

## Exceptions
Any reduced isolation requires documented threat analysis, compensating controls, duration, monitoring, and security approval.

## Verification
Review permissions, runtime policy, tenant tests, vulnerability status, audit logs, and security configuration.