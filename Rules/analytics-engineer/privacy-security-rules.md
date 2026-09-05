# Privacy and Security Rules

## Purpose
Protect sensitive analytical data and enforce least-privilege access throughout the analytics lifecycle.

## Scope
Applies to warehouses, transformation jobs, development datasets, semantic models, exports, logs, and credentials.

## MUST
- Access to sensitive data MUST follow least privilege and documented business need.
- Sensitive fields MUST be classified and protected according to applicable policy.
- Secrets and credentials MUST be stored in approved secret-management mechanisms.
- Non-production use of production-sensitive data MUST follow masking, minimization, or approved access controls.
- Data exports and downstream shares MUST preserve required access and retention controls.

## MUST NOT
- MUST NOT commit credentials or tokens to source control.
- MUST NOT log secrets, authentication tokens, or unnecessary sensitive record contents.
- MUST NOT broaden dataset permissions solely to unblock development without approval.
- MUST NOT copy governed sensitive data to unmanaged local storage.

## SHOULD
- Prefer role-based access and short-lived credentials.
- Minimize collection and retention of fields not required for analytical purpose.

## Exceptions
Exceptions require documented necessity, risk, compensating controls, duration, and security or data-owner approval.

## Verification
Review IAM grants, warehouse roles, secret references, masking policies, audit logs, exports, and retention settings.