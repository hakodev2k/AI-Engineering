# Date, Time, and Timezone Rules

## Purpose
Prevent temporal ambiguity and localization defects across regions, daylight-saving transitions, and user preferences.

## Scope
Applies to date/time storage, timezone conversion, display, parsing, scheduling interfaces, and localized temporal text.

## MUST
- Persistent instants MUST use an unambiguous representation and MUST preserve the timezone or zone identifier when wall-clock intent matters.
- User-facing dates and times MUST be formatted with locale-aware libraries and an explicit timezone policy.
- Ambiguous and nonexistent local times around timezone transitions MUST have defined handling.
- Inputs representing dates without times MUST remain distinct from timestamps.
- Relative-time output MUST be tested around day, month, year, and daylight-saving boundaries.

## MUST NOT
- Display code MUST NOT assume server-local timezone equals user timezone.
- Localized dates MUST NOT be parsed using one hard-coded numeric date order.
- Timezone offsets MUST NOT be treated as permanent substitutes for timezone identifiers when future civil-time behavior matters.

## SHOULD
- Interfaces SHOULD make the effective timezone visible when ambiguity could cause material user error.
- Canonical interchange formats SHOULD be used between services while localization remains at presentation boundaries.

## Exceptions
Exceptions require documented temporal semantics, affected users, ambiguity analysis, and tests demonstrating safe behavior.

## Verification
Test locale-specific formatting, multiple zones, DST transitions, leap dates, boundary instants, date-only values, invalid inputs, and round-trip behavior.