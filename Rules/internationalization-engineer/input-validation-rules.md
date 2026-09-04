# Localized Input Validation Rules

## Purpose
Validate international user input without rejecting legitimate names, addresses, numbers, or text because of locale-specific assumptions.

## Scope
Applies to forms, identifiers, names, addresses, phone numbers, postal codes, numeric/date input, and localized validation feedback.

## MUST
- Validation MUST distinguish business constraints from formatting preferences and MUST accept all valid values allowed by the domain.
- Localized numeric and date inputs MUST use explicit locale-aware parsing or unambiguous input contracts.
- Names and free-form identity fields MUST support the Unicode repertoire required by supported users unless a narrower external-system constraint is documented.
- Validation errors MUST identify the violated constraint without exposing internal implementation details.
- Client and server validation MUST agree on authoritative acceptance criteria.

## MUST NOT
- Validation MUST NOT assume one universal name order, fixed name-part count, ASCII-only identity data, or one postal-address structure.
- Browser locale alone MUST NOT determine security-sensitive validation rules.
- Invalid input MUST NOT be silently coerced into a materially different value.

## SHOULD
- Inputs SHOULD provide examples tailored to the selected locale when format expectations differ.
- Normalization SHOULD occur after preserving enough original input for audit or user correction when required.

## Exceptions
Exceptions require evidence of an external constraint, affected users, fallback or escalation path, and review of discrimination/access impact.

## Verification
Test realistic international names, addresses, numbers, dates, scripts, combining marks, malformed values, client/server parity, and localized error messages.