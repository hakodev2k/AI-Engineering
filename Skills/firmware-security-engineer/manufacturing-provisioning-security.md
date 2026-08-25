# Manufacturing Provisioning Security

## Purpose
Secure factory provisioning so each device receives correct identity, keys, lifecycle configuration, and production firmware without exposing fleet-wide secrets or permitting unauthorized units.

## When to use
Use when designing production lines, contract-manufacturer workflows, device enrollment, secure personalization, or investigating provisioning leakage/misconfiguration.

## Inputs
Manufacturing topology, station software, HSM/PKI, device hardware roots, serial/identity source, firmware images, lifecycle states, operator roles, and audit requirements.

## Preconditions
Separate development and production credentials. Define ownership and authorization for every irreversible provisioning operation.

## Context to inspect
Station authentication, network links, secret delivery, per-device key generation, certificates, fuses, debug locks, firmware loading, duplicate detection, logs, rework, scrap, and contract-manufacturer access.

## Core knowledge
Factories are privileged trust boundaries. Device-unique keys should ideally be generated on-device or injected through authenticated hardware-backed channels. Production stations need least privilege, short-lived authorization, auditable transactions, and resistance to replay/overproduction.

## Procedure
1. Model threats from operators, compromised stations, network attackers, and unauthorized overproduction.
2. Inventory all secrets and irreversible settings crossing the line.
3. Prefer on-device key generation with public-key certification.
4. Authenticate stations and devices before provisioning sensitive state.
5. Issue per-device authorization rather than exposing master secrets.
6. Program lifecycle/debug/security settings only after prerequisite validation.
7. Bind identity records to hardware identifiers and manufacturing evidence.
8. Detect duplicate, replayed, skipped, or out-of-order provisioning steps.
9. Minimize and redact station logs.
10. Define rework, failed-unit, scrap, and RMA handling.
11. Reconcile produced identities against authorized production counts.
12. Test station compromise assumptions, interrupted provisioning, duplicate requests, and offline operation.

## Decision points
On-device key generation best limits extraction; secure injection may be required for legacy hardware. Online authorization provides stronger overproduction control, while offline signed batches improve factory resilience but need strict quantity/expiry controls.

## Common failure patterns
Master keys copied to stations; identical credentials across devices; debug lock omitted on reworked units; secrets printed in logs; provisioning replay creates duplicate identity; contract manufacturer retains long-lived credentials; failed devices leave without sanitization.

## Verification
Audit sample units end-to-end, confirm unique protected identity, correct lifecycle/debug state, signed production firmware, transaction reconciliation, and safe interrupted/rework paths. Attempt duplicate provisioning and verify rejection.

## Expected output
Provisioning protocol, station/device controls, audit model, rework/scrap procedure, and validation evidence.

## Stop conditions
Escalate if master secrets must be exposed to uncontrolled stations, irreversible states are undocumented, production authorization cannot be audited, or device uniqueness cannot be guaranteed.