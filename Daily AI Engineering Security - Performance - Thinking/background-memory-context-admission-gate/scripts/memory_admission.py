#!/usr/bin/env python3
import argparse,json,math,sys
from pathlib import Path

def fail(msg):
    print(json.dumps({"status":"error","error":msg})); return 3

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--input',required=True); ap.add_argument('--policy',required=True); args=ap.parse_args()
    try:
        data=Path(args.input).read_bytes(); p=json.loads(Path(args.policy).read_text())
        window=int(p['context_window_tokens']); sysr=int(p.get('reserve_system_tokens',0)); outr=int(p.get('reserve_output_tokens',0)); frac=float(p.get('safety_fraction',0.9)); bpt=float(p.get('bytes_per_token_estimate',3.0)); overlap=int(p.get('chunk_overlap_tokens',0))
        if window<=0 or sysr<0 or outr<0 or not (0<frac<=1) or bpt<=0 or overlap<0: raise ValueError('invalid policy values')
    except Exception as e: return fail(str(e))
    capacity=max(0,math.floor(window*frac)-sysr-outr)
    if capacity<=overlap: return fail('effective capacity must exceed overlap')
    est=math.ceil(len(data)/bpt)
    out={'status':'ok','source_bytes':len(data),'estimated_input_tokens':est,'effective_input_capacity_tokens':capacity,'estimate_bytes_per_token':bpt}
    if est<=capacity:
        out.update({'decision':'admit','chunks':[{'start_byte':0,'end_byte':len(data)}]}); print(json.dumps(out,indent=2)); return 0
    chunk_tokens=capacity-overlap; chunk_bytes=max(1,math.floor(chunk_tokens*bpt)); overlap_bytes=math.floor(overlap*bpt); chunks=[]; start=0
    while start<len(data):
        end=min(len(data),start+chunk_bytes); chunks.append({'start_byte':start,'end_byte':end});
        if end==len(data): break
        start=max(start+1,end-overlap_bytes)
    out.update({'decision':'rechunk','reason':'estimated_input_exceeds_effective_capacity','chunks':chunks}); print(json.dumps(out,indent=2)); return 2
if __name__=='__main__': sys.exit(main())
