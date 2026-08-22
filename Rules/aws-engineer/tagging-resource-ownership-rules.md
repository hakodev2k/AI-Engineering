# Tagging and Resource Ownership Rules
## Purpose
Keep AWS resources attributable, governable, and lifecycle-managed.
## Scope
Tags, naming, ownership, environment classification, inventory, and orphaned resources.
## MUST
- Assign accountable owner, environment, workload, and cost attribution metadata to governed resources where tagging is supported.
- Define lifecycle ownership for shared and temporary resources.
- Detect and remediate orphaned or unowned production resources.
- Protect governance tags from unauthorized mutation when they drive policy or billing.
## MUST NOT
- Rely on resource names alone for ownership or environment classification.
- Delete apparently unused resources without dependency and recovery verification.
## SHOULD
- Enforce required tags through IaC, policy, or provisioning workflows.
## Exceptions
Non-taggable resources require equivalent inventory metadata.
## Verification
Inspect Resource Groups/Tagging inventory, IaC definitions, policy checks, cost allocation tags, ownership records, and orphan reports.