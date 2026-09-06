# Greenhouse workflows

## Hiring-pipeline inspection

1. `greenhouse.job.list` — READ — no connector approval.
2. `greenhouse.application.list` — READ — no connector approval.
3. `greenhouse.candidate.get` — READ — no connector approval.
4. `greenhouse.interview.list` — READ — no connector approval.

Expected output shape: `{ data: <Greenhouse JSON>, meta: { nextCursor?, rateLimitLimit?, rateLimitRemaining?, rateLimitReset? } }`.

## Human-approved candidate intake

Tool: `greenhouse.candidate.create`

Input:
```json
{"firstName":"Ada","lastName":"Example","emailAddresses":[{"value":"ada@example.com","type":"personal"}]}
```

Permission: WRITE. If approval is enabled, configure exact fingerprint `greenhouse.candidate.create:Ada:Example` outside the agent context.

## Human-approved application placement

Tool: `greenhouse.application.create`

Input:
```json
{"candidateId":123,"jobId":456}
```

Permission: HIGH_RISK. Always requires exact fingerprint `greenhouse.application.create:123:456`. The connector must not be used to autonomously decide who should apply, advance, be rejected, or be hired.
