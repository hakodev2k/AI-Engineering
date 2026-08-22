# Production Safety Rules

## Purpose
Ensure senior network work distinguishes analysis from execution and protects irreversible or high-blast-radius operations.

## Scope
Production changes, destructive actions, provider changes, security controls, remote access, routing, and recovery.

## MUST
- Determine authority before executing production actions and obtain human approval for destructive, irreversible, security-weakening, or high-blast-radius changes.
- Prefer reversible staged changes and define explicit abort criteria.
- Verify target device, environment, interface, policy, and scope immediately before execution.
- Maintain a recovery path that does not depend solely on the component being changed.

## MUST NOT
- Force an unsafe change because automation or an operator appears confident.
- Rewrite history, erase evidence, factory-reset infrastructure, or destroy configuration without explicit authorized intent.

## SHOULD
- Use canaries, maintenance windows, out-of-band management, and peer review for critical changes.

## Exceptions
Pre-authorized emergency procedures may permit bounded actions; all actions MUST remain logged and reviewed.

## Verification
Review authorization, target checks, change diff, abort/rollback criteria, out-of-band access, monitoring, and post-change evidence.