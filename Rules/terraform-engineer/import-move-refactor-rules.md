# Import, Move, and Refactor

## Purpose
Change Terraform ownership and addresses without unintended resource recreation.

## Scope
Import blocks, moved blocks, state moves, module refactors, renames, and adoption of existing infrastructure.

## MUST
- Existing-resource adoption MUST verify identity and ownership before import.
- Address refactors MUST preserve resource identity through declarative moved blocks or a reviewed state migration procedure.
- Refactors MUST produce plans demonstrating no unintended create/destroy operations.
- Production state surgery MUST require explicit approval and recovery preparation.

## MUST NOT
- Resources MUST NOT be imported by guessing identifiers.
- State commands MUST NOT be used to hide configuration defects.
- A rename MUST NOT be accepted when Terraform plans destructive recreation unless that recreation is intentional and approved.

## SHOULD
- Declarative import and move mechanisms SHOULD be preferred over ad hoc state manipulation when supported.
- Large refactors SHOULD be separated from functional infrastructure changes.

## Exceptions
Provider limitations may require state operations; document commands, expected before/after addresses, backup, evidence, and approver.

## Verification
Inspect state listings, import/moved declarations, pre/post plans, resource IDs, backups, git diffs, and resulting cloud resource continuity.