# LogSnag connector examples

## Publish an operational event
Tool: `logsnag.event.publish`  
Permission: WRITE. Approval: required by default.
```json
{"project":"my-saas","channel":"deployments","event":"API deployed","description":"version 2.4.1","tags":{"environment":"production"},"approval":true}
```
Expected shape: JSON returned by LogSnag, wrapped as MCP text content.

## Publish an urgent notification
Tool: `logsnag.event.publish_notification`  
Permission: HIGH_RISK. Approval: always required; `LOGSNAG_ALLOW_NOTIFICATIONS=true` must also be configured.
```json
{"project":"my-saas","channel":"incidents","event":"Database unavailable","icon":"🚨","approval":true}
```

## Identify a user
Tool: `logsnag.user.identify`  
Permission: WRITE. Approval: required by default.
```json
{"project":"my-saas","user_id":"usr_123","properties":{"plan":"pro","trial":false},"approval":true}
```

## Update KPI
Tool: `logsnag.insight.set`
```json
{"project":"my-saas","title":"Monthly Revenue","value":12500,"icon":"💰","approval":true}
```

Tool: `logsnag.insight.increment`
```json
{"project":"my-saas","title":"Active Users","value":1,"approval":true}
```
