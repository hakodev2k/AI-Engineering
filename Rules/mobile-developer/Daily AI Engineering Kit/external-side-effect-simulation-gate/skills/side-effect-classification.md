# Skill: Side-Effect Classification

## Purpose
Classify an agent/tool action before execution so the workflow knows whether it is read-only, simulated, reversible, externally mutating, financially material, communicative, publishing, or irreversible.

## When to use
Use before any tool invocation that can affect an external system, person, account, payment, notification channel, deployment target, SaaS record, repository, queue, ticketing system, calendar, mailbox, cloud resource, or publication surface.

## Inputs
- Requested action and business intent.
- Tool/provider name and operation.
- Target environment/account/tenant.
- Known side effects and reversibility.
- Available dry-run/sandbox/preview capabilities.
- Authentication/permission scope.

## Preconditions
- Exact tool operation is identifiable.
- Target is identifiable enough to classify risk.
- Unknown capability is treated as unknown, not safe.

## Allowed tools
Read-only documentation lookup, repository inspection, provider capability discovery, local scripts, schema validators, test fixtures, sandbox APIs.

## Constraints
- Do not execute the live mutating action during classification.
- Do not infer that a method is safe from its name alone.
- Do not treat idempotent as side-effect-free.
- Do not treat reversible as safe without rollback authority and evidence.

## Procedure
1. Record operation identity: provider, tool, method, target, environment.
2. Determine effect category: `read-only`, `internal-local`, `simulated`, `external-reversible`, `external-communicative`, `external-publishing`, `financial`, `security-sensitive`, or `irreversible`.
3. Record concrete effects: data write, message send, publish, billing, workflow trigger, account mutation, deployment, deletion, secret/security change.
4. Determine blast radius: one object, scoped collection, tenant/account, public audience, production system.
5. Determine reversibility and rollback mechanism.
6. Discover simulation mode: dry-run flag, validate-only endpoint, provider sandbox, test tenant, mock/fixture adapter, local recorder, or none.
7. Assign required gate level from `config/side-effect-policy.json`.
8. Emit a side-effect plan conforming to `schemas/side-effect-plan.schema.json`.

## Expected output
A structured plan containing action identity, effect category, target, environment, reversibility, simulation capability, risk tags, approval requirement, and expected effect assertions.

## Verification
- Every live-capable action has a non-empty effect category.
- Unknown environment or unknown simulation capability cannot produce `safe-to-execute-live`.
- Financial, publishing, communicative, production mutation, destructive, security, or irreversible actions require explicit approval.

## Failure handling
- Capability lookup failure: retry once only if transient; otherwise mark `capability-unknown` and block.
- Permission failure: do not escalate privilege; preserve evidence and stop.
- Ambiguous target: stop before simulation or live execution.

## Stop conditions
Stop when the target is unknown, simulation support cannot be established, the operation can cause live side effects but no approval path exists, or requested permissions exceed the task scope.
