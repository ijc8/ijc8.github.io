---
layout:    page
title:     Projects
permalink: /projects/
---

<a id="index"></a>
2021 · [2020](#2020-) · [2019](#2019-) · [2018](#2018-) · [2017](#2017-) · [2016](#2016-) · [2015](#2015-) · [and beyond](#projects-from-the-bc-before-college-era-)

# _2021_

## Paintwerk

For the 2021 [Moog Hackathon](https://guthman.gatech.edu/moog-hackathon), I created **Paintwerk**, a synth-doodling instrument. Paintwerk augments the [Moog Werkstatt](https://www.moogmusic.com/products/werkstatt-01-cv-expander), an analog synthesizer, with a drawing interface whereby you can sketch the curves for different synth parameters using a computer, phone, or tablet (anything with a reasonably modern web browser). Paintwerk plays through the [parameter curves](https://en.wikipedia.org/wiki/Mix_automation), virtually turning the knobs on the synthesizer by controlling voltages.

Players can paint the VCA, VCF, VCO, and LFO synth parameters, each of which is represented by a different color. They can also "mix" the colors to paint multiple parameters at once. Multiple people can draw on the same canvas at the same time from different devices. In addition to drawing curves, players can also play with the physical synth controls while Paintwerk loops through the drawing.

<iframe width="560" height="315" src="https://www.youtube.com/embed/aklhHWN1Uf8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>{: style="display: block; margin: auto"}

Paintwerk was awarded honorary mention as "Most Collaborative Instrument". After the competition, I exhibited the project at the [Guthman Fair](https://guthman.gatech.edu/Guthman-Fair-2021); you can see the poster, which gives some more details about Paintwerk and its implementation, below.

![Poster about Paintwerk]({{ site.baseurl }}/images/paintwerk.svg)

You can find the source code for Paintwerk [here](https://github.com/ijc8/paintwerk). Check out the other hackathon projects [here](https://guthman.gatech.edu/moog-hackathon)!

## Return True

A funky tune. [Listen here.](https://soundcloud.com/ijc8/return-true)

<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/983509225&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/ijc8" title="ijc" target="_blank" style="color: #cccccc; text-decoration: none;">ijc</a> · <a href="https://soundcloud.com/ijc8/return-true" title="Return True" target="_blank" style="color: #cccccc; text-decoration: none;">Return True</a></div>

# _2020_ [⬏](#index)

## kilobeat
In Spring 2020 at MIT, I built a little platform for low-level collaborative livecoding called `kilobeat`. Unlike most livecoding environments (but like the [bytebeat](http://canonical.org/~kragen/bytebeat/) practices that inspired it), players in kilobeat generate music by writing short expressions that generate audio samples directly (hence "low-level"). Everyone can see everyone else's code and activity, and players may copy or depend directly on each other's output. I originally created kilobeat for the course [SOUND: PAST & FUTURE](http://spf.media.mit.edu/) and the [MIT laptop ensemble (FaMLE)](https://musictech.mit.edu/MLE) in Spring 2020, but it lives on and continues to receive occasional fixes and enhancements.

You can read more about kilobeat [here]({% post_url 2020-5-21-kilobeat %}), play with it live [here]({{ site.baseurl }}/kilobeat), and check out the source code [here](https://github.com/ijc8/kilobeat).

![Screenshot of kilobeat]({{ site.baseurl }}/images/kilobeat.png)

## NotePad

In Spring 2020, Mergen Nachin and I took 6.835 (Intelligent Multimodal User Interfaces) and worked together on our final project, NotePad. NotePad is a system for multimodal music composition: the user can enter musical ideas into the system by writing them down (mouse/tablet input: drawing notes on musical staves) or by playing them (audio input: clapping a rhythm or singing a melody), and then can see (visual output: notes on staves) or hear (audio output: synthesizing the parts). For notation anslysis, we adapted the [$P point-cloud recognizer](https://depts.washington.edu/acelab/proj/dollar/pdollar.html) to recognize musical symbols from a small set of examples, after some trial and error with Kivy's multi-stroke gesture recognizer. For audio analysis, we used [Essentia](http://essentia.upf.edu/) for audio analysis. We used [Kivy](https://kivy.org) for graphical I/O and [pyAudio](https://people.csail.mit.edu/hubert/pyaudio/) + [FluidSynth](https://www.fluidsynth.org/) for audio I/O. You can find the NotePad source code [here](https://github.com/ijc8/notepad) and see the final demo below:

<iframe width="560" height="315" src="https://www.youtube.com/embed/4S_vnSqtDvA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>{: style="display: block; margin: auto"}

## Compositions

**Arrows** is a composition I wrote for the class [SOUND: PAST & FUTURE](http://spf.media.mit.edu/). It is inspired by Iannis Xenakis, particularly a remark from _[Formalized Music](https://monoskop.org/images/7/74/Xenakis_Iannis_Formalized_Music_Thought_and_Mathematics_in_Composition.pdf)_: "a composer may create the reversibility of the phenomena of masses, and, apparently, invert Eddington's 'arrow of time.'"

<iframe width="560" height="315" src="https://www.youtube.com/embed/WzsOeIe-S30" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>{: style="display: block; margin: auto"}

The process in _Arrows_ begins with a single, unwavering sine tone. It splits into two, with each descedant warped by a random affine transform that tweaks the tone's start and end times and frequencies. This bifurcation repeats with each tone in each generation. The tones proliferate and warp, and entropy increases. _Arrows_ runs this process forwards for several generations and waits until the last tones have died out; but it plays the process _backwards_, reversing the arrow of time for the listener and decreasing entropy as tones realign and unify, finally converging on their progenitor. I composed _Arrows_ as a Python program, generating the audio and video ([relevant post]({% post_url 2020-4-20-quick-audio-video-python %})) from the same random seed.

**Cluttered Desks** is a composition that Virgil B., Terrence G., and I wrote for MUSI 6003 (Music Technology History & Repertoire) at Georgia Tech. It is inspired by Paul Lansky's [Table's Clear](https://www.youtube.com/watch?v=xbmV4xXwsAI), and it is composed out of samples recorded from our living spaces and sythesized sounds.

<audio controls src="{{ site.baseurl }}/static/Cluttered_Desks.wav"></audio>{: style="display: block; margin: auto"}

## Reel Life

[Play with tape machines in your browser.](https://reel-life.github.io/)

Play, pause, speed up, slow down, wax on, wax off. Duplicate tapes for phasing fun. Play backwards to check for secret messages.

Starter tapes included, and you can record or upload your own!

[![Screenshot of Reel Life]({{ site.baseurl }}/images/reel_life.png)](https://reel-life.github.io/)

Group project with Nimita D., Mason M., and Tim M.

# _2019_ [⬏](#index)

## Fall Compositions

As of late, I've been playing with the incipient and fabulous [MIT Laptop Ensemble](https://mta.mit.edu/music/performance/mit-laptop-ensemble), a.k.a. FaMLE. It's been a great experience playing this weird and wonderful music with a dedicated group of musicians, and it has also presented some novel compositional opportunities.

This semester, I composed the piece Gloop I for the ensemble. This piece is built on the premise of recording, sharing, and remixing small sonic moments. Using an instrument I call the Glooper (for "group looper"), any ensemble member can use the laptop to record audio and have it instantly shared with the rest of the group. Anyone can then start playing it back, changing playback rate, position, or volume, and recording the output of that loop (including their live modifications) to a new loop.

A recording of the performance is available on [SoundCloud](https://soundcloud.com/ijc8/gloop-i).

<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/727163761&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>

I also composed a tune for the jazz combo I play with, called "Wideband". The lead sheet is available [here]({{ site.baseurl }}/static/Wideband.pdf). I'll post the recording here as soon as it's available.

## f(x): Multi-FX Processor

For my 6.115 final project, I built a multi-effects processor using the PSoC 5LP. This featured a waveform visualizer (effectively an audio-rate oscilloscope), a spectrum analyzer, and most importantly, a three-slot DSP chain with a variety of effects and parameters. The processor was controlled by touchscreen and several rotary encoders, and used the PSoC's built-in analog features to get samples in and audio. For performance, the effects were written in C using fixed-point arithmetic.

Here's a demo showing off the system (complete with attractive cardboard housing) and a few effects:
<iframe width="560" height="315" src="https://www.youtube.com/embed/VpB2HSXI5Eg" frameborder="0" allowfullscreen></iframe>{: style="display: block; margin: auto"}

## Musical Tetris

For Electronic Music Composition II, I implemented Tetris in Max/MSP, using the position of blocks as controls for a kind of sequencer. Doing this in Max was kind of tortuous, but it works! The top-level patch ended up looking something like this:

![Tetris in Max/MSP]({{ site.baseurl }}/images/tetris.png "it could be a lot messier")

Video pending a convenient opportunity to run this patch on someone else's machine; running Max under Linux is pretty painful.

# _2018_ [⬏](#index)

## SoundSpace
A project to connect sound and physical spaces, built during one wild weekend at [Hacking Arts](http://mithackingarts.com/) 2018 with Jasper K., Paul M., and Sean N. We used [LIDAR](https://en.wikipedia.org/wiki/Lidar) to detect the peoples' positions in a room and control musical parameters. We also used Google's Cloud Vision service to analyze the facial expression of a controller and change the mood of the music accordingly.

We built two demos to demonstrate our system's functionality:
1. Users stand along five radial lines from a circle; each can move closer or farther from the center to control the volume of a different stem (part) of a playing track in a DAW. Additionally, some tracks have different variants; the playing variant is determined by the emotion displayed by a user in front of a camera. This demo can be seen in the video below.
2. People stand around the LIDAR and move freely. Each person corresponds to a sustained note; as they move around the LIDAR, pitch changes smoothly, with distance from the LIDAR determining volume. This mapping allows for melody by individual motion, harmony by group motion, and enables a kind of physical voice-leading. (To avoid an abrupt transition when wrapping at 2π radians, I used [Shepard tones](https://en.wikipedia.org/wiki/Shepard_tone) for the sustained notes.)

<iframe width="560" height="315" src="https://www.youtube.com/embed/NCvj4RVfzuY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>{: style="display: block; margin: auto"}

Ultimately, our project [won 2nd place overall](http://mithackingarts.com/2018-hackathon-winners).

![SoundSpace team with novelty check]({{ site.baseurl }}/images/soundspace.jpg "The SoundSpace team, complete with big novelty check and 50% of us looking at the camera.")

## Compositions
During the summer between junior and senior year, I set myself the goal of putting together one song a week. Barring road trips, I met that goal.

The least embarassing results from these escapades follow:
- [We Put A Man On The Moon](https://soundcloud.com/ijc8/we-put-a-man-on-the-moon) (samples an old speech)
- [Shopping (without vocals)](https://soundcloud.com/ijc8/shopping-minus-vocals)
- [Run Don't Walk](https://soundcloud.com/ijc8/run-dont-walk)
- [Things Are Gonna Be Fine](https://soundcloud.com/ijc8/things-are-gonna-be-fine)
- [hello, world](https://soundcloud.com/ijc8/hello-world)
- [Limbo](https://soundcloud.com/ijc8/limbo)

(The rest can be found on SoundCloud.)

I also composed for Electronic Music Composition I. I think these are generally less embarassing, so I'll link them all here:
- [Your Call](https://soundcloud.com/ijc8/your-call) - made entirely from sounds recorded around campus
- [Improvisation 1 (Guitar & Bottle Cap)](https://soundcloud.com/ijc8/improvisation-1-guitar-bottle-cap)
- [Improvisation 2 (Slice)](https://soundcloud.com/ijc8/improvisation-2-slice)
- [Midi-worlds Interpretation](https://soundcloud.com/ijc8/midi-worlds-interpretation) - the same MIDI snippet played with increasingly esoteric instrument choices.
- [Modern Halloween (A Ghost)](https://soundcloud.com/ijc8/modern-halloween-a-ghost)
- [204](https://soundcloud.com/ijc8/sets/two-oh-four)

## TICS: The Interactive Composition System
A final project for Interactive Music Systems, developed in collaboration with Ini O. and Luke S. Our goal was to build a system that would allow a composer to specify some parts of a composition and fill in the rest automatically.

![TICS]({{ site.baseurl }}/images/tics.png "TICS in action.")

In order to contain the project scope, we decided to focus on tonal music, arranged in four voices (SATB). Essentially, our system:
- allowed the user to optionally enter data for any future beats, in any of four voices (SATB), along with harmony, rhythm, and spacing + dissonance preferences,
- picked a chord path (including modulations) to minimize cost based on the weights in the transition graphs, the user-specified notes/harmonies, and the dissonance settings,
- and finally picked voicings to minimize cost according to the rules of counterpoint (e.g. preferring smooth voice leading, avoiding parallel perfect intervals), user-specified notes, and the spacing settings (more closed vs. more open)

with the result that the system "filled in" any details (voices and harmonies) that the user didn't specify.

Our system supported MIDI keyboard and microphone as input methods (the latter via the "huMIDIfier" described below). We included "classical" and "jazz" chord graphs, optimizing progression choices by calculating the cost for all possible chord paths within a max lookahead. The ultimate choice of chord path and voicings was explicitly probabilistic (using softmax) to avoid excessive predictability.

## Interactive Music Systems
I don't usually include regular homework from classes here, but the problem sets in Interactive Music Systems allowed for some pretty fun and creative submissions, so I'll make an exception.

<iframe width="560" height="315" src="https://www.youtube.com/embed/jRwrGtsot1k" frameborder="0" allowfullscreen></iframe>{: style="display: block; margin: auto"}

The magic harp, unlike other psets, was controlled by a [Leap Motion](https://www.leapmotion.com/) controller, allowing the user to play a "magic harp" using all ten fingers. My submission included a variety of scales and harp configurations, both of which could be chosen via hand gestures.

<iframe width="560" height="315" src="https://www.youtube.com/embed/BRnzdoO2Z4s" frameborder="0" allowfullscreen></iframe>{: style="display: block; margin: auto"}

This was a keyboard-based clone of Guitar Hero's core gameplay. My submission was distinctive for its 3D projection of upcoming notes.

(My terrible performance in the video is, uh, definitely intentional. Yep, just showing off all the functionality...)

<iframe width="560" height="315" src="https://www.youtube.com/embed/FNQM-CpUR6U" frameborder="0" allowfullscreen></iframe>{: style="display: block; margin: auto"}

A mouse-controlled arpeggiator with some neat visuals and a few built-in chord progressions and basslines. It allowed the user to change the MIDI instrument for each part (lead, bass, and drums).

Other psets:
- [Graphics](https://www.youtube.com/watch?v=KL8tOKMOacg)
- [Sampling](https://www.youtube.com/watch?v=s5TYX3wSE-g)
- [Sine Synthesis](https://www.youtube.com/watch?v=iIIhC_2V4J4)


## huMIDIfier
A tiny utility for taking in audio input and generating MIDI output, developed
as a project for an IAP (January) course on signals & systems. Nothing too
fancy, but it allows doing things like entering notes into a score editor (e.g.
MuseScore) via non-MIDI instruments (e.g. electric guitar, acoustic piano).
Strictly monophonic.

# _2017_ [⬏](#index)

## Two Brothers
A game developed as a class project in 6.073 (Creating Video Games) in
collaboration with Victor L., Victor O., and Daniel B. Rest-assured that its
combination of AAA polish and indie charm will have it topping Steam charts in
no time, as will its touching and yet action-packed storyline. Made with Unity,
this game features local co-op, top-notch in-house voice acting and scoring,
various open game assets deftly located by Victor L., two thrilling levels plus
a boss fight, and a noble quest to save the realm from destruction.

![Two Brothers: Level 1]({{ site.baseurl }}/images/twobrothers_lvl1.png "two brothers, taking on hordes of the undead")
![Two Brothers: Level 2]({{ site.baseurl }}/images/twobrothers_lvl2.png "two brothers, fighting to save their home")
![Two Brothers: Boss]({{ site.baseurl }}/images/twobrothers_boss.png "two brothers, one big skeleton guy")

## Mafia Webapp
[Mafia](https://en.wikipedia.org/wiki/Mafia_(party_game)) is a fairly popular
party game. Live Action Mafia is a curious variant that takes place in real time
and space, rather than being condensed into the time and space suitable for,
well, a party game. A student group runs instances of live action mafia
regularly. Most of these games use [a standard set of
rules](https://github.com/jakob223/Mafia-rules), with only minor variations.
Every now and then, however, someone will run a "Mystery Mafia" game with a
_very different_ set of rules. I developed a webapp to facilitate running a
rather complex mystery mafia game devised and written by Adam K. Users could
take most actions through the webapp, greatly reducing the burden on the people
running the game (i.e. me and Adam). Some things were still done manually by the
GMs, of course, but the webapp handled the brunt of the requests by getting
(quite a lot of) information to players at the appropriate times.

Unlike the last few webapps mentioned on this page, I used Django rather than
Flask, which was awesome in that it handled storage nicely and had concepts such
as user and admin built-in (plus a sweet admin site).

Screenshot of a game "in-progress":

![Potato Action Mafia]({{ site.baseurl }}/images/potatoactionmafia.png "No potatoes :-(")

# _2016_ [⬏](#index)

## Karajan-MIT Classical Music Hackathon
A simple and modest score visualizer built during the Karajan-MIT Classical Music Hackathon, built in collaboration with Lisa K., Josie T., and Alice. Available [on GitHub](https://github.com/ijc8/karajan-mit).

![Score Visualizer]({{ site.baseurl }}/images/scorevisualizer.png "Makes marginally more sense with audio.")

## Sodatab
Freshman spring, I became one of my dorm's two soda chairs, responsible for
stocking and setting prices for our venerable old soda fridge. The following
summer, I set out to (hopefully) improve the soda fridge experience (for users,
desk workers, and, most importantly, soda chairs) by replacing the existing
(simple but functional) soda tab application used for tracking our patrons'
account balances with a shiny new one. The desired improvements were:
1. Displaying item prices in the webapp, and allowing them to be easily changed
   by soda chairs. The existing solution took the form of some pieces of paper
   with item prices taped up on the wall next to the desk worker. The deskworker
   would have to consult these (which were sometimes scratched through multiple
   times) or have prices memorized when charging users.
2. Keeping track of stock, so that chairs know when to order more soda without
   having to check the fridge manually, and users could know if their desired
   item was in stock before making the trip to desk.
3. Only allowing valid operations (e.g. you should never charge someone $0.31
   unless there's an item that costs that much).

The first and third of these actually happened and work pretty well. There's
undo functionality to allow desk workers to correct any mistakes, and there's no
longer any need to look up and/or memorize item prices manually. The second,
unfortunately, hasn't worked as well, due to a combination of deskworker and
soda chair error (e.g. charging someone for the wrong item, failing to update
quantity when restocking the fridge).

Sodatab recently gained Venmo integration, allowing users to add funds without
requiring cash, change, or deskworker intervention.

Screenshot (names redacted to protect the guilty):

![Sodatab]({{ site.baseurl }}/images/sodatab.png "Negative stock :'(")

## Pianobar Tracker
The summer before last, I often listened to Pandora via the lovely
[pianobar](https://6xq.net/pianobar/), and also frequently linked friends to
music I liked. Naturally, I was interested in automating this, and I was
delighted to find that pianobar offers straightforward support for scripting. So
I wrote a script to send a request to a site I set up whenever I liked something
on Pandora (via pianobar), and wrote a little webserver to handle the requests
and display songs I liked, with accompanying metadata. This can be seen in
action [here](https://ijc.scripts.mit.edu/pianobar.py/). Note that this isn't
very recent, though, as I've mostly switched to listening via Spotify.

Screenshot in case you don't feel like clicking the link:

![Screenshot of Pianobar Tracker in browser]({{ site.baseurl }}/images/pianobar.png "inb4 judgement for taste in music")


# _2015_ [⬏](#index)

## Speaker Project
As part of my freshman advising seminar, we built speaker projects on a budget
of $200. As part of the assignment, we had to have some design goal in mind, but
were given considerable freedom on the particular goal (and even more in
achieving it). You could try to make a really tiny speaker, or a really stylish
speaker, or a speaker with excellent frequency response. You could have multiple
speaker drivers involved, or just one.

For my project, I designed for features: not acoustic quality, but convenience +
coolness factor derived from electronics (which is where most of my budget
went). The final feature list:
- Real-time spectrum analyzer display. For this, I used the
  [MSGEQ7](https://www.sparkfun.com/products/10468) connected to an Arduino Uno,
  which in turn controlled 336 LEDs in the form of 14 [bar graph
  display](https://www.adafruit.com/product/459) (arranged in 2 rows of 7). In
  order to keep all of these lit, I used the magic of [shift
  registers](https://www.adafruit.com/product/450) and multiplexing to create
  the illusion of having the whole display powered at once. This probably was
  the most time-intensive (and definitely the most soldering-intensive) part of
  the project.
- Three stereo audio sources, and a DPDT switch for choosing between them.
  Options included aux input (via 3.5mm cable), bluetooth input, and music
  server input. The enclosure included a music server running
  [Mopidy](https://www.mopidy.com/) on a Raspberry Pi (with a wifi adapter).
- A [16x2 LCD character display](https://www.adafruit.com/product/181),
  controlled by the Raspberry Pi via GPIO. When the Pi was selected as the audio
  source, it would display information about the current track (name, artist,
  playing time) using a custom Mopidy extension and a Python script to control
  the LCD. On other inputs, it would simply display the input type ("Aux" or
  "Bluetooth"). Also, it displayed the server's IP on boot.

This was a pretty fun project, and a great way to spend some of my freshman fall
semester. I stayed up all night soldering leads through perfboard to create the
graphic display, and the morning of project presentations, I ran to Radioshack
last minute to pick up some relays to get source-switching to work properly.
Frankly, I knew rather little about electronics, and it's kind of a miracle that
it actually worked (especially that spectrum analyzer...).

That said, the other parts of the project were fairly neglected; it consisted of
a left- and right- midrange speaker, an amp, and an enclosure made of some
cardboard I had on hand.

Pictures: ![Startup screen with server IP]({{ site.baseurl }}/images/speaker1.jpg)
![Less-than-great picture of the visualizer and amp]({{ site.baseurl }}/images/speaker2.jpg)
!["Internals", including the wiring for the visualizer.
Yikes.]({{ site.baseurl }}/images/speaker3.jpg "Yikes.")



## Spook-o-meter
With the encouragement of a friendly upperclassman, I spent a fair amount of time freshman fall playing around in [my dorm](http://web.mit.edu/random-hall/www/)'s [EE lab](http://web.mit.edu/random-hall/www/places.shtml#ee). The first and possibly most glorious product to come out of this tinkering was a ~~Halloween prop~~ highly advanced piece of scientific equipment: the Spook-o-meter!

Simply power it on and point the antenna. The Spook-o-meter will first gather data, before settling on a final result - an accurate reading of paranormal activity in the area!

Pictures of this wondrous technology (regrettably low-quality because I took them using a potato):

![Spook-o-meter]({{ site.baseurl }}/images/spook-o-meter1.jpg "I ain't afraid of no ghosts.")

_In user-friendly text, displays "2 spooky 4 me". All measurements are in the SI unit of kilospooks._

![More spook-o-meter]({{ site.baseurl }}/images/spook-o-meter2.jpg "Highly. Qualified.")

_A highly-qualified paranormal researcher takes a reading._

### What's in the box?
![Spook-o-meter internals]({{ site.baseurl }}/images/spook-o-meter3.jpg "Only the most advanced components.")

![More spook-o-meter internals]({{ site.baseurl }}/images/spook-o-meter4.jpg "The cutting edge in paranormal engineering.")

Contents: An Arduino, two breadboards, two [seven-segment displays](https://en.wikipedia.org/wiki/Seven-segment_display), a big toggle switch, and a 9V battery. Rest assured that this represents the cutting-edge in paranormal engineering.

Additionally, the Spook-o-meter is built to last, and should be able to stand up to heavy use in the fields. For this reason, highly durable materials were used to construct the enclosure, such as Pop-Tart boxes and duct tape.

# _Projects from the B.C. (Before College) era:_ [⬏](#index)

## Polygonal Pong - Summer 2014
After junior year, I felt that I had lapsed in my programming activity, and set out to work on a project that would keep me busy for a while. The result was a game which I never really finished, or fully settled on a name for. (I felt "Polygonal Pong" was apt but too long, and found that "Polypong" was taken by a [game of the physical variety](http://www.polypong.com/). I ended up picking "PiNG", only to later realize [that was taken too](http://pingthegame.com/)).

Anyway, initially I just wanted to test out the relatively-new [SDL2 library](https://www.libsdl.org/). When I set out to learn a new piece of technology, be it a language, library, framework, or whatever else, I like to start by implementing something familiar to get a handle of things. In this case, I chose Pong. After getting that working quickly enough, I decided to just keep expanding on it by adding support for multiple players. I'd seen 3D pong variants that supported more players, but wanted to keep things 2D. My solution was to allow for polygonal fields with an arbitrary number of walls and goals.

Normally, Pong consists of two players (each with a "goal" behind them) and two walls, off of which the ball can bounce. I envisioned a variant with $$ n $$ players (each with one goal) and $$ m $$ bounceable walls per player, resulting in an $$n(m+1)$$-sided polygon. With $$ n=3,m=0 $$, for example, you would get triangle pong! $$ n=3,m=1 $$ would yield 3-player hexagon pong ("hexapong"?) and $$ n=6,m=0 $$ would result in 6-player hexagon pong.

Ultimately, I ended up with a game that supports arbitrary values of $$ n $$ and $$ m $$ as described above. $$ n $$ is effectively limited by how many players you can configure in the interface, but $$ m $$ has no such restriction. To prevent the playing field from getting too cramped (e.g. walls shorter than paddles), the sizes and velocities of the ball and paddles are scaled down when the number of sides gets too large. Nonetheless, this gets ridiculous pretty fast:

![PiNG with many walls]({{ site.baseurl }}/images/ping_absurd.png "n=8, m=3")

Also, scoring works as follows: whenever a player misses the ball, everyone else gets a point. If the ball goes into the intersection between two goals (possible when $$ m = 0 $$), neither of the two associated players gets a point (all the other players do).

Other features:
- An actual interface! Most of my experiments in making games prior to PiNG didn't offer such high-falutin' porcelain as "menus" or "buttons". This one did, and even included such polish as:
  - Menu items that change color as you hover over them!
  - A full interface for configuring a game, allowing you to customize each player and set keybindings for humans, or difficulty for AIs.
  - You know how some games have a preview going on in the background of the start screen? I wanted something like that, so a full-AI game (with a random number of players and sides) unobstrusively plays itself in the background of the start menu.
- Speaking of which, the game offers three levels of AI difficulty, with the most sophisticated simulating the ball's motion well in advance to determine where it should move the paddle.
- I also implemented a little developer console which was occasionally useful when testing.

Collision detection and resolution briefly became the bane of my experience; this is trivial in ordinary pong, since it consists of just 3 AABBs, but for this project I had to read up on the [Separating-Axis Theorem](https://gamedevelopment.tutsplus.com/tutorials/collision-detection-using-the-separating-axis-theorem--gamedev-169). I also had to iron out a lot of weird bugs with collision resolution and "phasing" (when the ball is going fast enough to skip past obstacles in a single timestep), which was made more difficult due to my lack of exposure to vector math (or linear algebra in general).

Alas, summer eventually came to an end, as did my efforts on this project. Features that I never got around to implementing include:
- Decent networking. I started on this, but didn't end up with something satisfying.
- Win conditions. I left this as an exercise for the players.
- The "Tutorial" and "Credits" menu buttons.

The project is on Github [here](https://github.com/ijc8/ping).

Have some more screenshots:

![PiNG main menu]({{ site.baseurl }}/images/ping_menu.png "Hey, there's a game in the background!")

![PiNG game setup]({{ site.baseurl }}/images/ping_setup.png "Featuring hand-made retro-minimalist organically-grown locally-sourced GUI elements.")

![PiNG with three players]({{ site.baseurl }}/images/ping_triangle.png "n=3, m=0")

![PiNG with five players]({{ site.baseurl }}/images/ping_pentagon.png "n=5, m=0")

![PiNG with three players, with one bouncy wall per player]({{ site.baseurl }}/images/ping_hexagon.png "n=3, m=1")

![PiNG classic mode]({{ site.baseurl }}/images/ping_classic.png "Classic Mode: Because sometimes you just want to play Pong.")

## DCPU-16 Assembler & Emulator - Summer 2012
In the summer after my freshman year of high school, I spent a fraction of my copious free time writing an assembler and emulator for the [DCPU-16](https://gist.github.com/metaphox/3888117), a fictional 16-bit CPU devised by Notch (of Minecraft fame) for the ill-fated (maybe someday!) game [0x10c](https://en.wikipedia.org/wiki/0x10c).

The emulator faithfully implements the spec for the CPU and a few peripherals. There wasn't really a standard assembler syntax, but I aimed for rough compatbility with the popular assemblers at the time. The parser was hand-rolled and not terribly sophisticated, but it worked well enough for running programs I found on the Internet.

Other notable features:
- The monitor lists for changes in relevant areas of DCPU memory and draws areas that change, rather than redrawing everything every frame.
- Supports an integrated assembler + emulator mode which shows various register values as they update.
- The assembler and emulator can be used a separate command line tools; the assembler outputs instructions in hex, which can be piped directly into the emulator.
- When the emulator is run standalone, it only creates a window (needed for the monitor and keyboard peripherals) when and if it has to.

Video of the project in action (and me being bad at snake):
<iframe width="560" height="315" src="https://www.youtube.com/embed/t4n3NFtjXWI" frameborder="0" allowfullscreen></iframe>{: style="display: block; margin: auto"}

It's available on Github [here](https://github.com/ijc8/DCPU-16).

This project was the source of my very first pull request. :-)
