---
layout:    page
title:     Research
permalink: /research/
---

# Publications

**Distributing Generative Music With Alternator** --- [JAES Volume 71 Issue 11 (Nov. 2023)](https://www.aes.org/journal/online/JAES_V71/11/)  
_**Ian Clester**, Jason Freeman_ --- [pdf](https://doi.org/10.17743/jaes.2022.0113)

**Hack the Show: Design and Analysis of Three Interaction Modes for Audience Participation** --- [JAES Volume 71 Issue 11 (Nov. 2023)](https://www.aes.org/journal/online/JAES_V71/11/)  
_Matthias Jung, **Ian Clester**_ --- [pdf](https://doi.org/10.17743/jaes.2022.0111)

**Flexible Instruction-Set Semantics via Abstract Monads** --- [ICFP 2023](https://icfp23.sigplan.org/)  
_Thomas Bourgeat, **Ian Clester**, Andres Erbsen, Samuel Gruetter, Pratap Singh, Andy Wright, Adam Chlipala_ --- [pdf](https://dl.acm.org/doi/pdf/10.1145/3607833), [video](https://www.youtube.com/watch?v=l2O15JJauFs)

**LambDAW: Towards a Generative Audio Workstation** --- [ICLC 2023](https://iclc.toplap.org/2023/)  
_**Ian Clester**, Jason Freeman_ --- [pdf](https://doi.org/10.5281/zenodo.7842002), [video](https://www.youtube.com/watch?v=_Z71KQtWpMk&t=1270s)

**Composing with Generative Systems in the Digital Audio Workstation** --- [MILC 2023](https://milc2023.github.io/)  
_**Ian Clester**, Jason Freeman_ --- [pdf](https://ceur-ws.org/Vol-3359/paper15.pdf), [demo](https://www.youtube.com/watch?v=5VU-ora7Wx0)

**Computer-Assisted Measure Detection in a Music Score-Following Application** --- [WoRMS 2022](https://sites.google.com/view/worms2022/)  
_Eran Egozy, **Ian Clester**_ --- [pdf](/static/concertcue-omr.pdf), [video](https://www.youtube.com/watch?v=RHWaLZz3wwI)

**Alternator: A General-Purpose Generative Music Player** --- [WAC 2022](https://wac2022.i3s.univ-cotedazur.fr/) --- Best Paper Award  
_**Ian Clester**, Jason Freeman_ --- [pdf](https://doi.org/10.5281/zenodo.6767436), [video](https://www.youtube.com/watch?v=ceSlGrpMINA)

**Composing the Network with Streams** --- [AM 2021](https://audiomostly.com/2021/) --- IWIS Best Poster Award  
_**Ian Clester**, Jason Freeman_ --- [pdf](/static/composing-the-network-with-streams.pdf), [video](https://www.youtube.com/watch?v=F2V-n4nsLgM)

**kilobeat: low-level collaborative livecoding** --- [WAC 2021](https://webaudioconf2021.com/)  
_**Ian Clester**_ --- [pdf](https://webaudioconf2021.com/wp-content/uploads/2021/06/kilobeat.pdf), [video](https://youtu.be/0QaM5xgTfEM)

**Robotic Grasping of Fully-Occluded Objects using RF Perception** --- [ICRA 2021](https://www.ieee-icra.org/)  
_Tara Boroushaki, Junshan Leng, **Ian Clester**, Alberto Rodriguez, Fadel Adib_ --- [pdf](https://arxiv.org/pdf/2012.15436.pdf), [video](https://www.youtube.com/watch?v=ZAzeYPcTM78)

# Projects

<!--
## Alternator
TODO

## Aleatora
TODO
-->

## EarSketch
[EarSketch](https://gtcmt.gatech.edu/earsketch) is a platform for making music with code. By providing a free, web-based environment with a large sample library and an introductory CS curriculum, it aims to empower students to create music and write programs for themselves using Python or JavaScript. I develop EarSketch in the [Computational Music for All](https://gtcmt.gatech.edu/computational-music-for-all) lab under [Jason Freeman](https://distributedmusic.gatech.edu/jason/); my work has included overhauling much of the interface and implementation of EarSketch during the move from Angular 1 to React and from JS to TypeScript. Try it out [here](https://earsketch.gatech.edu/earsketch2)!

![]({{ site.baseurl }}/images/earsketch.png "EarSketch")

## BackTrack
BackTrack (Backscatter Tracker) is a system for RFID localization I developed in the [Signal Kinetics](https://www.media.mit.edu/groups/signal-kinetics/overview/) group under [Fadel Adib](https://www.mit.edu/~fadel/), building on the lab's work on [RFind](https://www.media.mit.edu/projects/rfid-localization/overview/) and [TurboTrack](https://www.media.mit.edu/projects/turbotrack-3d-backscatter-localization-for-fine-grained/overview/). RFID tags are normally used to determine the identity of people and goods, but this system enables determining their position in space as well. RFID tags are particularly useful as localization targets due to their low cost, ubiquity, and battery-free operation. I built a frequency-hopping system that provided higher framerates while requiring lower sampling rates, compared to prior systems, with the goal of exploring and enhancing the feasibility of RFID localization as an input for interactive applications.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ig7wVQ9mWcU?cc_load_policy=1" frameborder="0" allowfullscreen></iframe>{: style="display: block; margin: auto"}

## ConcertCue
ConcertCue is a system for streaming synchronized program notes during a live musical performance, with the goal of enriching the concert-going experience with text and images designed to aid in musical appreciation and understanding. I worked on this project with Professor [Eran Egozy](https://mta.mit.edu/person/eran-egozy) and Diane Zhou throughout the 2018-2019 academic year.

Among other things, this work involved making improvements to the Director (the interface used by the human operator to keep ConcertCue in sync with the live performance) and doing the work necessary to operate ConcertCue at a few concerts with the [BSO](https://www.bso.org/) (and [one concert all the way over at Michigan Tech!](https://events.mtu.edu/event/new_music_for_a_new_year_music_of_the_up)).

Notable features I worked on include the ability to determine the visual locations of measures in sheet music (and to highlight the current measure on the page when operating the Director) and initial work on automatic performance synchronization via real-time [dynamic time warping](https://en.wikipedia.org/wiki/Dynamic_time_warping).

The project code isn't currently publicly available, but the web application can be found [here](http://concertcue.com/), and more information can be found [here](https://musictech.mit.edu/concertcue).

![]({{ site.baseurl }}/images/concertcue.jpg "ConcertCue in action")

## RISC-V Formal Semantics
RISC-V is an open instruction set architecture designed to be practical. Basically, it's a cool open standard that also aims for practicality and extensibility.

From Spring 2017 through IAP 2019, I worked with Professor [Adam Chlipala](http://adam.chlipala.net) and [Thomas Bourgeat](https://people.csail.mit.edu/bthom/) to develop a formal, friendly, and
runnable RISC-V specification. The idea is to clearly define the correct
behavior from RISC-V in a format that is both human-readable and
machine-readable. At present, this is in the form of an emulator written in
Haskell. This project is available [on
GitHub](https://github.com/mit-plv/riscv-semantics)!

![]({{ site.baseurl }}/images/diagram.svg "Architectural Diagram")
