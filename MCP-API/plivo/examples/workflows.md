# Plivo workflow examples

- Inspect delivery: `plivo.message.list` then `plivo.message.get`. READ, no approval.
- Send SMS: `plivo.message.send` with `{ "src":"+14155550100", "dst":"+14155550123", "text":"Hello", "approved":true }`. HIGH_RISK, explicit human approval.
- Investigate calls: `plivo.call.list` then `plivo.call.get`. READ, no approval.
- Start call: `plivo.call.create` with HTTPS `answer_url` and `approved:true`. HIGH_RISK.
- End active call: `plivo.call.hangup` with call UUID and `approved:true`. HIGH_RISK; never retried automatically.
