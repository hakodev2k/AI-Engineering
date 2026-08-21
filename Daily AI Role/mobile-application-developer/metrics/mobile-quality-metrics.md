# Mobile Quality Metrics

Track trends by platform, OS, app/build version, release cohort and critical journey where privacy-safe.

- Crash-free users/sessions and crash regression by release.
- Hang/ANR rate where platform supports it.
- Cold/warm startup percentile against agreed budget.
- Critical interaction/flow latency percentile.
- Critical journey success/failure rate.
- Sync queue depth, oldest pending age, retry rate, conflict rate and terminal failure rate.
- API/network error rate split by timeout, connectivity, server and client validation.
- Migration failure/recovery rate.
- Permission-denial impact on feature completion.
- Accessibility defects escaping review.
- Store rejection rate and cause.
- Staged-rollout stop events and time-to-detect.
- Defect reopen/regression rate.

Metrics are diagnostic, not vanity goals. Never improve a metric by hiding failures, dropping telemetry, excluding affected cohorts without explanation, or collecting unnecessary personal data. Every threshold used for go/no-go must name the measurement window and owner.