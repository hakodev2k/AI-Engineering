#!/usr/bin/env python3
"""Validate permission/interrupt provenance from JSONL. Exit 0 pass, 2 violations, 3 input error."""
from __future__ import annotations
import argparse,json,sys
from datetime import datetime,timezone
from pathlib import Path

def ts(v): return datetime.fromisoformat(v.replace('Z','+00:00')).astimezone(timezone.utc)
def main():
 p=argparse.ArgumentParser();p.add_argument('events',type=Path);p.add_argument('--policy',type=Path,required=True);p.add_argument('--report',type=Path);a=p.parse_args()
 try:
  pol=json.loads(a.policy.read_text()); ev=[]
  for n,l in enumerate(a.events.read_text().splitlines(),1):
   if l.strip():
    x=json.loads(l);x['_line']=n;ev.append(x)
  human=set(pol.get('human_sources',['human'])); max_age=int(pol.get('max_decision_age_seconds',900)); req={};dec={};bad=[];ok=[]
  for e in ev:
   t=e.get('type'); rid=e.get('request_id'); sid=e.get('session_id'); key=(sid,rid)
   if t=='permission_request':
    if not rid: bad.append({'line':e['_line'],'code':'request_missing_id'})
    elif key in req: bad.append({'line':e['_line'],'code':'duplicate_request'})
    else:req[key]=e
   elif t=='decision':
    act=e.get('action');src=e.get('source','unknown')
    if act not in {'approve','deny','stop','cancel'}:bad.append({'line':e['_line'],'code':'invalid_action'});continue
    if not rid:bad.append({'line':e['_line'],'code':'decision_missing_request_id'});continue
    r=req.get(key)
    if not r:
     bad.append({'line':e['_line'],'code':'cross_session_decision' if any(k[1]==rid for k in req) else 'orphan_decision'});continue
    if key in dec and dec[key].get('action')!=act:bad.append({'line':e['_line'],'code':'conflicting_decisions'});continue
    dec[key]=e
    if src not in human:ok.append({'session_id':sid,'request_id':rid,'classification':'non_human','action':act,'source':src});continue
    if pol.get('require_tool_use_id_when_available',True) and r.get('tool_use_id') and e.get('tool_use_id')!=r.get('tool_use_id'):
     bad.append({'line':e['_line'],'code':'tool_use_id_mismatch'});continue
    try:
     age=abs((ts(e['timestamp'])-ts(r['timestamp'])).total_seconds())
     if age>max_age:bad.append({'line':e['_line'],'code':'stale_human_decision','age_seconds':age});continue
    except Exception:bad.append({'line':e['_line'],'code':'timestamp_error'});continue
    ok.append({'session_id':sid,'request_id':rid,'classification':'verified_human','action':act,'source':src})
  verified={(x['session_id'],x['request_id']) for x in ok if x['classification']=='verified_human'}
  for e in ev:
   if e.get('type')=='tool_result' and e.get('claims_human_intent') is True and (e.get('session_id'),e.get('request_id')) not in verified:
    bad.append({'line':e['_line'],'code':'unverified_human_attribution'})
  out={'status':'fail' if bad else 'pass','events':len(ev),'requests':len(req),'verified':ok,'violations':bad}; text=json.dumps(out,indent=2,sort_keys=True)
  if a.report:a.report.write_text(text+'\n')
  print(text);return 2 if bad else 0
 except Exception as ex:print(json.dumps({'status':'error','error':str(ex)}),file=sys.stderr);return 3
if __name__=='__main__':raise SystemExit(main())
