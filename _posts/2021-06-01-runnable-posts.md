---
layout: post
title: "Runnable Posts with Pyodide"
subtitle: "the kitchen sink in the browser"
date: 2021-06-01 23:10:00 -0400
---

I sometimes write posts [that]({% post_url 2018-08-01-unix-utility-of-the-day-xxd %}) [include]({% post_url 2020-4-20-quick-audio-video-python %}) [code]({% post_url 2020-5-21-kilobeat %}). This is nice because it allows me to describe something very precisely, yet approachably: I can _show_ the reader exactly what I'm talking about, often in a format where they can "try this at home" and experiment with it by running it on their own machine.

However, this requires that readers switch between the article and something else (e.g. a Python REPL). If they wait until the end without running any code, they might not bother. If they switch in the middle of the article, they might not come back and finish it. Ideally, they would be able to run the code _right there in the post_.

In other posts and pages on this site, there's a complementary problem: the code is easily runnable, but not easily visible. Sometimes I post _runnable applications_: client-side Javascript. [kilobeat]({% post_url 2020-5-21-kilobeat %}) and [my mini GSX synth emulator]({% post_url 2020-9-6-emulating-the-gsx %}) are good examples. These can be executed by the reader right in the browser (indeed, the GSX emulator is embedded directly in the post). The code, however, is slightly hidden ("view source") and, as before, not readily tweakable without context-switching.

Ideally, runnable posts should:
- Let the reader see the code.
- Let the reader run the code and see the result (including text, images, and sounds).
- Let the reader modify the code, run their modified code, and see the new result.

Additionally, from a practical standpoint, they should:
- Run on the client side (cheaper and more secure for the host, as the reader fiddles around on their own device).[^contrast]
- Work for a variety of languages (at least any language I'm interested in for writing posts).

[^contrast]: This is in contrast to many popular solutions today, such a [Replit](https://replit.com/), [TIO](https://tio.run/), [Binder](https://mybinder.org/), [Colab](https://colab.research.google.com), etc., all of which run the code on a server somewhere else. With the advent of Emscripten and WebAssembly, this is less necessary than ever; if the user wants to run some code, why not let *them* run the code? If they have a device that can render some code, it ought to be capable of running it, too.

I have been experimenting with runnable articles lately, with the initial goal of embedding runnable Python code blocks capable of running in another thread (so as not to block the UI while crunching) and generated embedded text, images, and audio on the page. Without further ado, here is the demo, with an explanation afterwards.

# Demo

Click "Run" (or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>) to make the magic happen.

~~~ python
print("Hello, world!")
~~~
{: .runnable}

Perhaps that didn't knock your socks off, but we've got to start somewhere. The next example demonstrates real-time output (text appears on the page while the snippet is still running):

~~~ python
import asyncio

print("Time to count!")
for i in range(10):
    await asyncio.sleep(0.5)
    print(i)
~~~
{: .runnable}

Text is fine, but let's get visual. This example imports numpy (!!) and spits out a random RGB image each time it runs:

~~~ python
import numpy as np
import embed

image = (np.random.random((300, 300, 3)) * 255).astype(np.uint8)
embed.image(image)
~~~
{: .runnable}

And this example imports matplotlib (!!) and draws a couple of plots:

~~~ python
import matplotlib.pyplot as plt
import random

print("Here's a sweet plot:")
plt.figure(figsize=(6, 6), dpi=72)
plt.xlabel("Time")
plt.ylabel("Stonks")  # gotta label those axes
plt.plot([1, 2, 4])
plt.tight_layout()
plt.show()

print("\nYup, that sure was a plot. Here's some noise:")
plt.plot([random.gauss(0, 1) for _ in range(1000)])
plt.tight_layout()
plt.show()
~~~
{: .runnable}

How about some time-varying content? This example generates a sine wave, which gets embedded in the page as an `<audio>` element.

~~~ python
import math
import embed

sine_wave = [math.sin(2*math.pi*440*i/44100) for i in range(44100)]
embed.audio(sine_wave, 44100)
~~~
{: .runnable}

Let's put it together: visual, time-varying content (i.e. animation):

~~~ python
import numpy as np
import embed

frames = [(np.random.random((300, 300, 3)) * 255).astype(np.uint8) for i in range(5)]
embed.animation(frames)
~~~
{: .runnable}

The post [Quick & Simple: Audio and Video in Python]({% post_url 2020-4-20-quick-audio-video-python %}) included a neat little example application for generating animated GIFs from short expressions (like `x+y+t`). With the ingredients we have so far, we can bring this application into the browser. You can run and tweak this directly:

~~~ python
import numpy as np
import embed

fps = 16
width, height = 196, 196

# Put some convenient things in the namespace:
pi, sin, cos = np.pi, np.sin, np.cos

def render_animation(frame_function):
    frames = []
    num_frames = 32
    for i in range(num_frames):
        frame = np.zeros((width, height))
        for row in range(width):
            for col in range(height):
                x, y, t = col / width, row / height, i / num_frames
                frame[row, col] = frame_function(x, y, t)
        frames.append((frame * 255 % 255).astype(np.uint8))
    embed.animation(frames, 1000/fps, style="display: inline")

# Some animations.
waves = lambda x, y, t: x + y + t
spring = lambda x, y, t: 1-abs(x-.2-.5*sin(2*pi*(y*(t-.5)**2*4))**2)**(1/2)
walls = lambda x, y, t: 2**8*((x-.5)/(y-.501))*t**3
bounce = lambda x, y, t: 128*(2*(t-.5))**3*((x-.5)**2+(y-.5)**2)
scan = lambda x, y, t: (1-(abs((x-t+.5)%1-.5))**(1/4))/2+(y-(t-.5)**2)**2/2
def flock(x, y, t):
    r = np.random.random()
    return int(abs(x-(sin(2*pi*(t+r/4))*sin(2*pi*(y+r/2))+1)/2)<.05)*r

# After running this snippet once, comment this out...
for anim in [waves, spring, walls, bounce, scan, flock]:
    render_animation(anim)
# and try making your own expression animation!
# render_animation(lambda x, y, t: <your expression here>)
~~~
{: .runnable}

# How does it work?

Each runnable snippet consists of an editor ([Ace](https://ace.c9.io/)) hooked up to a Python interpreter (running in a web worker) with a few special hooks for manipulating the DOM (insert `<pre>`, `<image>`, and `<audio>` tags). But how is Python running in your browser?

There are several options in this space; I looked into Skulpt, Brython, and Pyodide.

[Skulpt](https://skulpt.org/) works by compiling Python to Javascript, and it has been used successfully in educational projects such as [Runestone Academy](https://runestone.academy) and [EarSketch](https://earsketch.gatech.edu). The emphasis seems to be more on providing basic Python syntax and semantics (as needed for pedagogy) than comprehensively bringing Python to the browser. Only a fairly small set of standard library modules are included, and there's not a good story for [FFI](https://en.wikipedia.org/wiki/Foreign_function_interface) beyond JS. Bringing in new modules seems to be labor-intensive, as it generally requires re-implementing them in Javascript. Also, Skulpt does not yet have complete support for Python 3 syntax & semantics; I tried running some closure-heavy code and got bitten by the absence of `nonlocal`. 

[Brython](https://brython.info/) also compiles Python to Javascript. Its goal is to bring Python to the web (as a language for client-side web programming) rather than pedagogy, and to that end, and it has a greater focus on compatability. It supports Python 3 and a much larger subset of the standard library. However, it has similar issues with FFI, and there's no good way to bring in modules with external compiled components like numpy. It's worth mentioning that this issue is not specific to the web: pretty much every Python implementation other than CPython, including Jython, IronPython, and even PyPy, have some difficulties here.

Because I'm interested in writing posts about signal processing and audio/video synthesis (among other things), being able to run code that features `numpy` and `matplotlib` is a must-have. It became clear in my search that Skulpt and Brython, while supporting important use cases, wouldn't be able to support my use case.

Enter Pyodide. [Pyodide](https://pyodide.org/en/stable/) brings Python, plus 75 popular packages including `numpy`, `scipy`,  and `matplotlib`, to the browser. Unlike the other options I considered, it does not compile Python code to Javascript: instead, it compiles the Python _interpreter_ to WebAssembly. This means the project does not have to reimplement Python, and it does not have to worry about working towards compatibility with CPython: it _is_ CPython, just compiled (and packaged up, with lots of support for JS interop) for a different architecture. Neat!

What's the catch? Well, it's heavier than other options: the user has to download the whole Python runtime to run any Python code, which takes the form of a wasm blob on the order of 10 MB. That's a bit big, but not huge; it's small enough for browsers to cache. Conveniently, large compiled modules (like `numpy` and `scipy`) can be fetched only when needed. For my purposes, the tradeoff is worth it: I get CPython and many of the packages I often rely on when writing Python outside the browser.

~~~ python
import sys
print(sys.version)
~~~
{: .runnable}

# Glue

Pyodide is great, but it wasn't made for my particular use case. Fitting it into runnable posts still took a little work and experimentation.

Initially, I found that running Python code would block the main thread. This meant that the page would not update while the snippet was running, precluding real-time output and also preventing any other JS from running (for example, to display "Running..." text for a long-running script). Fortunately, [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) let us run code in another thread. They're [well-supported](https://caniuse.com/webworkers) these days, and the Pyodide docs include [an example](https://pyodide.org/en/stable/usage/webworker.html).

Getting output to show up on the page in real-time (as opposed to all of the output appearing at the very end) took a little more work. Building off a [solution](https://github.com/pyodide/pyodide/issues/8#issuecomment-772024841) for capturing output via `io.StringIO`, I wrote a subclass of [`io.TextIOBase`](https://docs.python.org/3/library/io.html#io.TextIOBase) to send messages from the worker to the main thread, and [redirected stdout and stderr](https://docs.python.org/3/library/contextlib.html#contextlib.redirect_stdout) to this new output.

That took care of text; for images and audio, I came across [this StackOverflow answer](https://stackoverflow.com/a/56670502) suggesting converting the data to base64 and embedding it directly in the `src` attribute. I adapted this approach with a few more Python functions and message types from the worker, which took care of audio and images (including animations). I put all of these into a little module (generated at runtime) called `embed`.

Then there were a couple of one-off hacks for usability. I monkey-patched `time` so `time.sleep` would actually do something (unfortunately, it [busy-waits](https://en.wikipedia.org/wiki/Busy_waiting); this can be avoided by instead `await`ing `asyncio.sleep` as above). Also, if snippet code imports matplotlib, I monkey-patch it so `plt.show` does the right thing. Lastly, I ran into issues generating audio because I could not import the `wave` module: it's included in Pyodide, but [`audioop`, which it depends on, is not](https://github.com/pyodide/pyodide/issues/801), so the import fails. For now, I've hacked around this by inserting a trivial shim for `audioop` into `sys.modules`, but it doesn't look like there's any reason for audioop to be excluded from Pyodide.

The source for the web worker, including the Python setup code and scaffolding, can be found [here](https://github.com/ijc8/ijc8.github.io/blob/master/runnable/worker.js).

There's also a little code outside the webworker for converting my Markdown-embedded code snippets into runnable code editors, and for receiving an acting on the messages from the worker, which can be found [here](https://github.com/ijc8/ijc8.github.io/blob/master/runnable/main.js). This makes it very simple to write runnable snippets in my post. I can use the usual syntax for a [code block](https://www.markdownguide.org/extended-syntax/#fenced-code-blocks) and simply append `{: .runnable}`:

~~~~ markdown
~~~ python
print("Hello, world!")
~~~
{: .runnable}
~~~~

The JS pulled into the post will automatically find code blocks marked as "runnable" and replace them with a code editor (with the content from the block), run button, and output area.

# What's next?

I hope to soon write more runnable posts that take advantage of this capability. Beyond that, I might look into [PyPy.js](http://pypyjs.org/) as another Emscripten-based approach (with [PyPy](https://www.pypy.org/)'s JIT compiler) to running Python in the browser, and at some point I'd like to extend my runnable posts to support other languages: JS, Scheme, Clojure, C, Rust... who knows? It's a brave new world on the web.

Until then...
~~~ python
import math
import random
import embed
from PIL import Image, ImageDraw, ImageFont

frames = []
num_frames = 10
for i in range(num_frames):
    txt = Image.new("RGB", (64, 64), (0,0,0))
    d = ImageDraw.Draw(txt)
    sin = math.sin(2 * math.pi * i / num_frames)*8
    cos = math.cos(2 * math.pi * i / num_frames)*8
    d.text((10+random.random()*10+sin, 10+random.random()*5), "Happy", fill=(255,255,255))
    d.text((7+random.random()*10, 30+sin), "Hacking!", fill=(96,255,96))
    frames.append(txt)

embed.animation(frames, width=256, height=256, style="image-rendering: crisp-edges; display: block")
~~~
{: .runnable}

<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js" type="text/javascript" charset="utf-8"></script>

<link rel="stylesheet" href="{{ SITE_URL }}/runnable/style.css">
<script src="{{ SITE_URL }}/runnable/main.js"></script>