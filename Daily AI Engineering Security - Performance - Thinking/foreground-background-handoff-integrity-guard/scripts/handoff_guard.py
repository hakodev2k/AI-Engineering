#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, math, sys
from collections import defaultdict
from pathlib import Path

EVENTS={'foreground_started','auto_backgrounded','background_ack','completed','failed','cancelled','notification','poll'}
TERMINALS={'completed','failed','cancelled'}

def p95(values):
    if not values: return None
    s=sorted(values); return s[max(0,math.ceil(.95*len(s))-1)]

def load(path:Path):
    rows=[]
    for n,line in enumerate(path.read_text(encoding='utf-8').splitlines(),1):
        if not line.strip(): continue
        obj=json.loads(line)
        cid=obj.get('command_id'); event=obj.get('event'); ts=obj.get('ts')
        if not isinstance(cid,str) or not cid or event not in EVENTS or not isinstance(ts,(int,float)) or ts<0:
            raise ValueError(f'invalid record at line {n}')
        rows.append({'command_id':cid,'event':event,'ts':float(ts)})
    return rows

def analyze(rows,ack_deadline,notify_deadline):
    grouped=defaultdict(list)
    for r in rows: grouped[r['command_id']].append(r)
    metrics={'transitions':0,'healthy_transitions':0,'missing_ack':0,'late_ack':0,'missing_terminal':0,'missing_notification':0,'late_notification':0,'duplicate_terminal':0,'polls_while_running':0,'polls_after_terminal':0}
    ack_lags=[]; notification_lags=[]; violations=[]
    for cid,events in grouped.items():
        events=sorted(events,key=lambda x:x['ts']); transitions=[e for e in events if e['event']=='auto_backgrounded']
        for tr in transitions:
            metrics['transitions']+=1; bad=False
            starts=[e for e in events if e['event']=='foreground_started' and e['ts']<=tr['ts']]
            if not starts: violations.append({'command_id':cid,'type':'missing_foreground_start'}); bad=True
            acks=[e for e in events if e['event']=='background_ack' and e['ts']>=tr['ts']]
            if not acks: metrics['missing_ack']+=1; violations.append({'command_id':cid,'type':'missing_ack'}); bad=True
            else:
                lag=acks[0]['ts']-tr['ts']; ack_lags.append(lag)
                if lag>ack_deadline: metrics['late_ack']+=1; violations.append({'command_id':cid,'type':'late_ack','lag':lag}); bad=True
            terminals=[e for e in events if e['event'] in TERMINALS and e['ts']>=tr['ts']]
            if not terminals: metrics['missing_terminal']+=1; violations.append({'command_id':cid,'type':'missing_terminal'}); bad=True; terminal=None
            else:
                terminal=terminals[0]
                if len(terminals)>1: metrics['duplicate_terminal']+=1; violations.append({'command_id':cid,'type':'duplicate_terminal'}); bad=True
                notes=[e for e in events if e['event']=='notification' and e['ts']>=terminal['ts']]
                if not notes: metrics['missing_notification']+=1; violations.append({'command_id':cid,'type':'missing_notification'}); bad=True
                else:
                    lag=notes[0]['ts']-terminal['ts']; notification_lags.append(lag)
                    if lag>notify_deadline: metrics['late_notification']+=1; violations.append({'command_id':cid,'type':'late_notification','lag':lag}); bad=True
            for poll in [e for e in events if e['event']=='poll' and e['ts']>=tr['ts']]:
                if terminal is not None and poll['ts']>terminal['ts']: metrics['polls_after_terminal']+=1
                else: metrics['polls_while_running']+=1
            if not bad: metrics['healthy_transitions']+=1
    if metrics['transitions']==0: raise ValueError('trace contains no auto_backgrounded transition')
    metrics['ack_lag_p95']=p95(ack_lags); metrics['notification_lag_p95']=p95(notification_lags)
    return {'healthy':not violations,'metrics':metrics,'violations':violations}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('trace'); ap.add_argument('--ack-deadline',type=float,default=5.0); ap.add_argument('--notify-deadline',type=float,default=10.0); ap.add_argument('--json',action='store_true'); a=ap.parse_args()
    try:
        if a.ack_deadline<0 or a.notify_deadline<0: raise ValueError('deadlines must be non-negative')
        result=analyze(load(Path(a.trace)),a.ack_deadline,a.notify_deadline)
        print(json.dumps(result,sort_keys=True) if a.json else ('healthy' if result['healthy'] else f'unhealthy: {len(result["violations"])} violation(s)'))
        return 0 if result['healthy'] else 3
    except (OSError,ValueError,json.JSONDecodeError) as e:
        print(f'input-error: {e}',file=sys.stderr); return 2
if __name__=='__main__': raise SystemExit(main())
