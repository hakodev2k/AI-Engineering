# Cloud Quota Rules
## Purpose
Prevent logical quotas from blocking otherwise sufficient infrastructure capacity.
## Scope
Account, subscription, region, service, API, instance, storage, IP, and accelerator quotas.
## MUST
- Critical scaling paths MUST inventory quotas that can prevent provisioning.
- Required quota increases MUST be requested before the capacity need enters provisioning lead time.
- Quota headroom MUST be monitored for resources with material exhaustion risk.
## MUST NOT
- MUST NOT assume quota increase approval time is negligible.
- MUST NOT confuse quota with actual provider capacity availability.
## SHOULD
- Plans SHOULD maintain alternatives for scarce resource classes.
## Exceptions
Temporary quota risk requires escalation and contingency capacity.
## Verification
Inspect provider quota consoles/APIs, request status, alert thresholds, and provisioning tests.