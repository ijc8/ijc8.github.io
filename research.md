---
layout:    page
title:     Research
permalink: /research/
---

ConcertCue
---
ConcertCue is a system for streaming synchronized program notes during a live musical performance, with the goal of enriching the concert-going experience with text and images designed to aid in musical appreciation and understanding. I worked on this project with Professor [Eran Egozy](https://mta.mit.edu/person/eran-egozy) and Diane Zhou throughout the 2018-2019 academic year.

Among other things, this work involved making improvements to the Director (the interface used by the human operator to keep ConcertCue in sync with the live performance) and doing the work necessary to operate ConcertCue at a few concerts with the [BSO](https://www.bso.org/) (and [one concert all the way over at Michigan Tech!](https://events.mtu.edu/event/new_music_for_a_new_year_music_of_the_up)).

Notable features I worked on include the ability to determine the visual locations of measures in sheet music (and to highlight the current measure on the page when operating the Director) and initial work on automatic performance synchronization via real-time [dynamic time warping](https://en.wikipedia.org/wiki/Dynamic_time_warping).

The project code isn't currently publicly available, but the web application can be found [here](http://concertcue.com/), and more information can be found [here](https://musictech.mit.edu/concertcue).

![]({{ site.baseurl }}/images/concertcue.jpg "ConcertCue in action")

RISC-V Formal Semantics
---
RISC-V is an open instruction set architecture designed to be practical. Basically, it's a cool open standard that also aims for practicality and extensibility.

From Spring 2017 through IAP 2019, I worked with Professor [Adam Chlipala](http://adam.chlipala.net) and [Thomas Bourgeat](http://www.csail.mit.edu/user/3875) to develop a formal, friendly, and
runnable RISC-V specification. The idea is to clearly define the correct
behavior from RISC-V in a format that is both human-readable and
machine-readable. At present, this is in the form of an emulator written in
Haskell. This project is available [on
GitHub](https://github.com/mit-plv/riscv-semantics)!

![]({{ site.baseurl }}/images/diagram.svg "Architectural Diagram")
