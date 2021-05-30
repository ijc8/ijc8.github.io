---
layout: post
title: "Runnable Articles"
subtitle: "or, the kitchen sink in the browser"
date: 2021-5-21 22:00:00 -0400
---

```python
print("Hello, world!")
```
{: class="runnable"}

test

```python
import asyncio

print("Time to count!")
for i in range(10):
    await asyncio.sleep(0.5)
    print(i)
```
{: class="runnable"}

TODO: why aren't top-levels imports visible within functions?

```python
import matplotlib.pyplot as plt
print("Here's a sweet plot:")
plt.plot([1,2,3])
plt.tight_layout()
plt.show()
print("Yup, that sure was a plot.")
```
{: class="runnable"}

<img id="test-img" />

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.61.1/codemirror.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.61.1/codemirror.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.61.1/mode/python/python.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.61.1/addon/comment/comment.min.js"></script>

<style>
.CodeMirror {
    border: 1px solid #ddd;
    height: auto;
    font-size: 14px;
    /* font-family: 'Recursive', monospace; */
}

.runnable {
    border: 1px solid black;
    border-radius: 5px;
}

.runnable .run {
    background-color: green;
    color: white;
    border: none;
    border-radius: 5px;
    padding: .4em 1em .4em 1em;
    margin-top: 10px;
    margin-left: 30px;
    margin-bottom: 5px;
    height: 28px;
    line-height: 16px;
    vertical-align: middle;
}

.runnable .run::before {
    content: "▶\00a0\00a0";
    font-size: 10px;
    line-height: 16px;
    vertical-align: middle;
}

.runnable .run::after {
    content: "Run";
}

.runnable .run.loading {
    background-color: gray;
}

.runnable .run.loading::before {
    content: "";
}

.runnable .run.loading::after {
    content: "Loading...";
}

.runnable .run.running {
    background-color: gray;
}

.runnable .run.running::before {
    content: "";
}

.runnable .run.running::after {
    content: "Running...";
}

.runnable .run.error {
    background-color: #ba6565;
}
.runnable .run.error:after {
    content: "Load failed. Try closing and re-opening this tab; some browsers do not garbage collect on refresh.";
}

.runnable .output {
    margin-left: 30px;
    margin-right: 30px;
    margin-bottom: 5px;
    font-size: 12px;
    font-family: 'Recursive', monospace;
}

.runnable .output pre {
    margin: 0;
    padding: 0;
    display: inline;
}

.runnable .output img {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>

<script>
// Create Web Worker to run Python code in a separate thread.
const pyodideWorker = new Worker('{{site.base_url}}/static/webworker.js')

async function main() {
    try {
        await new Promise(resolve => pyodideWorker.onmessage = resolve)
    } catch (err) {
        for (const codebox of codeboxes) {
            codebox.button.classList.add("error")
        }
        return
    }
    for (const codebox of codeboxes) {
        codebox.button.classList.remove("loading")
        codebox.button.disabled = false
    }
}

function runScript(script, output) {
    return new Promise((resolve, reject) => {
        pyodideWorker.onerror = reject
        pyodideWorker.onmessage = (e) => {
            if (e.data.output) {
                const pre = document.createElement("pre")
                pre.textContent = e.data.output
                output.appendChild(pre)
            } else if (e.data.url) {
                const img = document.createElement("img")
                img.src = e.data.url
                output.appendChild(img)
            } else {
                resolve(e.data)
            }
        }
        pyodideWorker.postMessage(script)
    })
}

class CodeBox {
    constructor(container) {
        const source = container.textContent.trim()
        container.textContent = ""
        this.editor = CodeMirror(container, {
            value: source,
            mode: "python",
            indentUnit: 4,
            lineNumbers: true,
            viewportMargin: Infinity,
            extraKeys: {
                "Shift-Tab": "indentLess",
                "Tab": "indentMore",
                "Ctrl-/": "toggleComment",
                "Ctrl-Enter": () => this.run(),
            }
        })
        this.button = document.createElement("button")
        this.button.classList.add("run")
        this.button.classList.add("loading")
        this.button.disabled = true
        this.button.onclick = () => this.run()
        container.appendChild(this.button)

        this.output = document.createElement("div")
        this.output.classList.add("output")
        container.appendChild(this.output)
    }

    async run() {
        // Don't change the button state unless the computation takes at least 30ms.
        const timer = setTimeout(() => this.button.classList.add("running"), 30)
        this.button.disabled = true
        this.output.innerText = ""
        await runScript(this.editor.getDoc().getValue(), this.output)
        clearTimeout(timer)
        this.button.classList.remove("running")
        this.button.disabled = false
    }
}

const codeboxes = [...document.querySelectorAll(".runnable.language-python")].map(el => new CodeBox(el))

main();
</script>