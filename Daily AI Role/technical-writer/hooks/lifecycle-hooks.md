# Lifecycle Hooks

## pre-draft
- Validate request contract.
- Resolve audience, task, version, source artifacts, owner, and risk.
- Stop if critical behavior is unsupported by evidence.

## pre-review
- Run link/example checks available to the environment.
- Ensure source map covers material claims.
- Reject secrets, credentials, invented outputs, and unresolved placeholders.

## pre-publish
- Confirm approvals for high-risk content.
- Recheck supported version and release state.
- Halt if source behavior changed after review.

## post-publish
- Verify rendered links/navigation and publication scope.
- Record owner and next update trigger.

## incident-close
- Record root cause, lesson, process improvement, prevention owner, and due date.

Hooks SHOULD be read-only and idempotent where possible.