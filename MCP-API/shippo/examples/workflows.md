# Shippo MCP workflow examples

## Rate a shipment
Tool: `shippo.shipment.create`
Input: `{ "addressFrom": { "name":"Sender","street1":"1 Main St","city":"San Francisco","state":"CA","zip":"94105","country":"US" }, "addressTo": { "name":"Receiver","street1":"2 Pine St","city":"Seattle","state":"WA","zip":"98101","country":"US" }, "parcels":[{"length":"10","width":"8","height":"4","distance_unit":"in","weight":"2","mass_unit":"lb"}], "approved":true }`
Expected output: Shippo shipment object containing rate objects/status information.
Permission: WRITE. Approval: yes when default policy is `writes`.

## Inspect a rate
Tool: `shippo.rate.get`
Input: `{ "rateId":"rate_xxx" }`
Expected output: rate metadata including carrier/service/amount fields returned by Shippo.
Permission: READ. Approval: no by default.

## Purchase a label
Tool: `shippo.label.purchase`
Input: `{ "rateId":"rate_xxx", "labelFileType":"PDF_4x6", "approved":true }`
Expected output: transaction object with status and label/tracking metadata when successful.
Permission: HIGH_RISK. Approval: always explicit because the operation purchases postage.

## Track a package
Tool: `shippo.track.get`
Input: `{ "carrier":"usps", "trackingNumber":"TRACKING_NUMBER" }`
Expected output: tracking status/history returned by Shippo.
Permission: READ. Approval: no by default.

## Request a refund
Tool: `shippo.refund.request`
Input: `{ "transactionId":"txn_xxx", "approved":true }`
Expected output: refund object/status.
Permission: DESTRUCTIVE. Approval: explicit; additionally disabled until `SHIPPO_ALLOW_DESTRUCTIVE=true`.
