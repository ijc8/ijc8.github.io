---
layout:    page
title:     Projects
permalink: /projects/
---

# _2017_

## Two Brothers
A game developed for 6.073 (Creating Video Games) in collaboration with Victor
L., Victor O., and Daniel B. Rest-assured that its combination of AAA polish and
indie charm will have it topping Steam charts in no time, as will its touching
and yet action-packed storyline. Made with Unity, and various open game assets
deftly located by Victor L.

Screenshots and link pending.

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

# _2016_

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


# _2015_

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

Pictures of this wondruous technology (regrettably low-quality because I took them using a potato):

![Spook-o-meter]({{ site.baseurl }}/images/spook-o-meter1.jpg "I ain't afraid of no ghosts.")

_In user-friendly text, displays "2 spooky 4 me". All measurements are in the SI unit of kilospooks._

![More spook-o-meter]({{ site.baseurl }}/images/spook-o-meter2.jpg "Highly. Qualified.")

_A highly-qualified paranormal research takes a reading._

### What's in the box?
![Spook-o-meter internals]({{ site.baseurl }}/images/spook-o-meter3.jpg "Only the most advanced components.")

![More spook-o-meter internals]({{ site.baseurl }}/images/spook-o-meter4.jpg "The cutting edge in paranormal engineering.")

Contents: An Arduino, two breadboards, two [seven-segment displays](https://en.wikipedia.org/wiki/Seven-segment_display), a big toggle switch, and a 9V battery. Rest assured that this represents the cutting-edge in paranormal engineering.

Additionally, the Spook-o-meter is built to last, and should be able to stand up to heavy use in the fields. For this reason, highly durable materials were used to construct the enclosure, such as Pop-Tart boxes and duct tape.

# _Projects from the B.C. (Before College) era:_

## Polygonal Pong - Summer 2014
After junior year, I felt that I had lapsed in my programming activity, and set out to work on a project that would keep me busy for a while. The result was a game which I never really finished, or fully settled on a name for. (I felt "Polygonal Pong" was apt but too long, and found that "Polypong" was taken by a [game of the physical variety](http://www.polypong.com/). I ended up picking "PiNG", only to later realize [that was taken too](http://pingthegame.com/)).

Anyway, initially I just wanted to test out the relatively-new [SDL2 library](https://www.libsdl.org/). When I set out to learn a new piece of technology, be it a language, library, framework, or whatever else, I like to start by implementing something familiar to get a handle of things. In this case, I chose Pong. After getting that working quickly enough, I decided to just keep expanding on it by adding support for multiple players. I'd seen 3D pong variants that supported more players, but wanted to keep things 2D. My solution was to allow for polygonal fields with an arbitrary number of walls and goals.

Normally, Pong consists of two players (each with a "goal" behind them) and two walls, off of which the ball can bounce. I envisioned a variant with $$ n $$ players (each with one goal) and $$ m $$ bounceable walls per player, resulting in an $$n(m+1)$$-sided polygon. With $$ n=3,m=0 $$, for example, you would get triangle pong! $$ n=3,m=1 $$ would yield 3-player hexagon pong ("hexapong"?) and $$ n=6,m=0 $$ would result in 6-player hexagon pong.

Ultimately, I ended up with a game that supports arbitrary values of $$ n $$ and $$ m $$ as described above. $$ n $$ is effectively limited by how many players you can configure in the interface, but $$ m $$ has no such restriction. To prevent the playing field from getting too cramped (e.g. walls shorter than paddles), the sizes and velocities of the ball and paddles are scaled down when the number of sides gets too large. Nonetheless, this gets ridiculous pretty fast:

![PiNG with many walls]({{ site.baseurl }}/images/ping_absurd.png "n=8, m=3")

Also, scoring works as follows: whenever a player misses the ball, everyone else gets a point. If the ball goes into the intersection between two goals (possible when $$ m = 0 $$), neither of the two associated players gets a point (all the other players do).

Other features:
- An actual interface! Most of my experiments in making games prior to PiNG didn't offer such high-falutin' porcelain as "menus" or "buttons". This one did, and even included such polish as:
-- Menu items that change color as you hover over them!
-- A full interface for configuring a game, allowing you to customize each player and set keybindings for humans, or difficulty for AIs.
-- You know how some games have a preview going on in the background of the start screen? I wanted something like that, so a full-AI game (with a random number of players and sides) unobstrusively plays itself in the background of the start menu.
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
<iframe width="560" height="315" src="https://www.youtube.com/embed/t4n3NFtjXWI" frameborder="0" allowfullscreen></iframe>

It's available on Github [here](https://github.com/ijc8/DCPU-16).

This project was the source of my very first pull request. :-)
