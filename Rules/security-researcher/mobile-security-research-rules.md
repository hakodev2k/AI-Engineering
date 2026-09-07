# Mobile Security Research Rules

## Purpose
Ensure mobile application research accurately evaluates device, application, backend, and platform trust boundaries without overstating results from artificial test conditions.

## Scope
Applies to mobile applications, local storage, inter-process communication, deep links, WebViews, platform permissions, transport security, device attestation, and mobile-backend interactions.

## MUST
- Research MUST record application version, platform version, device or emulator state, signing context, and relevant security configuration.
- Findings that require rooted, jailbroken, instrumented, or otherwise modified devices MUST state that prerequisite explicitly.
- Local data findings MUST distinguish application-owned secrets from platform-protected storage and ordinary cached content.
- Backend authorization MUST be tested independently from client-side restrictions.
- Deep-link, IPC, WebView, and exported-component findings MUST identify the external caller capability and resulting boundary violation.
- Runtime instrumentation artifacts MUST be separated from behavior present in an unmodified application.
- Test accounts and synthetic data MUST be used where practical.
- Application packages and extracted data MUST be stored according to their sensitivity and licensing constraints.

## MUST NOT
- MUST NOT report bypasses that exist only because the researcher disabled a platform control without clearly qualifying the result.
- MUST NOT treat certificate-pinning bypass in a controlled device as proof that transport encryption is absent for ordinary users.
- MUST NOT use real-user credentials or content when dedicated test identities can demonstrate the issue.
- MUST NOT upload proprietary application packages or extracted secrets to public analysis services without authorization.

## SHOULD
- Test representative supported platform versions and security modes.
- Compare static manifest/configuration analysis with runtime enforcement.
- Consider application lifecycle, backups, screenshots, notifications, clipboard, and inter-app data flows where relevant.

## Exceptions
Testing on production accounts or real devices containing sensitive data requires documented necessity, minimized exposure, owner approval, and cleanup controls.

## Verification
Review build identity, device state, instrumentation settings, captured traffic, platform configuration, test identities, and backend logs where available. Confirm each claim remains valid under the prerequisites stated in the report.