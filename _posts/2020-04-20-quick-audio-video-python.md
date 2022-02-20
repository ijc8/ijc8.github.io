---
layout: post
title: "Quick & Simple: Audio and Video in Python"
subtitle: "samples in & samples out, asap"
date: 2020-4-20 17:00:00 -0400
---

{:style="text-align:center"}
![Generated GIF]({{ site.baseurl }}/images/glowscan.gif "is it a banner or a teaser? you decide!"){: width="100%" height="50px"}

Tools for working with audio and video abound. I often find that these do not perfectly serve my purposes: I know what I want, but existing tools might not support it well or at all. It's nice, and sometimes essential, to have the flexibility of a general programming language, which enables you to express what you want precisely using the abstractions of your choosing.

To that end: here are the quickest ways I know to get audio and video into or out of Python. Python, while not perfect, is pretty reasonable among dynamic languages, exceedingly convenient, and finally past the era of 2-vs-3. Some might not think of it as a language for [DSP](https://en.wikipedia.org/wiki/Digital_signal_processing), but its excellent ecosystem (including [the SciPy squad](https://www.scipy.org/)) and expressiveness make it a very useful tool.

Future posts may discuss some of the many interesting things to do with audio and video. This post is more preliminary: all about getting audio and video samples into Python (say, from files or hardware) and/or out of it and into the world. So, here are some brief examples, comprising the possibilities {audio, video} x {files, hardware} x {input, output}.

# Audio

## Audio from Python in 77 bytes

In the spirit of code golf, here is the shortest way I know to generate and play audio from Python.
```bash
python3 -c 'import numpy as n,sys;sys.stdout.buffer.write(n.sin(n.pi*n.arange(8e3)*0.11))'|sox -tf64 - -d
```
(Okay, fine, it's 103 bytes if you count the stuff that isn't Python.)

This example generates one second of a 440 Hz sine tone as 8 kHz, 16-bit signed audio, and plays it. It requires numpy and sox.
The relevant bit is `n.sin(n.pi*n.arange(8e3)*0.11)`; the other 73 bytes are boilerplate.
It turns out that with just this much, you can already produce plenty of interesting sounds.

Turn down your volume and check out this example:

<audio
    controls
    src="/static/expr.wav">
        Your browser does not support the
        <code>audio</code> element.
</audio>

I generated it with:[^1]
```bash
python3 -c 'import numpy as n,sys;t=n.arange(64e3);sys.stdout.buffer.write(n.sin(t/8+10*n.sin(t/64+10*n.sin(t/1024)))/2+(((t**2.15/4e3+1)%2)-1)/2)'|sox -tf64 - -b16 expr.wav
```
For more examples of making a lot of noise with a little code, check out [bytebeat](http://canonical.org/~kragen/bytebeat/).

## Audio to/from a file

Here's a more reasonable (and readable) way to generate audio and get it into a file.

```python
import numpy as np
import wave

sample_rate = 44100

# Generate a sine tone at 440 Hz for 5 seconds - replace this!
audio = np.sin(2*np.pi * np.arange(sample_rate * 5)/sample_rate * 440)

# Open and configure a new wave file.
with wave.open('out.wav', 'wb') as wav:
    wav.setnchannels(1)
    wav.setsampwidth(2)
    wav.setframerate(sample_rate)
    wav.writeframes((audio * np.iinfo(np.int16).max).astype(np.int16))
```

This example saves the generated audio as a wave file, using the built-in [`wave`](https://docs.python.org/3/library/wave.html) module. The parameters to tweak are number of channels, sample size (e.g. 16-bit vs. 24-bit), and sample rate (e.g. 44.1kHz vs. 48kHz). If you're content with 16-bit mono, great! Otherwise, consult the [Appendix](#appendix).

It's equally straightforward to go the other way and get audio from a file. The following example performs a simple effect on an audio file and saves the result in a new file.

```python
import numpy as np
import wave

with wave.open('in.wav', 'rb') as wav:
    # NOTE: Depending on your file, you may wish to avoid reading
    #       the entire thing into memory at once.
    audio = wav.readframes(wav.getnframes())
    channels = wav.getnchannels()
# Assume 16-bit audio. See Appendix for others.
audio = np.frombuffer(audio, dtype=np.int16).reshape(-1, channels)
audio = audio.astype(np.float) / np.iinfo(np.int16).max
sample_rate = wav.getframerate()
# Perform amplitude modulation with an LFO:
audio *= np.sin(2*np.pi * np.arange(len(audio))/sample_rate * 4)[:, None]
# Save the result.
with wave.open('out.wav', 'wb') as wav:
    wav.setnchannels(channels)
    wav.setsampwidth(2)
    wav.setframerate(sample_rate)
    wav.writeframes((audio * np.iinfo(np.int16).max).astype(np.int16))
```

## Audio to/from hardware

In my brief example above, I relied on an external utility, `sox`, to get my samples to a speaker. This is rarely acceptable, and you can use PyAudio to get those samples out directly from Python. PyAudio is a set of bindings for PortAudio, which is cross-platform and supports every audio backend I know of (including ALSA, Jack, and PulseAudio on Linux).

Using PyAudio's callback mode, you can register a function to generate new samples as needed:
```python
import pyaudio
import numpy as np
import time

sample_rate = 44100
buffer_size = 1024

# Keep track of position to avoid discontinuity between chunks.
t = 0
def callback(in_data, frame_count, time_info, status):
    global t
    audio = np.sin(2*np.pi * (t + np.arange(frame_count))/sample_rate * 440)
    t += frame_count
    return (audio.astype(np.float32), pyaudio.paContinue)

p = pyaudio.PyAudio()
stream = p.open(format=pyaudio.paFloat32,
                channels=1,
                frames_per_buffer=buffer_size,
                rate=sample_rate,
                output=True,
                stream_callback=callback)
stream.start_stream()

try:
    # Do whatever you want here.
    while stream.is_active():
        print("Still going!")
        time.sleep(0.1)
except KeyboardInterrupt:
    pass

stream.stop_stream()
stream.close()
p.terminate()
```

This example generates a sine tone which will continue until you stop it (Ctrl+C).

PyAudio also has a [blocking mode](https://people.csail.mit.edu/hubert/pyaudio/docs/#example-blocking-mode-audio-i-o), in which the application submits samples on its own time (at the risk of underflow), but I find that this is rarely what I want.

To get audio input, tweak the example: add `input=True` when opening the stream, and do something interesting with `in_data` in the callback. This simple example plays what it records (use headphones when you try this or risk feedback).
```python
import pyaudio
import time

def callback(in_data, frame_count, time_info, status):
    return (in_data, pyaudio.paContinue)

p = pyaudio.PyAudio()
stream = p.open(format=pyaudio.paFloat32,
                channels=1,
                rate=44100,
                input=True,
                output=True,
                stream_callback=callback)

stream.start_stream()

try:
    while stream.is_active():
        time.sleep(0.1)
except KeyboardInterrupt:
    pass

stream.stop_stream()
stream.close()
p.terminate()
```

## Video

Video is another beast, and I was surprised to find that there wasn't one obvious way to do it, as with audio. Ultimately, I settled on piping raw video frames from numpy into `ffmpeg`, which can take care of encoding (among many other processing tasks). I use the delightful [`ffmpeg-python`](https://github.com/kkroening/ffmpeg-python) to wrap the invocation, but this isn't strictly necessary.

Here's an example that generates ten seconds of colorful 720p static:

```python
import numpy as np
import ffmpeg

fps = 30
width, height = 1280, 720
frames = fps * 10
process = (
    ffmpeg
        .input('pipe:', format='rawvideo', pix_fmt='rgb24', s='{}x{}'.format(width, height), framerate=fps)
        .output('out.mp4', pix_fmt='yuv420p', vcodec='libx264', r=fps)
        .overwrite_output()
        .run_async(pipe_stdin=True)
)

for i in range(frames):
    print(f'{i / frames * 100}%')
    frame = np.random.random((width, height, 3))
    process.stdin.write((frame * 255).astype(np.uint8))

process.stdin.close()
process.wait()
```

This works pretty well. Unsurprisingly, runtime is `O(width * height * frames)`. In a future post, I might talk about some strategies for speeding this up (or making it more manageable) when dealing with lengthy videos and high resolutions.

Here's an example that plays back a color-inverted webcam feed, demonstrating how to get input from a webcam and play output in real-time:
```python
import numpy as np
import ffmpeg
import subprocess

device = '/dev/video0'
info = ffmpeg.probe(device)['streams'][0]
width, height = info['width'], info['height']

# Get webcam video via ffmpeg.
in_process = (
    ffmpeg
    .input('/dev/video0', format='v4l2')
    .output('pipe:', format='rawvideo', pix_fmt='rgb24')
    .run_async(pipe_stdout=True, pipe_stderr=True)
)

# Play video in real-time via ffplay.
play_process = subprocess.Popen(
    [
        'ffplay',
        '-f', 'rawvideo',
        '-pix_fmt', 'rgb24',
        '-s', '{}x{}'.format(width, height),
        '-i', 'pipe:',
    ],
    stdin=subprocess.PIPE,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)

try:
    while True:
        in_bytes = in_process.stdout.read(width * height * 3)
        in_frame = np.frombuffer(in_bytes, np.uint8).reshape([height, width, 3])
        out_frame = 255 - in_frame  # Invert colors.
        play_process.stdin.write(out_frame.astype(np.uint8))
except (KeyboardInterrupt, BrokenPipeError):
    pass

in_process.terminate()
in_process.wait()
play_process.wait()
```

This example runs on Linux, using v4l2. For Windows and MacOS, the ffmpeg command will look a little different, as you'll need to use dshow or avfoundation instead of v4l2 ([more info here](https://trac.ffmpeg.org/wiki/Capture/Webcam)).

### Application: Generating GIFs

Among many other formats, ffmpeg suports animated GIFs. Here's a cute little Python tool for making them:

```python
# gif.py: generate animated gifs from expressions
import numpy as np
import ffmpeg
import sys

fps = 16
width, height = 256, 256
process = (
    ffmpeg
        .input('pipe:', format='rawvideo', pix_fmt='gray', s='{}x{}'.format(width, height), framerate=fps)
        .output('out.gif', r=fps)
        .overwrite_output()
        .run_async(pipe_stdin=True, pipe_stderr=True)
)

# Interestingly, this hack runs much faster than using compile + eval.
exp_as_func = eval('lambda: ' + sys.argv[1])
# Put some convenient things in the namespace:
pi, sin, cos, r = np.pi, np.sin, np.cos, 0

frames = 32
for i in range(frames):
    frame = np.zeros((width, height))
    for row in range(width):
        for col in range(height):
            r = np.random.random()
            x, y, t = col / width, row / height, i / frames
            frame[row, col] = exp_as_func()
    process.stdin.write((frame * 255).astype(np.uint8))

process.stdin.close()
process.wait()
```

In the spirit of bytebeat, this wraps up the boilerplate so that you can generate two-second grayscale gifs with a single expression, which is evaluated at every point to create each frame. The expression has access to the variables `x`, `y`, `t`, and `r`, which are all on the range [0, 1). The expression can also use `pi`, `sin`, `cos`, and Python operators.[^2]

For example, saving this script as `gif.py` and running `python3 gif.py x+y+t` will generate the following:

{:style="text-align:center"}
![Generated GIF]({{ site.baseurl }}/images/simple.gif "x+y+t")

Here are some other neato examples. Hover over each one to see the expression that generated it.

{:style="text-align:center"}
![Generated GIF]({{ site.baseurl }}/images/w.gif "int(abs(y-0.2-0.5*sin(2*pi*(x * (t-.5)**2*4))**2)<(1.1-(t-.5)**2*4)/5)")
![Generated GIF]({{ site.baseurl }}/images/z.gif "1-abs(x-.2-.5*sin(2*pi*(y*(t-.5)**2*4))**2)**(1/2)")
![Generated GIF]({{ site.baseurl }}/images/circles.gif "128*(2*(t-.5))**3*((x-.5)**2+(y-.5)**2)")
![Generated GIF]({{ site.baseurl }}/images/glowscan.gif "(1-(abs((x-t+.5)%1-.5))**(1/4))/2+(y-(t-.5)**2)**2/2")
![Generated GIF]({{ site.baseurl }}/images/woah.gif "2**8*((x-.5)/(y-.501))*t**3")
![Generated GIF]({{ site.baseurl }}/images/fabric.gif "int(abs(x-(sin(2*pi*(t+r/4))*sin(2*pi*(y+r/2))+1)/2)<.05)*r")

# Conclusion

Python is a nice language, it's pretty convenient manipulating audio and video (among other kinds of signals), and it's fantastic for prototyping and creative coding. It can be tricky to get started, though. In this post, I hope to help by demonstrating how to get your hands dirty with data ASAP.

Watch this space for dumb ways to goof around with Zoom, and ways to capture video from drawing libraries you may already know and love (Processing, Pyglet, Kivy).

Happy hacking!

# Appendix
## Multi-channel audio

If there are multiple channels, `wave` and `PyAudio` expects the audio data to be interleaved. That is, first there's a sample from the first channel, the one from the second channel, and so on, until you start the next round with the next sample from the first channel. Each of these rounds is called a _frame_. If you have generated the audio for each channel in separate arrays, you can combine them like so:[^3]
```python
interleaved = np.empty((left.size + right.size,), dtype=left.dtype)
interleaved[::2] = left  # even-indexed samples come from the left channel
interleaved[1::2] = right  # odd-indexed samples come from the right channel
```
You can then pass `interleaved` to `writeframes()`.

Alternatively, you could combine channels into an array of shape `(num_frames, num_channels)` and let the default order of [`tobytes()`](https://numpy.org/doc/stable/reference/generated/numpy.reshape.html#numpy.reshape) handle the rest:
```python
stereo = np.vstack((left, right)).T
```

Correspondingly, to deinterleave data into separate channels:
```python
left, right = interleaved[::2], interleaved[1::2]
```
or just
```python
left, right = interleaved.reshape(-1, 2).T
```

## Odd-width audio

If the sample size doesn't correspond to a built-in numpy type, the conversion requires a little more work. For example, this handles the output in the 24-bit case, which is by far the most common (and [only?](https://en.wikipedia.org/wiki/Audio_bit_depth#Applications)) non-power-of-2 width in audio:
```python
scaled = (audio * (2**23 - 1)).astype(np.int32)
out = (scaled[:, None] >> np.array([0, 8, 16]) & 0xff).astype(np.uint8)
```
This snippet scales floating point audio to the signed 24-bit range, stores it as a 32-bit array, and extracts the first (least-significant) three bytes of each 32-bit sample.

To take in 24-bit input, storing it in a 32-bit array:
```python
audio = np.frombuffer(raw_24bit_audio, dtype=np.uint8).reshape(-1, 3)
converted = np.empty((audio.shape[0], 4), dtype=np.uint8)
converted[:, :3] = audio
converted[:, 3] = (audio[:, 2] >> 7) * 0xff  # sign extension
converted = converted.view('<i4')
```
This snippet preserves the literal value of each sample, but since the range is 2<sup>8</sup> times larger for 32-bit samples, the audio will seem much quieter unless you scale it appropriately. If you'd rather preserve the relative value of each sample, you can do:
```python
audio = np.frombuffer(raw_24bit_audio, dtype=np.uint8).reshape(-1, 3)
converted = np.zeros((audio.shape[0], 4), dtype=np.uint8)
converted[:, 1:] = audio
converted = converted.view('<i4')
```
or more concisely
```
audio = np.frombuffer(raw_24bit_audio, dtype=np.uint8).reshape(-1, 3)
converted = np.bitwise_or.reduce(audio << np.array([8, 16, 24]), dtype=np.int32, axis=1)
```

Several libraries exist to make this task even simpler and handle the special cases (and sometimes other formats) for you, such as [wavio](https://pypi.org/project/wavio/), [SoundFile](https://pypi.org/project/SoundFile/), and [scipy.io.wavfile](https://docs.scipy.org/doc/scipy-0.14.0/reference/io.html). You can also use Python with ffmpeg for audio conversion or acquisition, as described in the [Video section](#video).

In case you were wondering, the `wave` module corrects for system endianness when [reading](https://github.com/python/cpython/blob/25fa3ecb98f2c038a422b19c53641fa8e3ef8e52/Lib/wave.py#L244) and [writing](https://github.com/python/cpython/blob/25fa3ecb98f2c038a422b19c53641fa8e3ef8e52/Lib/wave.py#L431).

---

_Edited 2020-08-10 for errata in the section "Audio to/from hardware"._

[^1]: This snippet is not strictly in the bytebeat mold, as it avails itself of luxuries such as sin and floating-point arithmetic.

[^2]: Actually, the expression can use whatever it wants because it's being evaluated as Python, without restricting the namespace in any way. Obviously, this is not safe on untrusted input. A somewhat safer version might use [`ast.literal_eval()`](https://docs.python.org/3/library/ast.html#ast.literal_eval) (with substitution of the relevant variables, though this would still lack sin, cos, etc.) or [NumExpr](https://github.com/pydata/numexpr).

[^3]: This is the most straightforward, readable, and fastest way to do it, but the alternative `interleaved = np.ravel((left, right), order='F')` is slightly more concise and convenient to use with more channels. You can find a whole catalogue of approaches to this tiny task [here](https://stackoverflow.com/questions/5347065/interweaving-two-numpy-arrays).
