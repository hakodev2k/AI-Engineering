# Skill: Self-Service Automation

**Purpose:** convert a defined platform contract into safe repeatable automation.

**Preconditions:** contract and ownership are approved; destructive boundaries are known.

**Procedure:**
1. Model desired inputs and resulting state.
2. Prefer idempotent operations and stable identifiers.
3. Validate permissions before mutation.
4. Add dry-run/plan or scoped preview when practical.
5. Bound retries and classify retryable vs permanent errors.
6. Emit useful status, correlation identifiers, and audit evidence.
7. Make cleanup/rollback explicit.
8. Test concurrent requests and partial failure when shared resources are involved.

**Constraints:** no embedded secrets; no unbounded loops; no destructive default; do not silently widen permissions.

**Output:** automation contract, implementation, validation evidence, rollback instructions.

**Stop conditions:** approval missing, ownership ambiguous, operation cannot be safely bounded, or rollback/containment is undefined for high-risk change.
