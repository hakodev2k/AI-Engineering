# Secrets and Sensitive Data

## Purpose
Prevent credential and sensitive-data exposure through Terraform configuration, state, logs, and outputs.

## Scope
Variables, outputs, state, providers, CI/CD, modules, generated plans, and logs.

## MUST
- Secrets MUST come from approved secret-management mechanisms or protected runtime inputs.
- Sensitive variables and outputs MUST be marked sensitive where Terraform supports it.
- Access to state and plan artifacts containing sensitive values MUST be restricted.
- Credentials used by Terraform MUST be short-lived or rotated according to organizational policy and least privilege.

## MUST NOT
- Secrets MUST NOT be hard-coded in Terraform source, tfvars committed to source control, examples, or documentation.
- Sensitive values MUST NOT be intentionally printed to CI logs or exposed through unnecessary outputs.
- Marking a value sensitive MUST NOT be treated as encryption or complete data protection.

## SHOULD
- Workload identity or federation SHOULD replace static cloud credentials where supported.
- Modules SHOULD minimize propagation of sensitive values.

## Exceptions
Legacy constraints require documented risk, compensating controls, migration plan, and security approval.

## Verification
Run secret scanning, inspect variables/outputs, repository history, backend controls, CI logs, IAM configuration, plan/state access, and credential lifetime settings.