# App Store Compliance Rules

## Purpose
Prevent avoidable rejection, disclosure mismatch, entitlement misuse, and distribution risk.

## Scope
App Store submission, privacy declarations, permissions, account behavior, purchases, metadata, and platform policy-sensitive features.

## MUST
- Shipping behavior MUST match declared privacy practices, permissions, and user-facing disclosures.
- Permission prompts MUST be preceded by legitimate product context and use accurate purpose strings.
- Account, subscription, purchase, and restoration behavior MUST follow applicable platform contracts.
- Policy-sensitive capabilities MUST be reviewed against current platform requirements before submission.
- Submission metadata MUST accurately describe material functionality and data practices.

## MUST NOT
- MUST NOT misrepresent data collection, functionality, or entitlement use to obtain approval.
- MUST NOT hide review-only behavior or remotely activate prohibited functionality after review.
- MUST NOT request permissions unrelated to active user value.

## SHOULD
- Maintain a release checklist for privacy manifests, SDK declarations, screenshots, metadata, and reviewer notes.
- Re-check requirements after major SDK or platform-policy changes.

## Exceptions
Ambiguous policy interpretations require documented analysis and authorized product/legal review where material.

## Verification
Compare the release binary and SDK inventory with privacy declarations, inspect permission strings and entitlements, test purchases/account flows, and review current submission requirements before release.