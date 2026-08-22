# Skill: Identity and Access Engineering

**Purpose:** create least-privilege Azure access paths.
**Trigger:** new workload identity, RBAC request, service-to-service access, tenant/subscription onboarding.
**Inputs:** actor, target resource, operations required, scope, duration, environment.
**Steps:**
1. Determine human vs workload identity.
2. Prefer managed identity/workload federation over stored credentials.
3. Map required operations to narrow built-in/custom role.
4. Select minimal scope: resource before resource group before subscription where practical.
5. Identify separation-of-duties and privileged approval requirements.
6. Validate authentication, authorization, logging, and revocation path.
7. Record owner and expiry for temporary privilege.
**Output:** access design and verification evidence.
**Failure:** if minimal permissions cannot be determined, do not grant broad access; escalate to identity/security owner.
