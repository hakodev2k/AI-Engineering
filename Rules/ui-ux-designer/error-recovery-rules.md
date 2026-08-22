# Error Recovery Rules
## Purpose
Help users prevent, understand, and recover from failures safely.
## Scope
Validation, system failures, conflicts, destructive actions, and interruptions.
## MUST
- Prevent predictable high-impact errors before execution where possible.
- Preserve user work and provide recovery for recoverable failures.
- Distinguish user-correctable errors, system failures, and permission restrictions.
- Define confirmation or undo proportional to consequence.
## MUST NOT
- Display raw internal details or secrets.
- Leave users uncertain whether a consequential action succeeded.
## SHOULD
- Prefer undo over repeated confirmation for low-risk reversible actions.
## Exceptions
Security controls may intentionally reveal limited detail.
## Verification
Test invalid input, timeout, conflict, cancellation, duplicate action, and recovery.