# Complaint and Feedback Rules

## Purpose
Use recipient complaints as a primary safety signal and prevent repeat unwanted mail.

## Scope
Feedback loops, provider complaint events, abuse reports, suppression, and root-cause analysis.

## MUST
- Supported complaint feedback sources MUST be integrated for material sending streams.
- A valid complaint MUST suppress future applicable promotional traffic promptly.
- Complaint rates MUST be measured by stream, campaign, acquisition source, and major receiver when data permits.
- Threshold breaches MUST trigger containment and root-cause investigation before scale resumes.
- Complaint evidence MUST be handled as sensitive recipient data.

## MUST NOT
- MUST NOT resend promotional mail to a complainant to test whether the complaint was intentional.
- MUST NOT hide complaint spikes by changing denominator definitions or moving traffic between identities.
- MUST NOT dismiss receiver complaint signals solely because internal engagement appears positive.

## SHOULD
- Correlate complaints with acquisition provenance, frequency, content, and targeting changes.
- Maintain alert thresholds below known receiver enforcement levels where practical.

## Exceptions
No routine exception permits overriding a confirmed complaint suppression. Legitimate operational messages require separate purpose classification and controls.

## Verification
Inspect feedback-loop configuration, complaint events, suppression state, dashboards, alerts, and campaign cohorts. Confirm test complaints propagate through the complete pipeline.