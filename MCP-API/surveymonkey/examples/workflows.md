# SurveyMonkey connector examples

## Search surveys
Tool: `surveymonkey.survey.list`

```json
{"query":"customer satisfaction","page":1,"perPage":25}
```

Permission: `surveys_read`. Risk: READ. Approval: no.
Expected output: SurveyMonkey list payload plus connector metadata marking provider content as untrusted.

## Inspect a survey and responses
1. `surveymonkey.survey.details.get` with `{"surveyId":"123456789"}`.
2. `surveymonkey.response.list` with `{"surveyId":"123456789","page":1,"perPage":50}`.
3. `surveymonkey.response.summary` with `{"surveyId":"123456789"}`.

Permissions: `surveys_read`, `responses_read_detail`. Risk: READ. Approval: no.

## Create a survey
Tool: `surveymonkey.survey.create`

```json
{"title":"Post-event feedback","language":"en","approvalToken":"<operator-issued-token>"}
```

Permission: `surveys_write`. Risk: WRITE. Approval: required and connector-controlled.

## Create a shareable survey link
Tool: `surveymonkey.collector.create_link`

```json
{"surveyId":"123456789","name":"Public feedback link","approvalToken":"<operator-issued-token>"}
```

Permission: `collectors_write`. Risk: HIGH_RISK because the resulting URL can be distributed externally. Approval: required.

## Create an event webhook
Tool: `surveymonkey.webhook.create`

```json
{
  "name":"Completed response events",
  "subscriptionUrl":"https://hooks.example.com/surveymonkey",
  "eventType":"response_completed",
  "objectType":"survey",
  "objectIds":["123456789"],
  "approvalToken":"<operator-issued-token>"
}
```

Permission: `webhooks_write`. Risk: HIGH_RISK because SurveyMonkey will send data to an external endpoint. Approval: required.
