const num_outputs = 8

const OPS = [
    "zero",
    "and",
    "not_implies",
    "a",
    "not_implied_by",
    "b",
    "xor",
    "or",
    "not_or",
    "not_xor",
    "not_b",
    "implied_by",
    "not_a",
    "implies",
    "not_and",
    "one",
]

class CustomProcessor extends AudioWorkletProcessor {
    constructor() {
        super()
        this.playing = false
        this.pos = 0
        this.port.onmessage = async e => {
            if (e.data.cmd === "loadModule") {
                this.module = new WebAssembly.Module(e.data.binary)
                this.wasm = await WebAssembly.instantiate(this.module)
            } else if (e.data.cmd === "loadNetwork") {
                const view = new DataView(this.wasm.exports.memory.buffer)
                const network = this.wasm.exports.network.value
                const NETWORK = e.data.network
                this.num_inputs = Math.max(...NETWORK[0].map(n => [n[1], n[2]]).flat(1)) + 1
                this.num_gates = NETWORK.flat(1).length
                this.wasm.exports.setup(this.num_inputs, this.num_gates)
                let i = 0
                let offset = 0
                let lastLength = this.num_inputs
                // const flatNetwork = []
                for (const layer of NETWORK) {
                    for (const [op, a, b] of layer) {
                        view.setUint32(network + (i * 3) * 4, offset + a, true)
                        view.setUint32(network + (i * 3 + 1) * 4, offset + b, true)
                        view.setUint32(network + (i * 3 + 2) * 4, OPS.indexOf(op), true)
                        // flatNetwork.push([offset + a, offset + b, OPS.indexOf(op)])
                        i++
                    }
                    offset += lastLength
                    lastLength = layer.length
                }
                // console.log(flatNetwork)
                this.counts = new Uint8Array(this.num_inputs + this.num_gates)
            } else if (e.data.cmd === "play") {
                this.playing = true
            } else if (e.data.cmd === "pause") {
                this.playing = false
            } else if (e.data.cmd === "resetTime") {
                this.pos = 0
            }
        }
    }

    process(inputs, outputs, parameters) {
        if (this.wasm === undefined || !this.playing) return true

        const speakers = outputs[0]

        const memory = this.wasm.exports.memory
        const data = this.wasm.exports.data.value
        const logic_gate_net = this.wasm.exports.logic_gate_net
        const period = 1 << this.num_inputs
        const max_output = 2**num_outputs - 1
        const counts = this.counts
        // console.log(this.num_inputs, this.period)

        counts.fill(0)

        // TODO: take advantage of batching (128 / 32 = just 4 calls to logic_gate_net rather than 128)
        const process = (t) => {
            // TODO: probably quicker to use Uint32Array rather than DataView
            const view = new DataView(memory.buffer)
            for (let i = 0; i < this.num_inputs; i++) {
                view.setUint32(data + i * 4, (t >> i) & 1, true)
            }
            logic_gate_net()
            let sample = 0

            for (let i = 0; i < num_outputs; i++) {
                sample |= (view.getUint32(data + (this.num_inputs + this.num_gates - num_outputs + i) * 4, true) & 1) << i
            }
            for (let i = 0; i < this.num_inputs + this.num_gates; i++) {
                counts[i] += view.getUint32(data + i * 4, true) & 1
            }
            return sample / max_output * 2 - 1
        }

        let t = this.pos
        for (let i = 0; i < speakers[0].length; i++) {
            const x = process(t)
            t = (t + 1) % period
            for (const channel of speakers) {
                channel[i] = x
            }
        }

        this.pos = t
        // if (this.pos % 1024 === 0) {
        //     this.port.postMessage(this.pos)
        // }

        this.port.postMessage(counts)

        return true
    }
}

registerProcessor("custom-processor", CustomProcessor)
