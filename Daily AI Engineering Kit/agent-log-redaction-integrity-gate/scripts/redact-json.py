#!/usr/bin/env python3
import argparse, json, pathlib, re, sys
DEFAULT_SECRET=['password','passwd','secret','token','authorization','cookie','api_key','apikey','client_secret','private_key','connection_string']
DEFAULT_PII=['email','phone','ssn','national_id','credit_card','card_number']
def load_policy(path):
 if not path: return {'secret_key_patterns':DEFAULT_SECRET,'pii_key_patterns':DEFAULT_PII,'replacement':'[REDACTED]'}
 return json.loads(pathlib.Path(path).read_text(encoding='utf-8'))
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('input'); ap.add_argument('--policy'); ap.add_argument('--output'); a=ap.parse_args()
 try: data=json.loads(pathlib.Path(a.input).read_text(encoding='utf-8')); p=load_policy(a.policy)
 except Exception as e: print(f'input error: {e}',file=sys.stderr); return 2
 pats=[re.compile(x,re.I) for x in p.get('secret_key_patterns',[])+p.get('pii_key_patterns',[])]
 repl=p.get('replacement','[REDACTED]')
 def scrub(v):
  if isinstance(v,dict): return {k:(repl if any(rx.search(k) for rx in pats) else scrub(val)) for k,val in v.items()}
  if isinstance(v,list): return [scrub(x) for x in v]
  return v
 out=json.dumps(scrub(data),indent=2,ensure_ascii=False)
 if a.output: pathlib.Path(a.output).write_text(out+'\n',encoding='utf-8')
 else: print(out)
 return 0
if __name__=='__main__': raise SystemExit(main())
