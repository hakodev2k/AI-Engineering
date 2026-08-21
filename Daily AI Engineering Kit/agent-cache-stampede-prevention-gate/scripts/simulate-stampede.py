#!/usr/bin/env python3
import argparse, concurrent.futures, json, random, threading, time

class Cache:
    def __init__(self, singleflight=False):
        self.value = None
        self.expires = 0.0
        self.lock = threading.Lock()
        self.singleflight = singleflight
        self.backend_calls = 0
    def get(self, latency_ms, ttl_ms):
        now = time.monotonic()
        if self.value is not None and now < self.expires:
            return self.value
        if self.singleflight:
            with self.lock:
                now = time.monotonic()
                if self.value is not None and now < self.expires:
                    return self.value
                return self._load(latency_ms, ttl_ms)
        return self._load(latency_ms, ttl_ms)
    def _load(self, latency_ms, ttl_ms):
        self.backend_calls += 1
        time.sleep(latency_ms / 1000.0)
        self.value = 'value'
        self.expires = time.monotonic() + ttl_ms / 1000.0
        return self.value

def run(clients, latency_ms, ttl_ms, singleflight):
    cache = Cache(singleflight=singleflight)
    barrier = threading.Barrier(clients)
    def worker(_):
        barrier.wait()
        return cache.get(latency_ms, ttl_ms)
    start = time.monotonic()
    with concurrent.futures.ThreadPoolExecutor(max_workers=clients) as ex:
        list(ex.map(worker, range(clients)))
    elapsed_ms = round((time.monotonic() - start) * 1000, 2)
    return {'clients': clients, 'backend_calls': cache.backend_calls, 'elapsed_ms': elapsed_ms, 'singleflight': singleflight}

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--clients', type=int, default=32)
    p.add_argument('--latency-ms', type=int, default=100)
    p.add_argument('--ttl-ms', type=int, default=1000)
    p.add_argument('--output')
    a = p.parse_args()
    if a.clients < 2 or a.latency_ms < 0 or a.ttl_ms <= 0:
        raise SystemExit('invalid arguments')
    report = {'without_singleflight': run(a.clients, a.latency_ms, a.ttl_ms, False), 'with_singleflight': run(a.clients, a.latency_ms, a.ttl_ms, True)}
    text = json.dumps(report, indent=2)
    if a.output:
        open(a.output, 'w', encoding='utf-8').write(text + '\n')
    else:
        print(text)
    return 0 if report['with_singleflight']['backend_calls'] == 1 else 1
if __name__ == '__main__':
    raise SystemExit(main())
