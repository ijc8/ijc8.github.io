// Create Web Worker to run Python code in a separate thread.
const pyodideWorker = new Worker(window.location.origin + '/runnable/worker.js')

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
                const el = document.createElement(e.data.type)
                el.src = e.data.url
                if (e.data.type === "audio") {
                    el.controls = true
                }
                for (const [attr, value] of e.data.attrs ?? []) {
                    el[attr] = value
                }
                output.appendChild(el)
            } else {
                resolve(e.data)
            }
        }
        pyodideWorker.postMessage(script)
    })
}

class CodeBox {
    constructor(container) {
        const editorContainer = document.createElement("div")
        editorContainer.textContent = container.textContent.trim()
        container.textContent = ""
        container.appendChild(editorContainer)
        this.editor = ace.edit(editorContainer, {
            maxLines: 30,
        });
        this.editor.setTheme("ace/theme/chrome");
        this.editor.session.setMode("ace/mode/python");

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
        for (const button of document.querySelectorAll(".runnable .run")) {
            button.disabled = true
        }
        const timer = setTimeout(() => this.button.classList.add("running"), 30)
        this.output.innerText = ""
        await runScript(this.editor.getValue(), this.output)
        clearTimeout(timer)
        this.button.classList.remove("running")
        for (const button of document.querySelectorAll(".runnable .run")) {
            button.disabled = false
        }
    }
}

const codeboxes = [...document.querySelectorAll(".runnable.language-python")].map(el => new CodeBox(el))

main()