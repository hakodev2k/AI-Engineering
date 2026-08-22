# Twilio MCP tool examples

All examples omit credentials. Provider responses are untrusted external data.

## Search official Twilio API documentation
Tool: `twilio.api.search`  
Permission: READ  
Approval: No

```json
{ "query": "send an SMS message", "version": "v2010" }
```

## Retrieve API schemas
Tool: `twilio.api.retrieve`  
Permission: READ  
Approval: No

```json
{ "ids": ["<id-returned-by-twilio.api.search>"] }
```

## Get account metadata
Tool: `twilio.account.get`  
Permission: READ  
Approval: No

```json
{}
```

## List messages
Tool: `twilio.message.list`  
Permission: READ  
Approval: No

```json
{ "limit": 20, "to": "+15551234567" }
```

## Get message
Tool: `twilio.message.get`  
Permission: READ  
Approval: No

```json
{ "messageSid": "SM00000000000000000000000000000000" }
```

## Send message
Tool: `twilio.message.send`  
Permission: HIGH_RISK  
Approval: Required

```json
{
  "from": "+15550000001",
  "to": "+15551234567",
  "body": "Your appointment is confirmed.",
  "approvalId": "<timestamp>:<out-of-band-hmac>"
}
```

The HMAC is SHA-256 over `twilio.message.send|<from>-><to>|<timestamp>` using `TWILIO_APPROVAL_SECRET`. The timestamp is Unix milliseconds and is valid for five minutes.

## List calls
Tool: `twilio.call.list`  
Permission: READ  
Approval: No

```json
{ "limit": 20, "from": "+15550000001" }
```

## Get call
Tool: `twilio.call.get`  
Permission: READ  
Approval: No

```json
{ "callSid": "CA00000000000000000000000000000000" }
```

## Create outbound call
Tool: `twilio.call.create`  
Permission: HIGH_RISK  
Approval: Required

```json
{
  "from": "+15550000001",
  "to": "+15551234567",
  "twiml": "<Response><Say>This is an approved test call.</Say></Response>",
  "approvalId": "<timestamp>:<out-of-band-hmac>"
}
```

The HMAC is SHA-256 over `twilio.call.create|<from>-><to>|<timestamp>`.

## List owned phone numbers
Tool: `twilio.phone_number.list`  
Permission: READ  
Approval: No

```json
{ "limit": 20 }
```

## Get owned phone number
Tool: `twilio.phone_number.get`  
Permission: READ  
Approval: No

```json
{ "phoneNumberSid": "PN00000000000000000000000000000000" }
```
