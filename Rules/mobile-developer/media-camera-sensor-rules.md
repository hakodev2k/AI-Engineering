# Media, Camera, and Sensor Rules
## Purpose
Use device hardware safely, privately, and efficiently across capability and lifecycle differences.
## Scope
Camera, microphone, photos, Bluetooth, motion sensors, location, and media capture/playback.
## MUST
- Hardware access MUST be capability-checked and permission-aware before use.
- Capture resources MUST be released on lifecycle transitions and competing-session failures.
- Sensitive media MUST have explicit storage, transmission, retention, and deletion rules.
## MUST NOT
- Sensors or capture MUST NOT continue beyond user expectation without clear product and platform justification.
- Raw high-resolution media MUST NOT be retained or transmitted when a lower-cost representation meets the requirement.
## SHOULD
- Hardware features SHOULD provide graceful alternatives for unavailable or denied capabilities.
## Exceptions
Background sensing may be allowed for clearly disclosed safety/fitness/location use cases with platform-compliant permissions.
## Verification
Test permission states, interruptions, hardware absence, orientation, backgrounding, storage pressure, and privacy flows.