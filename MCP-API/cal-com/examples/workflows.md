# Cal.com connector examples

`cal.availability.slots` (READ, no approval):
```json
{"eventTypeId":123,"start":"2026-09-01","end":"2026-09-02","timeZone":"Asia/Ho_Chi_Minh"}
```

`cal.booking.create` (WRITE, approval required):
```json
{"start":"2026-09-01T03:00:00Z","eventTypeId":123,"attendee":{"name":"Example User","email":"user@example.com","timeZone":"Asia/Ho_Chi_Minh"},"approval_token":"<payload-bound-hmac>"}
```

`cal.booking.cancel` (DESTRUCTIVE, approval + feature flag required):
```json
{"bookingUid":"booking-uid","cancellationReason":"Cancelled by operator","approval_token":"<payload-bound-hmac>"}
```
