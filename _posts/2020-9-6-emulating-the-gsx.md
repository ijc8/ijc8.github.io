---
layout: post
title: "Adventures in Synthesis: Emulating the GSX"
#subtitle: ""
date: 2020-9-6 18:42:00 -0400
---

After a lengthy hiatus, I return to you with a little weekend project: a (simplified) emulator of Barry Truax's GSX system for real-time granular synthesis. And the best part is, you don't have to go anywhere to try it out---it's embedded in this very post!

## Background

In 1986, [Barry Truax](https://en.wikipedia.org/wiki/Barry_Truax) built the first system that could perform [granular synthesis](https://en.wikipedia.org/wiki/Granular_synthesis) in real-time, allowing the composer to modify the synthesis parameters while listening to the result. Pretty neat, right? In one of my classes, Music Technology History and Repertoire, we recently listened to Truax's piece _Riverrun_, and I was impressed with the variety of effects he obtained by transforming simple source material (pure sine tones).

![Screenshot of the real deal]({{ site.baseurl }}/images/gsx.png "The real deal. The part of the interface I'm emulating is at the bottom of the screen.")

I saw that the [TaCEM team](https://research.hud.ac.uk/institutes-centres/tacem/) built an emulation[^emulation] of Truax's system in Max, and I decided to take a stab at it myself with WebAudio. You can see the result below.

[^emulation]: To clarify, neither TaCEM's emulation nor mine actually run Truax's code on emulated hardware (a PDP-11 with DMX-100 signal processing computer); rather, they emulate the GSX by reimplementing its functionality (in Max/MSP and WebAudio, respectively).

## Notes

This demo is intended to approximate the experience of using the additive synthesis mode of GSX, as used in _Riverrun_; I have omitted many important features of the original system (support for FM & samples-based synthesis, custom waveforms, tendency masks, presets...), and I have taken liberties with the interface because I didn't care to faithfully emulate the original PDP-11 interface here in the browser. However, you can make the experience slightly more authentic by discarding your mouse and relying on the tab and arrow keys.

Note that each parameter (aside from INC) has two input fields: one which is the current value, and another optional field to the right, which is the step value. Every RAMP milliseconds, all of the values are incremented by their step (if it is set) times INC.

Frequencies are in hertz, and times (duration, delay, ramp) are in milliseconds. For best results, try this in Chrome. (It works in Firefox, but there's a lot of extraneous popping.)

## Demo

<link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">

<script type="text/javascript">
let audioContext;
const NUM_VOICES = 20;
let voices = [];
let scheduleLoopTimeout;
let rampTimeout;

function start() {
    let time = audioContext.currentTime + 0.01;
    for (let i = 0; i < NUM_VOICES; i++) {
        const oscillator = audioContext.createOscillator()
        const gain = audioContext.createGain();
        voices.push({ oscillator, gain, endTime: time });
        oscillator.frequency.value = 0;
        gain.gain.value = 0;
        oscillator.connect(gain);
        gain.connect(audioContext.destination)
        oscillator.start(time);
    }

    scheduleLoop();
    ramp();
}

const SCHEDULE_AHEAD = 150;
const SCHEDULE_PERIOD = 100;

const RAMPABLE_PARAMS = ["freq", "freq-range", "dur", "dur-range", "delay", "ramp", "num-waveform2", "num-waveform3", "num-voices"];

function ramp() {
    const inc = parseFloat(document.getElementById("inc").value) || 0;
    if (inc) {
        for (let param of RAMPABLE_PARAMS) {
            // console.log(param);
            const step = parseFloat(document.getElementById(`${param}-step`).value) || 0;
            if (step) {
                const elem = document.getElementById(param);
                const value = parseFloat(elem.value) || 0;
                elem.value = value + step * inc;
            }
        }
    }
    const rampDelay = Math.max(1, parseFloat(document.getElementById("ramp").value) || 0);
    rampTimeout = setTimeout(ramp, rampDelay);
}

function scheduleLoop() {
    const frequencyCenter = parseFloat(document.getElementById("freq").value) || 0;
    const frequencyRange = parseFloat(document.getElementById("freq-range").value) || 0;
    const durationCenter = Math.max(1, parseFloat(document.getElementById("dur").value) || 0) / 1000;
    const durationRange = (parseFloat(document.getElementById("dur-range").value) || 0) / 1000;;
    const delay = (parseFloat(document.getElementById("delay").value) || 0) / 1000;
    const numVoices = Math.min(parseInt(document.getElementById("num-voices").value) || 0, 19);
    const envFrac = 4;

    // Unlike the other parameters, these are "instant"; they cannot be scheduled in advance.
    const numWaveform2 = parseInt(document.getElementById("num-waveform2").value) || 0;
    const numWaveform3 = parseInt(document.getElementById("num-waveform3").value) || 0;

    const time = audioContext.currentTime;
    console.log("numVoices", numVoices);
    for (let i = 0; i < numVoices; i++) {
        const voice = voices[i];

        if (i < numWaveform2)
            voice.oscillator.type = "square";
        else if (i < numWaveform2 + numWaveform3)
            voice.oscillator.type = "sawtooth";
        else
            voice.oscillator.type = "sine";

        while (voice.endTime < time + SCHEDULE_AHEAD / 1000) {
            startTime = voice.endTime + delay;

            const freq = frequencyCenter + (Math.random() - 0.5) * frequencyRange;
            voice.oscillator.frequency.setValueAtTime(freq, startTime);

            const duration = durationCenter + (Math.random() - 0.5) * durationRange;
            voice.gain.gain.setValueAtTime(0, startTime);
            voice.gain.gain.linearRampToValueAtTime(1/numVoices, startTime + duration / envFrac);
            voice.gain.gain.setValueAtTime(1/numVoices, startTime + duration * (1 - 1 / envFrac));
            voice.gain.gain.linearRampToValueAtTime(0, startTime + duration);
            voice.endTime = startTime + duration;
        }
    }
    scheduleLoopTimeout = setTimeout(scheduleLoop, SCHEDULE_PERIOD);
}

function main() {
    if (window.AudioContext === undefined) {
        console.log("unsupported");
        return;
    }

    audioContext = new AudioContext();
    const button = document.getElementById("start-stop");
    let toggle = async () => {
        if (button.innerText === "Start") {
            await audioContext.resume();
            button.innerText = "Stop";
            start();
        } else {
            await audioContext.suspend();
            clearTimeout(scheduleLoopTimeout);
            clearTimeout(rampTimeout);
            for (let voice of voices) {
                voice.oscillator.stop();
                voice.oscillator.disconnect();
                voice.gain.gain.cancelScheduledValues(0);
                voice.gain.disconnect();
            }
            voices = [];
            button.innerText = "Start";
        }
    };

    for (let param of RAMPABLE_PARAMS) {
        const el = document.getElementById(`${param}-step`);
        el.addEventListener("change", () => {
            const value = parseFloat(el.value);
            if (value > 0) {
                document.getElementById(`${param}-sign`).innerText = "+";
            } else {
                document.getElementById(`${param}-sign`).innerText = "";
                if (value == 0)
                    el.value = "";
            }
        });
    }

    button.addEventListener("click", toggle);
}

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(main);
</script>

<style>
.param-box {
    line-height: 1;
    display: flex;
    flex-wrap: wrap;
    font-family: "VT323", monospace;
    font-size: 25px;
    color: #e8ae26;
    background-color: #282018;
    padding: 20px 0 40px 20px;
}

input {
    width: 2.5em;
    height: 100%;
    /* border: 1px dashed gray; */
    border: none;
    font-family: "VT323", monospace;
    color: #e8ae26;
    font-size: 25px;
    background-color: #282018;
    margin: 0;
}

label {
    height: 50%;
}

.step-container {
    display: flex;
    height: 50%;
    width: 115px;
}

.step {
    width: 0;
    flex-grow: 1;
}

.param {
    height: 100%;
    margin-right: 5px;
    margin-bottom: 20px;
}

#start-stop {
    width: 100%;
    height: 2em;
    font-size: larger;
}

.demo-container {
    width: 90%;
    margin: 30px auto 30px auto;
}
</style>

<div class="demo-container">
    <div class="param-box">
        <div class="param">
            <label for="inc"><br>INC</label>
            <div class="step-container"><input id="inc" type="number" value="1"></div>
        </div>

        <div class="param">
            <label for="freq"><br>FREQ</label>
            <div class="step-container">
                <input id="freq" type="number" value="200"><span id="freq-sign"></span><input id="freq-step" class="step" type="number" value="">
            </div>
        </div>

        <div class="param">
            <label for="freq-range"><br>FRQ.RNG</label>
            <div class="step-container">
                <input id="freq-range" type="number" value="0"><span id="freq-range-sign"></span><input id="freq-range-step" class="step" type="number" value="">
            </div>
        </div>

        <div class="param">
            <label for="dur"><br>DUR'N</label>
            <div class="step-container">
                <input id="dur" type="number" value="100" min="1"><span id="dur-sign"></span><input id="dur-step" class="step" type="number" value="">
            </div>
        </div>

        <div class="param">
            <label for="dur-range"><br>DUR.RNG</label>
            <div class="step-container">
                <input id="dur-range" type="number" value="0"><span id="dur-range-sign"></span><input id="dur-range-step" class="step" type="number" value="">
            </div>
        </div>

        <div class="param">
            <label for="delay"><br>DELAY</label>
            <div class="step-container">
                <input id="delay" type="number" value="200"><span id="delay-sign"></span><input id="delay-step" class="step" type="number" value="">
            </div>
        </div>

        <div class="param">
            <label for="ramp"><br>RAMP</label>
            <div class="step-container">
                <input id="ramp" type="number" value="250" min="1"><span id="ramp-sign"></span><input id="ramp-step" class="step" type="number" value="">
            </div>
        </div>

        <div class="param">
            <label for="num-waveform2">NO.VOI.<br>W.F.#2</label>
            <div class="step-container">
                <input id="num-waveform2" type="number" value="0" min="0" max="20"><span id="num-waveform2-sign"></span><input id="num-waveform2-step" class="step" type="number" value="">
            </div>
        </div>

        <div class="param">
            <label for="num-waveform3">NO.VOI.<br>W.F.#3</label>
            <div class="step-container">
                <input id="num-waveform3" type="number" value="0" min="0" max="20"><span id="num-waveform3-sign"></span><input id="num-waveform3-step" class="step" type="number" value="">
            </div>
        </div>

        <div class="param">
            <label for="num-voices">TOTAL<br>NO.VOI.</label>
            <div class="step-container">
                <input id="num-voices" type="number" value="1" min="0" max="20"><span id="num-voices-sign"></span><input id="num-voices-step" class="step" type="number" value="">
            </div>
        </div>
    </div>
    <button id="start-stop">Start</button>
</div>

## Further reading

[Barry Truax's paper on real-time granular synthesis](https://www.jstor.org/stable/3679938)

[TaCEM paper on _Riverrun_ and emulating the GSX](http://smc.afim-asso.org/smc-icmc-2014/papers/images/VOL_1/0201.pdf)

[More about _Riverrun_ on Truax's website](https://www.sfu.ca/~truax/river.html)

The font used in this demo is Peter Hull's [VT323](https://fonts.google.com/specimen/VT323).