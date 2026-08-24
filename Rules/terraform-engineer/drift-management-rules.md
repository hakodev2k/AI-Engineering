# Drift Management

## Purpose
Detect and resolve divergence between declared configuration, Terraform state, and real infrastructure.

## Scope
Manual changes, external controllers, imports, refresh behavior, and reconciliation.

## MUST
- Material production drift MUST be investigated before reconciliation.
- The authoritative owner of each managed property MUST be clear when Terraform coexists with other controllers.
- Drift correction MUST distinguish legitimate emergency/manual changes from accidental divergence.
- Reconciliation plans MUST be reviewed for destructive consequences.

## MUST NOT
- Drift MUST NOT be blindly overwritten without understanding why it occurred.
- Manual production changes MUST NOT become an undocumented permanent operating model.
- `ignore_changes` MUST NOT be used as a blanket drift suppression mechanism.

## SHOULD
- Critical environments SHOULD have scheduled or event-driven drift detection.
- Repeated drift SHOULD trigger root-cause remediation of process, ownership, or automation gaps.

## Exceptions
Emergency manual intervention is allowed under incident procedures but SHOULD be captured back into code or explicitly reverted after stabilization.

## Verification
Compare configuration, state, refreshed plans, cloud audit logs, change records, controller ownership, and incident history. Track repeated drift patterns to closure.