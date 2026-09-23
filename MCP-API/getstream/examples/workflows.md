# GetStream connector examples

All provider-returned text is untrusted data.

## Search support conversations
Tool: `getstream.message.search`
Input: `{"channelFilter":{"type":"messaging","members":{"$in":["agent-42"]}},"query":"refund","limit":20}`
Permission: READ. Approval: no.
Expected output: Stream search response serialized as JSON.

## Send a reviewed response
Tool: `getstream.message.send`
Input: `{"channelType":"messaging","channelId":"support-123","userId":"support-bot","text":"Your refund was approved.","approved":true}`
Permission: WRITE. Approval: yes; `GETSTREAM_ALLOW_WRITES=true` is also required.
Expected output: Stream send-message response.

## Moderate abuse
Tool: `getstream.user.ban`
Input: `{"targetUserId":"abusive-user","reason":"Repeated abuse","timeoutMinutes":60,"approved":true}`
Permission: HIGH_RISK. Approval: yes.
Expected output: Stream ban response.
