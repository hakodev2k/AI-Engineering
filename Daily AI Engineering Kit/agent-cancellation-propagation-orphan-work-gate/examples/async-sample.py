import asyncio

async def cancellable_worker(stop: asyncio.Event, events: list[str]):
    try:
        while not stop.is_set():
            await asyncio.sleep(0.01)
            events.append("tick")
    except asyncio.CancelledError:
        events.append("cancelled")
        raise

async def run_parent():
    stop=asyncio.Event(); events=[]
    task=asyncio.create_task(cancellable_worker(stop,events))  # intentionally flagged for review by the gate
    await asyncio.sleep(0.03)
    stop.set(); task.cancel()
    try: await task
    except asyncio.CancelledError: pass
    return events

if __name__=="__main__": print(asyncio.run(run_parent()))
