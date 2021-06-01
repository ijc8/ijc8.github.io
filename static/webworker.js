importScripts('https://cdn.jsdelivr.net/pyodide/v0.17.0/full/pyodide.js');

(async () => {
    await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.17.0/full/' })
    // NOTE: We intentionally avoid runPythonAsync here because we don't want this to pre-load extra modules like matplotlib.
    self.pyodide.runPython(setupCode)
    self.postMessage(true)  // Inform the main thread that we finished loading.
})()

function write(output) {
    self.postMessage({ output })
    return output.length
}

function show(type, url) {
    self.postMessage({ type, url })
}

// Stand-in for `time.sleep`, which does not actually sleep.
// To avoid a busy loop, instead import asyncio and await asyncio.sleep().
function spin(seconds) {
    const time = performance.now() + seconds * 1000
    while (performance.now() < time);
}

// NOTE: eval(compile(source, "<string>", "exec", ast.PyCF_ALLOW_TOP_LEVEL_AWAIT))
// returns a coroutine if `source` contains a top-level await, and None otherwise.

const setupCode = `
import array
import ast
import base64
import contextlib
import io
import js
import pyodide
import sys
import time
import traceback

# HACK: Prevent 'wave' import from failing because audioop is not included with pyodide.
import types
audioop = types.ModuleType('audioop')
sys.modules['audioop'] = audioop
audioop.byteswap = lambda data, width: data

import wave

time.sleep = js.spin

# For redirecting stdout and stderr later.
class JSWriter(io.TextIOBase):
    def write(self, s):
        return js.write(s)

def setup_matplotlib():
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt

    def show():
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        img = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode('utf-8')
        js.show("img", img)
        plt.clf()

    plt.show = show

def show_image(data):
    from PIL import Image
    buf = io.BytesIO()
    Image.fromarray(data).save(buf, format='png')
    img = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode('utf-8')
    js.show("img", img)

def show_animation(frames, duration=100, format="apng", loop=0):
    from PIL import Image
    buf = io.BytesIO()
    img, *imgs = [Image.fromarray(frame) for frame in frames]
    img.save(buf, format='png' if format == "apng" else format, save_all=True, append_images=imgs, duration=duration, loop=0)
    img = f'data:image/{format};base64,' + base64.b64encode(buf.getvalue()).decode('utf-8')
    js.show("img", img)

def convert_audio(data):
    try:
        import numpy as np
        is_numpy = isinstance(data, np.ndarray)
    except ImportError:
        is_numpy = False
    if is_numpy:
        if len(data.shape) == 1:
            channels = 1
        if len(data.shape) == 2:
            channels = data.shape[0]
            data = data.T.ravel()
        else:
            raise ValueError("Too many dimensions (expected 1 or 2).")
        return ((data * (2**15 - 1)).astype("<h").tobytes(), channels)
    else:
        data = array.array('h', (int(x * (2**15 - 1)) for x in data))
        if sys.byteorder == 'big':
            data.byteswap()
        return (data.tobytes(), 1)

def show_audio(samples, rate):
    bytes, channels = convert_audio(samples)
    buf = io.BytesIO()
    with wave.open(buf, mode='wb') as w:
        w.setnchannels(channels)
        w.setframerate(rate)
        w.setsampwidth(2)
        w.setcomptype('NONE', 'NONE')
        w.writeframes(bytes)
    audio = 'data:audio/wav;base64,' + base64.b64encode(buf.getvalue()).decode('utf-8')
    js.show("audio", audio)

async def run(source):
    out = JSWriter()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
        try:
            imports = pyodide.find_imports(source)
            await js.pyodide.loadPackagesFromImports(source)
            if "matplotlib" in imports:
                setup_matplotlib()
            code = compile(source, "<string>", "exec", ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
            result = eval(code, {"show_image": show_image, "show_animation": show_animation, "show_audio": show_audio})
            if result:
                await result
        except:
            traceback.print_exc()
`

self.onmessage = async (event) => {
    self.pyodide.globals.set("source", event.data)
    await self.pyodide.runPythonAsync("await run(source)")
    self.postMessage({ done: true })
}
