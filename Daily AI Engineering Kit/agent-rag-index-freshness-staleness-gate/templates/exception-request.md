# Freshness Exception Request

Use only when the gate blocks and a temporary business exception is necessary.

- Requested by:
- Requested at:
- Expires at (maximum 4 hours unless policy is changed through normal review):
- Affected index/environment:
- Affected document/query scope:
- Gate result evidence path:
- Confirmed stale/unknown reason:
- User/business impact:
- Why remediation cannot complete first:
- Compensating control (for example source-only response, warning, feature disablement, or narrowed retrieval):
- Rollback/expiry mechanism:
- Approver:
- Approval reference:

An exception must never authorize index deletion, security-control weakening, secret changes, permission escalation, or production configuration mutation. Those actions require their own explicit approval.
