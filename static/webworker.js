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

function show(url) {
    self.postMessage({ url })
}

// Stand-in for `time.sleep`, which does not work.
// To avoid a busy loop, instead import asyncio and await asyncio.sleep().
function spin(seconds) {
    const time = performance.now() + seconds * 1000
    while (performance.now() < time);
}

// NOTE: eval(compile(source, "<string>", "exec", ast.PyCF_ALLOW_TOP_LEVEL_AWAIT))
// returns a coroutine if `source` contains a top-level await, and None otherwise.

const setupCode = `
import ast
import contextlib
import io
import js
import time
import traceback

time.sleep = js.spin

class JSWriter(io.TextIOBase):
    def write(self, s):
        return js.write(s)

import pyodide

def setup_matplotlib():
    import base64
    from io import BytesIO
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt

    def show():
        buf = BytesIO()
        plt.savefig(buf, format='png')
        img = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode('utf-8')
        js.show(img)
        plt.clf()

    plt.show = show

async def run(source):
    out = JSWriter()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
        try:
            imports = pyodide.find_imports(source)
            await js.pyodide.loadPackagesFromImports(source)
            if "matplotlib" in imports:
                setup_matplotlib()
            code = compile(source, "<string>", "exec", ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
            result = eval(code, {})
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
