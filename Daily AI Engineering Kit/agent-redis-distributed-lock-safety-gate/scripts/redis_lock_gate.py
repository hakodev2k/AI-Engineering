#!/usr/bin/env python3
import argparse, json, os, secrets, sys, time
try:
    import redis
except ImportError:
    print('redis package required: pip install redis', file=sys.stderr); sys.exit(2)

RELEASE_LUA = """
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0
"""
RENEW_LUA = """
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('PEXPIRE', KEYS[1], ARGV[2])
end
return 0
"""
FENCE_LUA = """
local token = redis.call('INCR', KEYS[2])
local ok = redis.call('SET', KEYS[1], ARGV[1] .. ':' .. token, 'NX', 'PX', ARGV[2])
if ok then return token end
return 0
"""

def connect():
    url=os.getenv('REDIS_URL')
    if not url: raise RuntimeError('REDIS_URL is required')
    return redis.Redis.from_url(url, decode_responses=True, socket_connect_timeout=3, socket_timeout=3)

def acquire(r,key,lease_ms,retries,backoffs):
    owner=secrets.token_hex(16)
    fence_key=key+':fence'
    for i in range(retries+1):
        token=r.eval(FENCE_LUA,2,key,fence_key,owner,lease_ms)
        if int(token)>0: return owner,int(token)
        if i<retries: time.sleep(backoffs[min(i,len(backoffs)-1)]/1000)
    raise TimeoutError('lock acquisition failed')

def release(r,key,owner,fence):
    return int(r.eval(RELEASE_LUA,1,key,f'{owner}:{fence}'))==1

def renew(r,key,owner,fence,lease_ms):
    return int(r.eval(RENEW_LUA,1,key,f'{owner}:{fence}',lease_ms))==1

def main():
    p=argparse.ArgumentParser()
    p.add_argument('command',choices=['acquire','renew','release','inspect'])
    p.add_argument('--key',required=True); p.add_argument('--lease-ms',type=int,default=30000)
    p.add_argument('--owner'); p.add_argument('--fence',type=int)
    args=p.parse_args(); r=connect()
    try: r.ping()
    except Exception as e: print(json.dumps({'status':'error','error':str(e)})); return 3
    if args.command=='acquire':
        try:
            owner,fence=acquire(r,args.key,args.lease_ms,3,[100,300,900])
            print(json.dumps({'status':'acquired','key':args.key,'owner':owner,'fencing_token':fence,'lease_ms':args.lease_ms}))
            return 0
        except TimeoutError as e: print(json.dumps({'status':'blocked','error':str(e)})); return 4
    if args.command=='inspect':
        print(json.dumps({'key':args.key,'value':r.get(args.key),'ttl_ms':r.pttl(args.key)})); return 0
    if not args.owner or args.fence is None:
        print('renew/release require --owner and --fence',file=sys.stderr); return 2
    ok=renew(r,args.key,args.owner,args.fence,args.lease_ms) if args.command=='renew' else release(r,args.key,args.owner,args.fence)
    print(json.dumps({'status':'ok' if ok else 'ownership_mismatch','key':args.key}))
    return 0 if ok else 5
if __name__=='__main__': sys.exit(main())
