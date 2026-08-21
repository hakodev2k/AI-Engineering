# Kubernetes Platform Rules

## Purpose
Operate Kubernetes as a reliable shared platform rather than an unmanaged cluster collection.

## Scope
Applies to clusters, namespaces, controllers, admission, scheduling, upgrades, networking, and platform add-ons.

## MUST
- Cluster upgrades MUST have compatibility, rollback, and workload-impact assessment.
- Platform controllers and add-ons MUST have declared ownership and support lifecycle.
- Admission and namespace policies MUST enforce baseline security and resource controls.
- Critical platform components MUST have availability and recovery expectations.

## MUST NOT
- MUST NOT expose cluster-admin access as a normal developer workflow.
- MUST NOT install unreviewed cluster-wide controllers in production.
- MUST NOT upgrade core components without validating API deprecations and workload compatibility.

## SHOULD
- Prefer standardized cluster configurations and automated conformance checks.
- Minimize cluster-wide privileges.

## Exceptions
Nonstandard clusters require documented workload justification, risk, owner, and support expectations.

## Verification
Use conformance tests, policy checks, RBAC review, upgrade rehearsals, controller health metrics, and configuration diffing.