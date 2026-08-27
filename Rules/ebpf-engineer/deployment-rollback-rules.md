# Deployment and Rollback

## Purpose
Control production risk when activating kernel-resident code.

## Scope
Rollouts, upgrades, map reuse, link replacement, canaries, rollback, health checks, and configuration changes.

## MUST
- Production activation MUST require explicit human approval unless a separately approved automated release policy authorizes it.
- Rollouts MUST define health signals, abort thresholds, and rollback steps before activation.
- Compatibility of maps, events, loaders, and programs MUST be validated for rolling upgrades.
- Canary or staged rollout MUST be used when blast radius is material.
- Rollback MUST restore both program attachment and compatible state/configuration.

## MUST NOT
- MUST NOT perform destructive cleanup of prior state until rollback safety is established.
- MUST NOT deploy enforcement changes globally without staged evidence unless an approved emergency procedure applies.
- MUST NOT force deployment by weakening kernel security controls.

## SHOULD
- Make activation reversible and idempotent.
- Retain previous known-good artifacts for the rollback window.

## Exceptions
Emergency deployment requires incident authority, bounded scope, recorded rationale, monitoring, and retrospective validation.

## Verification
Inspect release plan, approvals, canary evidence, compatibility tests, rollback rehearsal, and post-deploy attachment/health telemetry.