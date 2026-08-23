# Experiment Isolation Rules
## Purpose
Prevent tests from affecting unrelated systems or data.
## Scope
Target selection, tenancy, network boundaries, credentials, and test data.
## MUST
- Scope fault permissions to intended targets.
- Identify shared dependencies before execution.
- Isolate test data and traffic when feasible.
## MUST NOT
- Use broad administrative credentials when narrower permissions suffice.
- Assume logical isolation prevents shared-resource impact.
## SHOULD
- Use dedicated test cohorts and fault domains.
## Exceptions
Shared-infrastructure experiments require explicit dependency analysis and approval.
## Verification
Inspect IAM, selectors, dependency maps, and actual affected resources.