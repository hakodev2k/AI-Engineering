#!/usr/bin/env python3
import argparse,json,os,sys,time
from pathlib import Path
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('output'); ap.add_argument('--seconds',type=float,default=15.0); ap.add_argument('--label',default='sample'); a=ap.parse_args()
 if os.name!='nt': print('error: requires Windows',file=sys.stderr); return 2
 if not 0<a.seconds<=300: print('error: --seconds must be >0 and <=300',file=sys.stderr); return 2
 import ctypes; from ctypes import wintypes
 pt=wintypes.POINT(); getpos=ctypes.windll.user32.GetCursorPos; start=time.perf_counter_ns(); end=start+int(a.seconds*1e9); last=None; last_ns=None; n=0
 try:
  with Path(a.output).open('w',encoding='utf-8') as f:
   while time.perf_counter_ns()<end:
    now=time.perf_counter_ns()
    if not getpos(ctypes.byref(pt)): return 3
    pos=(int(pt.x),int(pt.y))
    if pos!=last:
     gap=None if last_ns is None else (now-last_ns)/1e6; f.write(json.dumps({'t_ns':now-start,'x':pos[0],'y':pos[1],'gap_ms':gap,'label':a.label})+'\n'); last=pos; last_ns=now; n+=1
    time.sleep(0.0005)
 except OSError as e: print(f'error: {e}',file=sys.stderr); return 2
 print(json.dumps({'events':n,'output':a.output,'seconds':a.seconds,'label':a.label})); return 0 if n else 4
if __name__=='__main__': raise SystemExit(main())
