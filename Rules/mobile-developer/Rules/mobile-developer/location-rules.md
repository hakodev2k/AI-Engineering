# Location Rules
## Purpose
Use location data accurately, minimally, and in line with user expectations and platform constraints.
## Scope
Foreground/background location, geofencing, precision, storage, transmission, and permission states.
## MUST
- Requested location precision and update frequency MUST be no greater than the feature requires.
- Background location MUST have explicit product need, disclosure, permission handling, and lifecycle controls.
- Location-derived decisions MUST account for accuracy, age, and unavailable state.
## MUST NOT
- A stale or low-accuracy coordinate MUST NOT be represented as precise current location.
- Location collection MUST NOT continue after the approved purpose ends.
## SHOULD
- Prefer coarse, significant-change, or geofence APIs when they meet the requirement with lower privacy/energy cost.
## Exceptions
Safety-critical tracking may use higher precision/frequency with explicit consent and measured energy impact.
## Verification
Test permission variants, approximate location, stale fixes, indoor/no-signal, backgrounding, travel, and retention.