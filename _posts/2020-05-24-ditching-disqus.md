---
layout: post
title: "Ditching Disqus"
date: 2021-05-24 23:47:00 -0400
---

Today, I was looking in the Network tab of Chrome DevTools for a future post, when I noticed something concerning. I went to a text-only post to double-check and found the same thing:

[![DevTools with Disqus]({{ site.baseurl }}/images/devtools_disqus.png "What is all this crap?")]({{ site.baseurl }}/images/devtools_disqus.png)

wat

My immediate questions:
1. What is all this crap?
2. Why is it here?
3. How is my simple text post taking 1.6 MB of resources - with 149 kB transferred (despite my having just refreshed) over **117 requests**?

I didn't have any immediate answers to #1 or #3, but I had a good idea about #2. I went to my Jekyll post layout, commented out the bit that embeds Disqus, and sure enough:

[![DevTools without Disqus]({{ site.baseurl }}/images/devtools_clean.png "Ahh...")]({{ site.baseurl }}/images/devtools_clean.png)

I embedded Disqus in my posts when I first set up my little blog a few years ago, after looking around briefly for static site commenting solutions. I have scarcely thought of it since - until now. My discovery today was immediate grounds for dismissal. It even made my site feel slower when testing _locally_ (`jekyll serve`). The last thing I want to do to readers who take a chance on my words is make their browser fetch a bunch of junk and track them.

So, I'm ditching Disqus out of disqust;[^pun] by the time this post is up, it'll be gone.

[^pun]: I tried to resist and failed.

What to replace it with? My first thought was 'nothing': I have had some discussion about my articles in person and by email, but I have garnered a total of 0 comments through Disqus.

However, I looked around at static-site-commenting-solutions again and happily found [utterances](https://utteranc.es/), which is an open-source comments widget that uses GitHub issues for backing (and style). On a whim, I swapped the script tag into my layout and refreshed.

[![DevTools with Utterances]({{ site.baseurl }}/images/devtools_utterances.png "Not bad")]({{ site.baseurl }}/images/devtools_utterances.png)

Wow! The resources for my content---the reason the site exists in the first place---are _not_ vastly out-numbered and out-weighted by the resources for the comment widget at the bottom. Imagine that.

Even the design feels cleaner and less bloated:

[![Utterances]({{ site.baseurl }}/images/utterances.png "After")]({{ site.baseurl }}/images/utterances.png)
{: style="border: 1px solid black"}

vs.

[![Disqus]({{ site.baseurl }}/images/disqus.png "Before")]({{ site.baseurl }}/images/disqus.png)
{: style="border: 1px solid black"}

So, I'll try utterances for now. Maybe I'll end up deciding comments are overrated and strip it out, but in the meantime, it beats Disqus.

_**Postscript:** Looks like I'm [late to the party](https://www.google.com/search?q=%22ditching+disqus%22)! [This article](https://www.davidbcalhoun.com/2020/ditching-disqus-migrating-away-since-it-has-become-a-monster/) in particular has a nice GIF, in case you really want to **feel** like your site is being hijacked by a third-party widget._