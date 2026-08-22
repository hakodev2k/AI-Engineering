# Time, Date, and Time-Zone Rules
## Purpose
Prevent scheduling and temporal defects caused by device clocks, daylight saving changes, and zone ambiguity.
## Scope
Timestamps, local dates, schedules, durations, expiry, reminders, and synchronization.
## MUST
- Instants exchanged across systems MUST carry unambiguous time semantics, normally UTC or explicit offset/zone.
- Business-local dates/times MUST retain the intended time-zone context when future interpretation depends on it.
- Expiry or security decisions MUST NOT rely solely on an untrusted device clock when server authority is available.
## MUST NOT
- Fixed offsets MUST NOT be treated as time zones for recurring future schedules.
- Calendar durations MUST NOT be computed as fixed hours when daylight-saving transitions matter.
## SHOULD
- Time calculations SHOULD use platform/library temporal types that represent the intended concept explicitly.
## Exceptions
Products operating permanently in a fixed-offset domain may use fixed offsets when the domain guarantee is documented.
## Verification
Test DST gaps/overlaps, zone changes, clock skew, midnight boundaries, leap dates, offline expiry, and travel scenarios.