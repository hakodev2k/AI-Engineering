# Form Design Rules
## Purpose
Make data entry efficient, understandable, recoverable, and privacy-aware.
## Scope
Forms, validation, inputs, defaults, and submission.
## MUST
- Ask only for data necessary for the authorized purpose.
- Define format, required status, validation timing, error placement, and recovery for each field.
- Preserve valid input after recoverable failures where feasible.
- Confirm submissions with significant irreversible consequences.
## MUST NOT
- Use placeholder text as the only label.
- Clear entered data after recoverable errors without necessity.
## SHOULD
- Use native input types, sensible defaults, and progressive disclosure.
## Exceptions
Security-sensitive fields may prevent persistence when justified.
## Verification
Test keyboard use, validation, autofill, recovery, responsive behavior, and invalid data.