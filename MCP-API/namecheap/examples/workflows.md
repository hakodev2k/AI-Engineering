# Namecheap workflows

Read inventory with `namecheap.domain.list`, inspect a target with `namecheap.domain.get`, then inspect nameservers and host records with `namecheap.dns.nameserver.list` and `namecheap.dns.host.list`. These are READ operations.

DNS changes are HIGH_RISK. Read the complete existing host set first, prepare the full replacement payload, obtain a payload-bound approval token from a trusted approval service, then call `namecheap.dns.host.replace_all`. Namecheap documents that `setHosts` deletes records omitted from the request, so never send only the new record.

Nameserver replacement follows the same read -> prepare -> human approve -> execute flow. Use sandbox first.