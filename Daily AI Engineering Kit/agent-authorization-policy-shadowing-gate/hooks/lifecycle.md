# Lifecycle Hooks

## Pre-task validation
**Trigger:** before investigation. **Action:** confirm policy sources are readable and evaluation semantics are known. **Failure:** blocks static classification if semantics are unknown.

## Pre-edit gate
**Trigger:** before policy edits. **Command:** `python scripts/policy_shadow_gate.py <normalized-policy.json> --output artifacts/policy-shadow-before.json`. **Expected:** valid result JSON. **Failure:** parsing/validation blocks edits.

## Post-edit test
**Trigger:** after authorization edits. **Action:** run affected authorization tests defined by the host repository, then rerun the static gate. **Failure:** blocks completion.

## Final verification
**Trigger:** before completion. **Action:** independent verifier checks diff, approval boundaries, test evidence, and zero unaccepted blocking findings. **Failure:** blocks success.