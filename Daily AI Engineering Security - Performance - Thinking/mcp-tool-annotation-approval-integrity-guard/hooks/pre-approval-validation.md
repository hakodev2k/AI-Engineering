# Hook: Pre-Approval Annotation Validation

## Trigger
Immediately before an MCP tool approval decision.

## Preconditions
Current tool identity and metadata snapshot are available.

## Action
Normalize annotations, compare snapshot hash/version to the classified version, and reject malformed or drifted metadata.

## Script/command
`python scripts/annotation_guard.py <tool-metadata.json>`

## Expected result
Exit 0 with canonical JSON. `approval-required` remains subject to normal policy; `read-only-candidate` is only an eligibility signal.

## Failure behavior
Exit 2 or snapshot mismatch blocks any automatic risk downgrade and routes to normal human approval.

## Blocks completion
Yes, whenever the host intended to reduce approval friction based on annotations.