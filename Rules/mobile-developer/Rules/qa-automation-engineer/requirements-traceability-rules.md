# Requirements Traceability Rules

## Purpose
Keep automated assertions connected to intended behavior and risk so tests do not institutionalize accidental implementation.

## Scope
Applies to acceptance criteria, specifications, defects, business rules, and automated regression cases.

## MUST
- Critical automated scenarios MUST have a traceable reason for existence: requirement, risk, defect, contract, or operational expectation.
- Ambiguous expected behavior MUST be clarified before changing assertions to match observed output.
- Requirement changes MUST trigger review of affected tests and obsolete expectations.
- Tests for resolved defects MUST encode the relevant behavioral regression, not incidental reproduction details.

## MUST NOT
- MUST NOT update expected values solely because the implementation changed.
- MUST NOT preserve obsolete tests when the underlying requirement has been intentionally retired.
- MUST NOT claim requirement coverage from a test that lacks a meaningful assertion of that requirement.

## SHOULD
- Keep traceability lightweight and close to test metadata or documentation.
- Prioritize traceability for critical and regulated behavior.

## Exceptions
Exploratory automation may lack formal traceability but must not be presented as complete acceptance coverage.

## Verification
Review test metadata, acceptance criteria, requirement diffs, defect links, assertion intent, and obsolete-case cleanup.