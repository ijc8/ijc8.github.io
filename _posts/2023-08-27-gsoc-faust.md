---
layout: post
title: "GSoC'23: Better Faust on the Web"
subtitle: "a summer retrospective"
date: 2023-8-27 18:00:00 -0400
---

# Background
This summer, I participated in [Google Summer of Code](https://summerofcode.withgoogle.com/), working with [GRAME](https://grame.fr/) (and more specifically [Stéphane Letz](https://github.com/sletz)) for better Faust on the web!

[Faust](https://faust.grame.fr/) is a functional audio language intended to efficiently express digital signal processing algorithms. I mean "efficiently" in the sense of both programmer time (expressively, concisely) and machine time (generating highly-optimized code). I was eager to work on Faust in particular because it is relevant to my work in music technology and to my long-standing interests in programming language design and compilers. One of the really neat things about Faust is that it seeks to target many different architectures, platforms, and environments --- from spitting out C code using JACK on Linux, to building an audio plugin with C++ and JUCE, to targeting an Android phone or a Bela board or a SuperCollider unit generator.

It also supports generating code that can run on the web: first [through C++ to asm.js using Emscripten](https://hal.science/hal-03162964v1/file/27.pdf), then [directly to asm.js using a new backend](http://lac.linuxaudio.org/2015/papers/12.pdf), and finally [to WebAssembly](https://hal.science/hal-03162898/document). What's more, the Faust compiler *itself* has been compiled to WebAssembly (via Emscripten) and thus can compile DSP code in the browser, on-the-fly, generating new Web Audio nodes on-demand! This nifty feature has enabled a number of web-based projects that make it easy to work with Faust without setting up any toolchains, compilers, or SDKs.

# Project Goals

The overarching goal of my project was to build on Faust's existing support for the web platform and enhance it. Under this general goal, I identified four subgoals in my proposal:

1. Transition the Faust web tools ([editor](https://fausteditor.grame.fr/), [IDE](https://faustide.grame.fr/), and [playground](https://faustplayground.grame.fr/)) from using `faust2webaudio` (which produces a lot of glue code and is no longer actively maintained) to the newer `faustwasm`. This would involve updating `faustwasm` to use the latest version of libfaust, making it the official successor to `faust2webaudio`, and building on some of the existing work done by Shihong Ren.
2. Extend the Faust Web IDE to make it a more useful environment for audio development. Potential extensions include UI improvements to the built-in plots (zooming, log-scale axes, pop-out windows) and additional support for audio and MIDI input (e.g. the ability to record and playback live input).
3. Enhance Faust's online documentation so that all Faust examples can be executed and played inline, without requiring the reader to leave the documentation.
4. Prototype an experimental platform for sharing Faust code on the web. This subgoal was inspired by [Freesound](https://freesound.org), a huge collaborative database of sounds with open licenses; it would be nice to have a similarly collaborative repository for DSP code, such that users can experiment with audio code in their browser and easily import it into their project.

# Execution

Tackling all four subgoals proved a bit too ambitious for a medium-sized project. Ultimately, I ended up focusing the most on subgoals 1 and 3, which both increased in scope at the expense of 2 and 4.

## Infrastructure Work
Most of the summer was spent on infrastructural work (related to subgoal 1). Shihong Ren created [faustwasm](https://github.com/Fr0stbyteR/faustwasm) to supersede his older [faust2webaudio](https://github.com/grame-cncm/faust2webaudio) (which he originally wrote in 2019), but this work was not yet fully integrated into the Faust ecosystem. Thus, my initial goal in the infrastructural work was to migrate the Faust web tools (IDE, editor, playground) to `faustwasm`. This also involved reconciling the feature branch `wasm2`, which had not been touched since 2021, with the main branch (`master-dev`), in order to get `faustwasm` unstuck from an old version of libfaust. (See the branch [ijc/wasm-new](https://github.com/ijc8/faust/tree/ijc/wasm-new) on my fork, PR [faust#912](https://github.com/grame-cncm/faust/pull/912), and the branch [https://github.com/grame-cncm/faust/tree/wasm2-june23](wasm2-june23).)

I then worked on to the main task of migrating the web projects, starting from Shihong's various branches and draft PRs from last year: [migrate-faustwasm](https://github.com/Fr0stbyteR/fausteditorweb/tree/migrate-faustwasm) on a Faust IDE fork, [fausteditor#3](https://github.com/grame-cncm/fausteditor/pull/3), and [faustplayground#7](https://github.com/grame-cncm/faustplayground/pull/7). In addition to migrating the code to use `faustwasm`, I found several opportunities to clean up and employ best practices, such as using package managers (i.e. npm) instead of storing copies of dependencies in the repository, using build tools to generate minified bundles, and setting up GitHub actions to build artifacts rather than manually generating them and checking them into source code version control. Other work included migrating fausteditor from _f4u$t to [faust-ui](https://github.com/Fr0stbyteR/faust-ui), converting code to ES modules, testing, and updating documentation.

Much of this work was not included in the original scope of subgoal 1, and thus infrastructure work took considerably more time than anticipated. Nonetheless, the work needed doing, and one upshot is that the final PRs have line count changes like this:

![fausteditor#4 changed lines]({{ site.baseurl }}/images/fausteditor-loc.png)

![faustplayground#9 changed lines]({{ site.baseurl }}/images/faustplayground-loc.png)

![faustide#72 changed lines]({{ site.baseurl }}/images/faustide-loc.png)

which I always like to see.

I also came across a couple of interesting bugs:
- While working on my [fausteditor PR](https://github.com/grame-cncm/fausteditor/pull/4), I encountered a bizarre issue where AudioWorklet mode worked fine when I was testing locally but failed in deployment. This turned out to be due to some very hairy interactions between minifiers, introspection, and faustwasm AudioWorklet code (which is generated at runtime). See [faustwasm#1](https://github.com/grame-cncm/faustwasm/pull/1) for details!
- Stéphane observed some [mysterious errors](https://github.com/grame-cncm/faustide/pull/72#issuecomment-1642541303) when trying out Faust IDE PR. After guessing that these were memory-related and that they stemmed from our Emscripten build of libfaust, I tracked down the issue to an [Emscripten commit](https://github.com/emscripten-core/emscripten/commit/157fcd4650161d9e0261966e2d3b529d62e1babc) from last year which reduced the default stack size from 5MB to just 64KB, causing the Faust compiler to overflow the stack when compiling some programs. This bit us when we recompiled libfaust using a more recent version of Emscripten; if the story has a moral, it's to read compiler changelogs! (PRs: [faust#928](https://github.com/grame-cncm/faust/pull/928), [faustwasm#4](https://github.com/grame-cncm/faustwasm/pull/4). This also addressed a [user-submitted issue](https://github.com/grame-cncm/faustwasm/issues/3).)

The migration of the Faust web tools occurred in the following PRs: [faustide#72](https://github.com/grame-cncm/faustide/pull/72) (open, blocked on discussion with another stakeholder), [fausteditor#4](https://github.com/grame-cncm/fausteditor/pull/4) (merged & deployed), and and [faustplayground#9](https://github.com/grame-cncm/faustplayground/pull/9) (merged & deployed).

## faust-web-component
All of this infrastructure work is important for the health of Faust on the web, but it's mostly behind-the-scenes. None of it is directly visible to users who actually encounter Faust _on the web_! Thus, after working on infrastructure for most of the summer, I was excited to switch gears in late July to work on subgoal 3. Initially the idea was just to make the Faust documentation more interactive: allowing users to try out and modify examples without leaving the docs. When discussing this idea with Stéphane, we realized that it could be more generally useful if I created a [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) to embed executable and editable Faust examples on any web page, not just the Faust documentation. Then, people discussing and demonstrating DSP on their own websites could easily embed Faust just by adding a `<script>` tag.

So, I designed and implemented new web components for embedding Faust on the web. Using them looks something like this:
```html
<p><em>Here's an embedded editor!</em></p>

<faust-editor>
<!--
import("stdfaust.lib");
ctFreq = hslider("cutoffFrequency",500,50,10000,0.01);
q = hslider("q",5,1,30,0.1);
gain = hslider("gain",1,0,1,0.01);
process = no.noise : fi.resonlp(ctFreq,q,gain);
-->
</faust-editor>

<p><em>And here's a simple DSP widget!</em></p>

<faust-widget>
<!--
import("stdfaust.lib");
ctFreq = hslider("[0]cutoffFrequency",500,50,10000,0.01) : si.smoo;
q = hslider("[1]q",5,1,30,0.1) : si.smoo;
gain = hslider("[2]gain",1,0,1,0.01) : si.smoo;
t = button("[3]gate") : si.smoo;
process = no.noise : fi.resonlp(ctFreq,q,gain)*t <: dm.zita_light;
-->
</faust-widget>

<script src="faust-web-component.js"></script>
```

(The Faust source is embedded in an HTML comment `<faust-editor>` to prevent it from being treated as HTML; this is inspired by [@strudel.cycles/embed](https://www.npmjs.com/package/@strudel.cycles/embed).)

This result looks like this (view the page source to compare against the example code):

---
<style>
faust-editor, faust-widget {
    font-size: 12px;
}
</style>

<p><em>Here's an embedded editor!</em></p>

<faust-editor>
<!--
import("stdfaust.lib");
ctFreq = hslider("cutoffFrequency",500,50,10000,0.01);
q = hslider("q",5,1,30,0.1);
gain = hslider("gain",1,0,1,0.01);
process = no.noise : fi.resonlp(ctFreq,q,gain);
-->
</faust-editor>

<p><em>And here's a simple DSP widget!</em></p>

<faust-widget>
<!--
import("stdfaust.lib");
ctFreq = hslider("cutoffFrequency",500,50,10000,0.01);
q = hslider("q",5,1,30,0.1);
gain = hslider("gain",1,0,1,0.01);
process = no.noise : fi.resonlp(ctFreq,q,gain);
-->
</faust-widget>

<script src="{{ site.baseurl }}/js/faust-web-component-0.0.0.js"></script>
---

As you can see (assuming you have JavaScript enabled), `<faust-editor>` gives you a little editor (CodeMirror 6) that allows you to compile, run, and hear Faust code right on the page, along with tabs for controls, block diagrams, and plots. Perfect for observing and experimenting with some Faust code. If you want to get more serious, you can click the button that opens the current contents of the embedded editor in the more full-featured Faust IDE. `<faust-widget>` is a more minimal component that just gives you audio & controls (which may be more useful when the point is more the DSP itself rather than its implementation in Faust). These web components live in the [faust-web-component repository](https://github.com/ijc8/faust-web-component/commits/main).

# Future Work

A few loose ends remain to be tied up regarding the infrastructure work. While the fausteditor and faustplayground PRs have been merged and deployed, the faustide PR (which is usable [here](https://ijc8.me/faustide) in the meantime) and the wasm2-june23 branch are awaiting discussion with other stakeholders related to old export options. Beyond getting these merged, future work could include more cleanup to make the projects more consistent, such as converting fausteditor to TypeScript (to match the playground and IDE) and updating the build process of faustide to use [vite](https://vitejs.dev/) (to match the editor and playground).

As for faust-web-component, we still need to transfer or fork my repository to [grame-cncm](https://github.com/grame-cncm), publish a package to npm, and merge my fork of faustdoc that uses faust-web-component (currently viewable [here](https://ijc8.me/faustdoc/)) upstream. Beyond that, features that may be nice to have in the future include support for polyphony and MIDI, audio input via file (including some stock signals), and greater configurability via HTML attributes.

As discussed previously, subgoals 2 and 4 were sidelined in favor of 1 and 3 as the summer unfolded, but I still think they're worthwhile. Regarding subgoal 2 (extensions to the Faust IDE), some of the [features that people have requested](https://github.com/grame-cncm/faustide/wiki#dario-sanfilippo--020423) should be fairly straightforward to implement, and I may take a stab at these in the coming weeks now that my GSoC is over. Subgoal 4 was always something of a stretch goal, as it entailed building a new full-stack application for sharing and browsing DSP code. I still would like to work on this, but given the exploratory nature of the idea and its ambitions beyond Faust (it would be nice to make the platform general enough to support other languages and systems), it may be a better fit for my work as a graduate student anyway.

# Conclusion

I had a good experience working on Faust during this Summer of Code, and I look forward to seeing how the work I did impacts Faust on the web. Somewhat ironically, I didn't actually have all that much opportunity to use Faust _the language_ in my work (beyond example code for testing & debugging), despite working on Faust all summer. But I did gain valuable familiarity with the tooling and ecosystem, and I've already had the chance to share the ways Faust can be used on the web with others. What's more, I'm eager to spend more time getting my hands dirty with Faust in my personal and research projects.

Before I go, here are some brief remarks on my GSoC experience that might be useful to future participants:
- The work was entirely remote (with a 6-hour timezone difference between me and my host organization) and felt considerably more independent/hands-off than an internship. There was no daily standup or regularly-scheduled team meeting. This reflects the reality of many open-source contributions---where the primary modes of communication and collaboration are often asynchronous---but it can be a bit tricky to balance with other obligations that have more regular prodding (such as standup) built-in. To future contributors, I suggest instituting some kind of (synchronous if possible) routine check-in and getting it on your calendar as a motivation tool.
- Scoping is hard! And it can be particularly tricky with GSoC, because there is a good chance that you're entering an unfamiliar but long-lived codebase (which may have loose ends in varying states of readiness), but you have to submit proposals with timelines well _before_ the coding period (and even the Community Bonding Period, which is intended for getting up to speed).
- The GSoC timeline was a little awkward for me: both the beginning and end lined up with fairly hectic periods of my year. Try to look out for this in advance when thinking about how you'll ramp up and wrap up your work.

Thanks to Google for sponsoring and organizing this great program, thanks to GRAME for making Faust fast, flexible, and free, and thanks also to:
- My advisor, Jason Freeman, for supporting my applying to GSoC and giving me ample flexibility in my concurrent work on [EarSketch](https://earsketch.gatech.edu/),
- Shihong Ren for his previous (and ongoing) work on Faust on the web and for his help in picking up where he left off,
- and of course my mentor, Stéphane Letz, for his support throughout the summer!
