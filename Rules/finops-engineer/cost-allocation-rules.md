# Cost Allocation Rules

## Purpose
Ensure cloud and technology costs are assigned to accountable owners using defensible allocation logic.

## Scope
Accounts, subscriptions, projects, clusters, shared platforms, SaaS, support, marketplace, and other technology spend.

## MUST
- Define allocation dimensions, ownership, data sources, refresh cadence, and treatment of shared costs.
- Reconcile allocated totals to authoritative billing totals before publishing chargeback or showback.
- Track unallocated spend explicitly and assign an owner and remediation target.
- Preserve allocation logic and effective dates so historical reports remain reproducible.

## MUST NOT
- Invent ownership when metadata is missing.
- Hide shared or unallocated spend by distributing it through undocumented formulas.
- Change allocation logic retroactively without impact analysis and approval.

## SHOULD
- Prefer allocation keys that reflect causal consumption and can be independently verified.
- Automate tag, label, account, and hierarchy validation where practical.

## Exceptions
Proxy allocation is permitted when direct attribution is technically impossible, provided the rationale, uncertainty, alternatives, affected owners, and review date are documented.

## Verification
Reconcile billing exports, allocation outputs, ownership mappings, and unallocated-cost reports; sample allocations back to source usage and configuration evidence.