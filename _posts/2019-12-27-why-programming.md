---
layout: post
title: "Why Programming?"
date: 2019-12-27 17:10:00 -0500

---

With the benefit of hindsight: because it's fun, interesting, and absurdly useful.

The real reason, from when I started: because it's fun and amazingly accessible.

## Accessibility

When I was a kid, I spent a lot of time goofing around on my dad's computer, until he finally got fed up with my little experiments with the many available settings and bought me my own computer for my birthday. Without a doubt, I was very lucky to have parents that encouraged my interests and who could afford to buy me my own computer. But one cool thing with computing --- and the whole gist of the personal computing revolution --- is that over time less and less luck has been required to have that kind of opportunity. 

When my dad bought me that computer, it probably cost around $500.[^1] Today, a [Raspberry Pi](https://www.raspberrypi.org/) is more powerful and costs $35.[^2] What's more --- and this is crucial --- doing programming *doesn't cost anything extra*. To build more contraptions with an erector set or LEGOs, you either tear your old work apart, or you need more pieces. With chemistry or electronics (beyond breadboarding), it's even worse, as each experiment or creation will typically consume a resource that you can't readily get back.

But programming just involves manipulating information. Generally, you don't need to buy more bits, and memory is dirt cheap. Once you have the program written, it is trivial to modify, copy, and share. 

Think of it this way: it costs a lot of money to build a real bridge. Aside from the design work, it just takes a lot of physical resources. And if you want to build the same bridge somewhere else, it takes the same amount of resources, again. The upfront cost is huge, and as a result a kid can't build a bridge. She wouldn't have the resources, and, being a kid without any kind of architectural qualifications, nobody would trust her with those resources.

By contrast, it costs nothing to "build" a program. It can, of course, cost a great deal of time to design a program, in the same sense that it costs to design the bridge. But unlike the bridge, there's no separate phase of moving the program from design to reality.[^3] The design is the reality. The end product is just information, as is the design itself. Once you've written a program, you have the program. Once you've designed a bridge, you have the blueprint, but you're a long way from having the bridge. In programming, the blueprint *is* the bridge.

So a kid can't feasibly build a real bridge, but she certainly can write a real program. And she can write another one, and another one, and all it will cost her is free time, and in exchange she will gradually gain expertise. And that's a large part of why programming is so accessible.

## Fun

Another, related aspect of its accessibility is the immediate gratification. As it turns out, it's really easy to get your computer to "talk to you" by printing out "Hello, world!". It might not be the _most_ exciting thing in the world, but it's still actually pretty neat. With just a little more effort you can get it to greet you by your name, and with just a _little more_ you can get it to play a game with you. This is honestly incredible.[^4] I've been programming for over a decade now, and when I stop to think about it, I still find it incredible. With just a tiny bit of code, you can get your computer to do all kinds of things that aren't built-in --- that someone else didn't have to tell it to do for you. And that's awesome. That's power, and that's [freedom]({{ site.baseurl }}{% post_url 2019-10-01-knowledge-and-freedom %}).[^5]

And that was enough to get me hooked. Judging by the push for CS education, the growth of the maker movement, and the continued rise of open-source and the emergence of platforms like GitHub, it's enough to get a lot of other people hooked too.[^6]

## Interest and Closure

As for why I still think it's a worthwhile interest, after dumping a whole lot of time into it: It's a formal way to express ideas, and at the end of the day it's runnable. Programming reifies abstract notions into a formal language that a compiler translates into machine code which you can then run on a real machine. This runnability comes at a cost, which is the exacting nature of computers and the precision of thought and expression required from the programmer. At the same time, it offers the promise of perfect expressivity, enabling any thought to be expressed in the way most suited to it.

On the one hand, computers are harsh and dumb and frustrating. They will not make the small leaps in logic that you didn't bother writing out because they were obvious. They do not care how certain you are that your syntax is valid, that your types should check, or that your program is correct. They will simply tell you the hard truth, and they demand the same from you: no gaps, no leaps, no hand-waving. A computer will force you to explain what you want precisely, completely, and in painstaking detail before it will do it.

On the other hand, programming offers the opportunity to build new abstractions for your own benefit, to make the task of explaining easier. For example, most programming languages allow defining new data types and reusable functions and modules to operate on them. What's more, you can even build your own language; after all, a compiler itself is just another program, built by humans for humans. A programming language, as realized by its implementation in a compiler or interpreter, can allow you to express yourself is new ways, and you can build a new one to support exactly your preferred means of expressing intent. At the end of the day, your intentions must be totally unambiguous --- but they can be expressed as loftily as you like.

Thus, if you're frustrated by how tedium of any task you encounter in the course of programming, the very same discipline offers you the prospect of eliminating that tedium --- if you can think of the right way to do it. And this is how we went from machine code to assembly language to C and beyond. This is where we get fancy text editors, compilers, linters, test suites, and the myriad of other programming tools. The way to solve a problem with the act of programming _is by programming_ your own solution.

This contrasts greatly with other fields. If you are trained in the art of digging holes with a shovel, and find the work tedious and time-consuming, your expertise does not offer you any means of improving the work. You can get better at digging with the shovel, but you can only get so good at it; bigger improvements --- the kind that change the nature of the work itself --- require the aid of other fields, e.g., by getting mechanical engineers to build a [hydraulic excavator](https://en.wikipedia.org/wiki/Excavator). Improving the work requires knowledge outside of the domain of the work. Similarly, writing benefits from but cannot create better word processors, and graphic design benefits from but cannot create create better image editors. These fields are not [closed](https://en.wikipedia.org/wiki/Closure_(mathematics)) under tool-improvement. Programming is one of the rare fields that is; part of the interest of programming is that it is _closed_ under tool-improvement.

![Shovel vs. Excavator]({{ site.baseurl }}/images/tools.jpg "The importance of tools.")
*Image credits: [Sustainable Sanitation Alliance](https://www.flickr.com/photos/23116228@N07/4834074716) and [Elmer Romero](https://pixabay.com/photos/digging-a-hole-construction-1692944/)*
{: style="text-align: center; font-size: smaller"}

Beyond that, many fields gain this kind of closure when augmented with programming. Knowing a little coding enables automating many trivial (but time-consuming) tasks in other fields, relegating things like [web scraping](https://www.crummy.com/software/BeautifulSoup/) and [routine tasks](https://en.wikipedia.org/wiki/Cron) to scripts. Knowing some more lets you go much further, potentially enabling new kinds of work in other fields (see: livecoding in music, CGI and 3D animation in film, or  [logic synthesis](https://en.wikipedia.org/wiki/Logic_synthesis) in electronics).

For all of these reasons and more, I value the freedom I gain from my knowledge of programming immensely. I am not at the mercy of other software developers and their software, and if I really want something done, I have the freedom to, as the saying goes, "shut up and hack" on it myself.


[^1]: [Source](https://www.cnet.com/reviews/compaq-presario-sr1600nx-review/).

[^2]: This excludes the cost of the monitor/keyboard/etc., but you could probably beat my old setup for under $100 total.

[^3]: Caveat: there almost always *is* a separate design phase, at least for multi-person projects, but this corresponds to the design phase in architecture that occurs *prior* to any drafting. The point being that, when you finish drawing a schematic, you're not any closer to physically having a bridge; whereas, when you finish writing a program, you have the program! (This analogy improves with higher-level programming languages.)

[^4]: And it's even better when you throw in some LEDs and buttons.

[^5]: This post began life as a tangent in an early draft of [that post]({{ site.baseurl }}{% post_url 2019-10-01-knowledge-and-freedom %}).

[^6]: Not the mention the popularity of course 6-3 at MIT, which [has grown](https://registrar.mit.edu/statistics-reports/enrollment-statistics-year) from under 8% of declared undergraduate majors to over 20% in the last decade.

