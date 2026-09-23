# Workflow examples

All tools are `READ`, execute without human approval, and return JSON wrapped as `UNTRUSTED_PROVIDER_DATA`.

```json
{"tool":"abstract.email.validate","input":{"email":"person@example.com"},"expected":{"data":"Abstract email validation response","trust":"UNTRUSTED_PROVIDER_DATA"}}
```

```json
{"tool":"abstract.phone.validate","input":{"phone":"+12025550123","country":"US"},"expected":{"data":"validation/carrier metadata"}}
```

```json
{"tool":"abstract.ip.lookup","input":{"ip_address":"8.8.8.8"},"expected":{"data":"geolocation/network metadata"}}
```

```json
{"tool":"abstract.ip.risk","input":{"ip_address":"8.8.8.8"},"expected":{"data":{"security":"provider security flags"}}}
```

```json
{"tool":"abstract.company.enrich","input":{"domain":"example.com"},"expected":{"data":"company enrichment metadata"}}
```

```json
{"tool":"abstract.holiday.list","input":{"country":"US","year":2026,"month":12},"expected":{"data":"holiday array"}}
```

```json
{"tool":"abstract.timezone.current","input":{"location":"Ho Chi Minh City"},"expected":{"data":"current time/timezone metadata"}}
```

```json
{"tool":"abstract.exchange.live","input":{"base":"USD","target":"EUR"},"expected":{"data":"live exchange-rate response"}}
```