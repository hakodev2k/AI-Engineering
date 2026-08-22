# Notification Permission Rules
## Purpose
Preserve user trust and functionality when notification authorization is optional, denied, or revoked.
## Scope
Notification permission prompts, channels/categories, preferences, badges, sounds, and fallback communication.
## MUST
- Permission requests MUST occur with understandable context and only when notification value can be explained.
- Application state MUST remain correct when notifications are disabled or delivery fails.
- User notification preferences MUST be honored independently of OS authorization where applicable.
## MUST NOT
- Critical business state MUST NOT depend solely on receiving a push notification.
- Repeated coercive permission prompts MUST NOT be used after denial beyond platform/product policy.
## SHOULD
- Notification categories/channels SHOULD allow users to control materially different message types.
## Exceptions
Regulated or managed-device environments may have centrally controlled notification behavior.
## Verification
Test first prompt, denial, revocation, partial channel disablement, reinstall, account switching, and missed delivery.