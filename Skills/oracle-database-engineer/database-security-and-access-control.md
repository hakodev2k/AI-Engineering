# Database Security and Access Control

## Purpose
Design Oracle authentication, authorization, auditing, and privilege boundaries using least privilege and defensible administrative controls.

## When to use
Use for new applications/users, security reviews, privilege cleanup, production access, or audit findings.

## Inputs
Identity model, application roles, administrative duties, compliance requirements, existing grants, audit policy.

## Context to inspect
Users, roles, system/object privileges, PUBLIC grants, proxy/external authentication, profiles, password policy, definer/invoker rights, unified auditing, network ACLs, and privileged accounts.

## Core knowledge
Oracle roles and privileges can create indirect escalation paths. Least privilege must include code execution rights, ownership, dynamic SQL, and administrative capabilities.

## Procedure
1. Classify human, service, schema-owner, and administrative identities.
2. Separate object ownership from runtime access where practical.
3. Inventory direct and role-derived privileges.
4. Remove PUBLIC or broad grants that lack justified consumers.
5. Define least-privilege application roles.
6. Review definer-rights PL/SQL and dynamic SQL.
7. Enforce approved authentication and account profiles.
8. Configure auditing for privileged and sensitive actions.
9. Test denied as well as allowed paths.
10. Establish periodic access review and emergency-access procedures.

## Decision points
Prefer centralized/external identity when operationally supported. Grant privileges to roles rather than individuals except where Oracle semantics require direct grants.

## Common failure patterns
DBA role for applications, shared accounts, hidden definer-rights escalation, broad EXECUTE grants, and audit logs nobody reviews.

## Verification
Run privilege-path reviews, negative authorization tests, account audits, and sample audit-event verification.

## Expected output
A least-privilege access model and auditable control evidence.

## Stop conditions
Stop when ownership/accountability is unclear or requested privileges exceed approved business need.