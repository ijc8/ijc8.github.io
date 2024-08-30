---
layout: post
title: "GSoC'24: Differentiable Logic for Interactive Systems and Generative Music"
subtitle: "a(nother) summer retrospective"
date: 2024-08-26 13:00:00 -0400
---

[Last summer]({{ site.baseurl }}{% post_url 2023-08-27-gsoc-faust %}), I participated in [Google Summer of Code](https://summerofcode.withgoogle.com/) for the first time, working with [GRAME](https://grame.fr/) on improving support for using the [Faust](https://faust.grame.fr/) audio programming language [on the web](https://summerofcode.withgoogle.com/archive/2023/projects/L6oI4LhW).

This summer, I returned for another round, this time working with [BeagleBoard.org](https://www.beagleboard.org/) on a project that defies such easy explanation: "Differentiable Logic for Interactive Systems and Generative Music". What does that mean? Let's break it down.

# Ingredients
The key ingredients that went into this project are difflogic, Bela, and bytebeat, which roughly correspond to "Differentiable Logic", "Interactive Systems", and "Generative Music", respectively. I explain what these ingredients are and how they fit together in the [intro video](https://www.youtube.com/watch?v=NvHxMCF8sAQ) I created at the start of the project,

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/NvHxMCF8sAQ?si=FSEsVFchTJlgtEbB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
{: style="display: block; margin: auto"}

but I'll recap briefly here.

## Differentiable Logic: difflogic
In 2022, Felix Petersen, Christian Borgelt, Hilde Keuhne, and Oliver Deussen published an [intriguing paper](https://arxiv.org/abs/2210.08277) on training machine learning models built out of networks of logic gates rather than "neurons" (as in neural networks). The motivation for using logic gates is that, unlike neurons, your computing devices (e.g. the ALU) are actually built out of them. Learning a model that better to corresponds to your hardware cuts out the "middle man" of additional layers of abstraction between your task and its execution. Accordingly, Petersen et al. reported substantial gains in efficiency from using logic gates in terms of model size and inference speed. Neat!

(The challenge of using logic gate networks, compared to neural nets, is that logic gates are discrete and not differentiable; this is the main challenge addressed by Petersen et al's work, which uses a combination of real-valued logic and relaxation to enable the use of gradient descent when learning logic gate networks.)

The paper was followed by the release of [difflogic](https://github.com/Felix-Petersen/difflogic), a PyTorch-based library for differentiable logic gate networks.

## Interactive Systems: Bela
[Bela](https://bela.io) is the "platform for beautiful interaction", spun out of the [Augmented Instruments Lab](http://instrumentslab.org/) in 2016 and [crowdfunded](https://www.kickstarter.com/projects/423153472/bela-an-embedded-platform-for-low-latency-interact) via Kickstarter.
It's an open-source embedded platform for real-time audio and sensor processing built on the [BeagleBone Black](https://www.beagleboard.org/boards/beaglebone-black).
It enables people to build highly responsive instruments, installations, interactions, and it supports a number of languages & environments for doing so.

## Generative Music: bytebeat
[bytebeat](http://canonical.org/~kragen/bytebeat/) is a musical practice which involves writing short expressions that describe audio as a function of time, generating sound directly, sample-by-sample. For example, the expression `((t>>10)&42)*t` generates the following audio:

<audio controls="controls">
    <source src="{{ site.baseurl }}/static/gsoc24-bytebeat-long.wav">
    Your browser does not support the audio element.
</audio>
{: style="display: block; margin: auto"}

The bytebeat approach is rather unusual compared to the conventional computer music approach, which tends to feature a rigid separation of different layers (control vs. synthesis, score vs. orchestra). Bytebeat expressions, in contrast, simultaneously determine everything --- timbre, rhythm, melody, structure --- from the level of individual audio samples on up.

(Representing music in the form of very compact programs has been a [perennial](https://ijc8.me/kilobeat/) [interest](https://ijc8.me/blocks/) of [mine](https://ijc8.me/s/) ever since I first encountered bytebeat several years ago.)

# Goals
Take these ingredients, put them all together, and you get some interesting possibilities for the use of (title drop) *differentiable logic for interactive systems and generative music*![^title] The overarching goal of this project is to explore and realize some of those possibilities.

[^title]: Okay, yes, the project title is kind of a mouthful. "Better Faust on the Web" was definitely snappier.

The Bela is an excellent platform for building low-latency interactive applications, but as an embedded system sans hardware acceleration, it's rather underpowered for conventional models. Difflogic offers a way to build models that can perform useful tasks more efficiently than conventional neural networks. Thus, the technical motivation for this project is taking advantage of the relative efficiency of logic gate networks to enable new machine learning applications in embedded, real-time contexts such as Bela projects.

Bytebeat expressions typically involve many bit-twiddling operations, consisting primarily of logic gates (bitwise AND, OR, XOR, NOT) and shifts; this suggests a natural affinity with difflogic, wherein models consist of networks of logic gates.
This provides a creative motivation for the project: by applying the bytebeat approach (sound as pure functions of time) to logic gate networks, perhaps we can find compact representations for sounds and an interesting space for creative exploration and manipulation.

With these motivations in place, we can divide the projects goals into three areas:

1. Integration: Enable the use of logic gate networks in interactive applications on embedded systems such as the Bela and in computer music languages such as those supported on Bela. Find ways to take advantage of the BeagleBone hardware (e.g. PRUs, explained below) for better integration with difflogic.

2. Experiment: Investigate the training & usage of difflogic models for various tasks and the possibility of combining difflogic with other useful machine learning techniques and methods.

3. Application: Build applications to demonstrate the capabilities of difflogic models for interactive systems and generative music. Explore creative affinities between difflogic and existing creative practices such as bytebeat.

More detailed information about the project's background and goals is available in [the proposal](https://gsoc.beagleboard.io/proposals/ijc.html).

# Execution

[Once again]({{ site.baseurl }}{% post_url 2023-08-27-gsoc-faust %}#execution),[^scoping] all of this was a bit much for a 12-week project. For the most part, I spent the first half of the summer working on infrastructure & integration work, and the second half working on a creative application to play with sound-generating logic gate networks. The proposed machine learning experiments drew the short straw, in part for reasons described below.

[^scoping]: scoping is hard!

## Integrations

### Language integration

The Bela platform supports [a number of programming languages](https://learn.bela.io/using-bela/languages/bela-language-support/) so as to give makers several options when creating their projects. These include C++, Pure Data (Pd), SuperCollider, and Csound.

Thus, the first goal of the project was to build wrappers to enable the use of logic gate networks in these various languages, similar to what [nn~](https://github.com/acids-ircam/nn_tilde) offers for neural networks.

The starting point was the built-in functionality that difflogic offers for exporting a trained model to C source code. First, I created wrappers that would build a plugin (Pd external, SuperCollider UGen, etc.) with a given network "baked in" to the compiled plugin. The baked-in approach is suitable for compiled languages such as C++ and Faust, where changes to the project already require compilation. For more dynamic languages (Pd & SuperCollider), however, this approach has drawbacks---switching models (even to a subsequent version of the same model, after further training) requires recompiling and reloading the plugin. And using multiple models requires building multiple versions of what is mostly the same plugin, giving each a different name to avoid collisions.

<!-- TODO: something about performance and batching? -->

![difflogic~ (with network baked in) in a Pd patch on Bela]({{ site.baseurl }}/images/gsoc24-pd-bela.png){: style="display: block; margin: auto"}

A more flexible approach: compile the difflogic-generated C into a shared library and dynamically load it using (on Linux or macOS) [`dlopen()`](https://man7.org/linux/man-pages/man3/dlopen.3.html). This is the approach taken by the most complete wrapper, a difflogic external for Pure Data, which supports loading difflogic DLLs and comes with both signal (`difflogic~`) and message (`difflogic`) versions of the object.

![difflogic and difflogic~ objects (loading network from dynamic library) in a Pd patch in PlugData]({{ site.baseurl }}/images/gsoc24-plugdata.png){: style="display: block; margin: auto"}

Further flexibility could be attained by loading a description of the network and either interpreting it (as in the interactive application described [below](#applications)) or perhaps using just-in-time (JIT) compilation, but this would come at the cost of performance and/or plugin complexity.

### BeagleBoard integration

The language integrations described above are useful on Bela (because Bela supports those languages), but they are also usable elsewhere (e.g. Pd running on your laptop). I also explored integrations more specific to the BeagleBone Black upon which Bela is built.

In addition to the main CPU (a 1 GHz ARM Cortex-A8), the BeagleBone Black features two 200 MHz programmable real-time units. The Bela uses one PRU [for its own purposes](https://forum.bela.io/d/780-bela-s-usage-of-prus/3) (principally low-latency I/O), but the other is free for custom use. The PRU has a rather spartan instruction set, lacking both a hardware multiplier and floating-point support. Fortunately for us, logic gate networks require neither.

Thus, I explored the possibility of running logic gate networks on a PRU in parallel to the main CPU (which runs the audio thread and other tasks). Initially, I approached this by attempting to compile difflogic-generated C using [TI's PRU compiler toolchain](https://www.ti.com/tool/PRU-CGT) and integrating the generated code into the Bela [example project featuring custom PRU assembly](https://github.com/BelaPlatform/Bela/tree/9e95a402eb67eb7c17f2f5da57cd66a723c14691/examples/Extras/second-pru). However, in addition to being generally very hacky and unwieldy, this approach was complicated by the fact that Bela uses the `uio_pruss` driver to interface with PRUs, whereas it seems TI has moved on to `remoteproc` (and taken their toolchains along for the ride).[^pru-driver]

[^pru-driver]: See [this thread](https://forum.bela.io/d/1399-how-to-build-xenomai-kernel-with-pru-remoteproc-support/3) for slightly more information.

Rather than go further down this rabbit hole, I decided to change tacks and generate PRU assembly directly, without going through a C compiler. In addition to getting my hands dirty with the PRU's instruction set, this involved taking on some of the tasks that a C compiler would (hopefully) do for us. I ultimately used the [NetworkX](https://networkx.org/) library to pre-process and optimize the difflogic network before finally generating PRU assembly.

![Fragment of network pre-simplification (edge color indicates operand order)]({{ site.baseurl }}/images/gsoc24-network-crop.png){: style="display: block; margin: auto"}

![Fragment of network after expanding to basic operations and simplifyng]({{ site.baseurl }}/images/gsoc24-network-simplified-crop.png){: style="display: block; margin: auto"}

<!-- TODO talk about tricks like using bit-addressing to expand effective number of registers on PRU? -->

## Experiments

In order to build the wrappers & integrations described in the previous section, I first needed some logic gate networks to work with. Thus, I began by training some small and fairly trivial networks, learning a bit about difflogic along the way.

Compared to neural networks (which use floats throughout), we face additional questions about representation when working with logic gate networks, which deal only in bits. How should we encode real values (such as audio samples) at the input & output of a logic gate network? An obvious approach is to use the same representation that your computer ordinarily does: positional binary encoding (i.e. `0b1011 = 2**3 + 2**1 + 2**0 = 11`), followed by rescaling/offsetting as needed. However, in their work, Petersen et al instead use `GroupSum`, which sums groups of bits at the output of the network.

Intuitively, using `GroupSum` (and correspondingly [thermometer encoding](https://en.wikipedia.org/wiki/Unary_coding) for inputs) has the effect of smoothing out the basic binary weirdness of logic gate networks in exchange for increased redundancy. Representing 256 different values, for example, takes 255 output bits instead of the 8 that it takes for positional encoding.

In my small-scale experiments, I found markedly different behavior when using networks with binary positional encoding versus `GroupSum` (unary) encoding. Both kinds of networks could learn functions, but the binary representation was much more strongly affected by discretization, losing more accuracy when switching from training mode to inference mode than a GroupSum network of comparable size and exhibiting "jagged" behavior. The following plots demonstrate this with tiny networks trained to learn the identity function.

Binary (positional) encoding:
![Network using binary encoding trying to learn the identity function]({{ site.baseurl }}/images/gsoc24-binary-plot.png){: style="display: block; margin: auto"}

Unary (thermometer & GroupSum) encoding:
![Network using unary encoding trying to learn the identity function]({{ site.baseurl }}/images/gsoc24-unary-plot.png){: style="display: block; margin: auto"}

Input/output representation issues also complicated my plans to try combining difflogic with other ML techniques, such as [differentiable digital signal processing](https://magenta.tensorflow.org/ddsp) (DDSP). The problem is that the conversion between floating point scalars and binary vectors (either in positional representation or unary encoding) is only differentiable one-way. For instance, if we have a vector of bits `[a b c d]` positionally encoding a scalar, we can compute the corresponding scalar as `1*a + 2*b + 4*c + 8*d`, which we can easily differentiate with respect to each variable. Going the other way, from a scalar to a bit vector, we need to "split" the value into several discrete slots, and it's not obvious how to go about this in a differentiable way. This question is moot when we're feeding our data directly into a logic gate network; we can just convert the values beforehand. But if we're trying to train our logic gate network as part of a larger hybrid model, where the logic layers may follow neural layers, we have an open problem.

As this seemed like a research project in its own right, and GSoC is oriented towards functional outputs, further ML experiments were mostly sidelined in favor of the more concrete work in the other parts of the project.

## Applications

Finally, I wanted to build some concrete applications putting logic gate networks to work. I ultimately focused on a specific creative application inspired by conceptual affinities between logic gate networks and bytebeat expressions.

As mentioned previously, bytebeat expressions encode music in the form of expressions that compute audio samples directly as a function of time (sample index). I took the same approach with logic gate networks, treating them as sample-generating functions of time.

Initially, I tried training some difflogic networks on the output of bytebeat expressions. Related to the encoding issues described above, I found that GroupSum had a strong smoothing effect on the learned signal, with the result that the network output sounded like quiet noise. Subsequently, I decided to instead embrace the weirdness of raw (positional) bits and work with `GroupSum`-free synthesis networks!

Example: original audio for expression `((t >> 10) & 42) * t` (first two seconds)

<audio controls="controls">
    <source src="{{ site.baseurl }}/static/gsoc24-bytebeat-short.wav">
    Your browser does not support the audio element.
</audio>
{: style="display: block; margin: auto"}

Output of unary (thermometer & GroupSum) network:

![Network using unary encoding trying to recreate bytebeat output]({{ site.baseurl }}/images/gsoc24-unary-short.png){: style="display: block; margin: auto"}

<audio controls="controls">
    <source src="{{ site.baseurl }}/static/gsoc24-unary-short.wav">
    Your browser does not support the audio element.
</audio>
{: style="display: block; margin: auto"}

Output of binary (positional) network:

![Network using binary encoding trying to recreate bytebeat output]({{ site.baseurl }}/images/gsoc24-binary-short.png){: style="display: block; margin: auto"}

<audio controls="controls">
    <source src="{{ site.baseurl }}/static/gsoc24-binary-short.wav">
    Your browser does not support the audio element.
</audio>
{: style="display: block; margin: auto"}

With this approach, I found that difflogic was able to train networks that did a reasonable job of imitating bytebeat expressions (even with a naïve loss function and without the benefit of `+`, `*`, etc.). What's more, soon I found that even *totally random* (untrained) logic gate networks often sounded surprisingly interesting. This observation led me to focus less on sound reconstruction and more on a creating a compelling interaction for manipulating sound-generating logic gate networks.

To that end, I built real-time visualization for synthesis networks. The visual feedback immediately suggested some intuition for why small logic gate networks, featuring simple positional binary encoding, might tend to sound "musical".

![Animated synthesis network visualization]({{ site.baseurl }}/images/gsoc24-viz.gif){: style="display: block; margin: auto"}

To elaborate, the input to the network is a sample counter. This counter functions as a binary clock, and its size in bits determines the overall periodicity of the network (how much audio it can generate before repeating). For example, in a network with 16 bits of input generating audio at a sample rate of 8kHz, the input will overflow and repeat itself every `2**16 / 8000 = 8.192` seconds. But crucially, each bit of input loops at a *different* period. The least-significant bit flips between 1 and 0 every single sample, with a period of just 250ųs (or a frequency of 4kHz). This period doubles for the next most-significant bit, and so on up to the most-significant bit, which has a period of 8.192 seconds.

The rest of the network is just logic gates applied to these inputs, with the result that every gate's output is some combination (in the sense of interference patterns) of these power-of-two periodicities. The entire network is biased towards subdivisions of powers of two.[^ternary] Because the network generates audio at the sample level, simultaneously determining every level of musical hierarchy (from timbre to form), this effect is pervasive.

[^ternary]: Perhaps some kind of [ternary logic](https://en.wikipedia.org/wiki/Three-valued_logic) network would be biased towards triplets and triple meters?

Following network visualization, I worked on network manipulation. I designed an interaction inspired by [circuit bending](https://en.wikipedia.org/wiki/Circuit_bending) practices allowing the player to perform "brain surgery" on a live running network by masking out various gates, temporarily replacing them with constant values. In order to make this responsive, I built a simple network interpreter so that the network could be modified directly in memory (rather than re-exporting the network to C, recompiling that C, and then reloading the compiled network).

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/oJM4z2kHNTU?si=DRAYcJEFKg8QA4Ch" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
{: style="display: block; margin: auto"}

The final application can run both on the Bela (using the [Trill Square](https://shop.bela.io/products/trill-square) sensor for the network bending interaction) and in the browser (for easy demoing and greater flexibility of configuration). The browser version runs the network interpreter as a WebAssembly module in an Audio Worklet.[^inevitable]

[^inevitable]: thus satisfying the cosmic rule that all of my projects must inevitably involve wasm or worklets (usually both) somehow

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/0kLyE7axAkg?si=TzwnAAuCDxwl0fYT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
{: style="display: block; margin: auto"}

<!-- (TODO embed demo in this page??) -->

Just for fun, I embedded a synthesis network into a [ScoreCard](https://ijc8.me/s?c=010-$I*H.S-S1V1M/.:ZLJU-DRWQJE:L.-EX$KCV$QN2P$QG49V6EVLR7MEIV.B-VUO*3SV9Z$L.+1RZL$JNB7PR..066QB*L85GCMH02VC*XR/LLF6QDWJ.X+7.3FYQUARVOJ2LMQ$Q/O1K59EGC*Y0NS7VYCXAUYTYM7$OS/:1B7SHQC8KB:1EJQ54B3DGF/BY11A2JCGTVL0M+8GOK2GNUWR2*$EV4+0862A5NQRH4F7$JD.8APMEVQ7/M2RT$U85P-0/C.$1+24XL+QR1Y9ND9F8CE8$OES+6QP:QWJP:2DW+SXU7SQCJ-GVWDWG:KT1W0BNB-ZHW09G5SVA8MP2PXO3MHUN40C6CMH.1Q6I1*6ZIO$P7$Z7HQYWS.959/I9U+.87C6IVS5P.C*C4N+S4ZE2OLBJ69OVUM7ST5*O$XU3+V$S56$Q:OY0PFFHXCKRY94LZNGX71DS*30J2YTW9UOTHAA5LNB+69$MNLYH586E42+A$NGKDE-EQJ+8AFVQ9RMB1AZAW:.NRU69LLGFO7UBHBHV-CZ8WCN7:66CHF5QVQ5VF4+W7U417QGGTD05KVGCY.BDBR3R.GNUN:E31.PNVEWZYIH/*4LV94GOP4.GU9TSO-/+N1EM*:6:WT*B+WLA$0C3EAL2MPUKZWHN:X02V5W-7R0VE.F*OBH14RDJ+11:RLE7RRQ0-XZ-/G9QMQHYU$7/+P3OF61L35*Y*O2U$31BMZTH9$QTO9Z3:I+CTW3U+08RWOAN8MCTJAZ*T.-TG.H4*85RGKTMY3Z:V3FRE:AC.HI2NN4BJQHOBIXGHJSDDJ+-L4*4SC1T4OIBJ/OQC4IZP*MI.*17N.E$KA-43T65OCY4V5+EVODX1-XL-.3QXO+J62Y0*A1L/XE5:YWWVQ13UCVF1$ZPFFK$LNDS94B+ND:138MQW$:9YAUE7WON79ZT/FI/0YP5CB3SE-E30H$C85KD-EIXN5525*P59VA), and I hope to incorporate these into my [workshop](https://www.nime2024.org/programDetails.php?id=450) next week (‼️🔜‼️) at [NIME](https://www.nime2024.org/)!

# Future Work

My work on this project leaves several loose ends to follow. Indeed, there's plenty of room to continue exploring both technically and creatively.

From the original plan, the least-developed part of the project is experimentation with ML. Given more time, I'd like to train some networks to do typical tasks (à la "model zoos") to serve as examples of the utility of logic gate networks and for comparison with similarly-accurate neural networks. It would also be interesting try replicating some existing techniques (DDSP, variational autoencoders, even just convolutional networks) with logic gate networks.

As for integrations, future work could include unifying the wrappers with the PRU work so that the wrappers can run models in parallel with the audio thread on Bela. It would also be nice to further simplify the workflow of using a network for inference on Bela after training it on another (more powerful) machine.

My work with synthesis networks in the creative application has raised numerous questions. While I would still like to explore the possibility of logic gate networks for sound reconstruction (a direction which probably involves larger networks, `GroupSum`, and [MFCCs](https://en.wikipedia.org/wiki/Mel-frequency_cepstrum)), I find myself captivated by the sounds of tiny, binary-encoding networks. It could prove illuminating to go beyond intuition and take a more analytical approach in considering the inductive/musical biases of such networks. I am also curious about the potential of tiny logic networks as compact representations of existing musical content (either at the audio level or symbolic level).

Overall, the project could use a bit more polish; TODOs abound. The pace of the summer didn't leave much time for tying up one area of work before moving on to the next. I hope to find some time to tidy up and make the project more welcoming in the coming weeks (probably after NIME!).

# Conclusion

I've enjoyed getting my hands dirty with difflogic and Bela this summer, and I look forward to doing more work with both in the future. Lookng ahead, I hope to see others use and take inspiration from the work I've completed this summer.

To continue [a tradition]({{ site.baseurl }}{% post_url 2023-08-27-gsoc-faust %}#conclusion), here are a few remarks/bits of advice from my GSoC experience:
- Different host organizations have different expectations for contributions (in terms of proposal format, formal structure, communication methods, etc.).
- Scoping is (still) hard! Compared with my previous GSoC experience, I had less to do in terms of getting acquainted with existing codebases and old work, but a wider project scope overall.
- Now that I have an impressive sample size of two, I can conclude with certainty that GSoC is cursed: the end of the summer will *always* end up being more hectic than you expect, precisely when you need to focus on wrapping (and writing) things up.
- Demo videos are great! Do more of those.

Thanks to:
- Google for sponsoring another Summer of Code,
- BeagleBoard.org for hosting this funky project, providing hardware, and wrangling GSoC contributors,
- Bela for chipping in with additional hardware,
- my advisor, Jason Freeman, for his support and flexibility,
- my mentors, Jack Armitage and Chris Kiefer, for their support and many engaging conversations,
- their respective labs, the [Intelligent Instruments Lab](https://iil.is/) and [Emute Lab](http://www.emutelab.org/), for supporting their participation as mentors,
- and Felix Petersen for meeting with us and indulging our questions!

Finally, here are some links for this project:
- [Repository](https://openbeagle.org/gsoc/2024/embedded-difflogic/-/tree/main?ref_type=heads)
- [Proposal](https://gsoc.beagleboard.io/proposals/ijc.html)
- [Weekly Update Thread](https://forum.beagleboard.org/t/weekly-progress-report-differentiable-logic-for-interactive-systems-and-generative-music/38486)

<!-- TODO mention Jack & Chris's previous classification experiment somewhere? -->
