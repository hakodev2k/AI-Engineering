# Infrastructure as Code with CloudFormation and CDK

## Purpose
Manage AWS infrastructure reproducibly with CloudFormation/CDK, safe change review, drift control, and reusable constructs.

## When to use
Use for provisioning, standardizing infrastructure, replacing manual configuration, or reviewing deployment risk.

## Inputs
Desired architecture, environment parameters, account/region targets, deployment pipeline, compliance controls, existing stacks.

## Context to inspect
Stacks, templates, CDK constructs, bootstrap setup, change sets, drift, stack policies, outputs/exports, resource retention policies.

## Core knowledge
IaC source is desired state; actual state may drift. Some CloudFormation replacements are destructive. CDK abstractions must still be reviewed as synthesized CloudFormation and IAM changes.

## Procedure
1. Inspect existing IaC conventions and stack boundaries.
2. Model resources with stable logical ownership.
3. Parameterize only genuine environment differences.
4. Apply least-privilege IAM to deployment and runtime roles.
5. Synthesize/validate templates and inspect generated policies.
6. Generate change sets before production changes.
7. Identify replacements, deletions, and data-retention implications.
8. Deploy progressively with rollback monitoring.
9. Detect and remediate drift intentionally.
10. Version reusable constructs and migration notes.

## Decision points
Use CDK when higher-level composition improves maintainability; use raw CloudFormation when generated abstraction adds little value. Split stacks when ownership/lifecycle boundaries differ materially.

## Common failure patterns
Monolithic stacks, manual console edits, accidental resource replacement, hard-coded account IDs, circular exports, and unreviewed wildcard IAM from generated templates.

## Verification
Validate templates, review change sets, test rollback, detect drift, and confirm deployed resources match intent.

## Expected output
Maintainable IaC, reviewed change set, deployment evidence, and rollback plan.

## Stop conditions
Escalate when a change set includes unexpected replacement/deletion of stateful production resources or required permissions are unclear.