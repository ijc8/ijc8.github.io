---
layout: post
title: "Unix Utility of the Day: xxd"
date: 2018-08-01 22:04:00 -0700
---
I'm going to finally try out something mentioned in my [first entry]({{ site.baseurl }}{% post_url 2017-09-02-initial-commit %}): a shorter post. Specifically, I'd like to take a second to introduce to a handy little tool that I've found myself using a lot lately: `xxd`!

`xxd` is a hexdump utility (much like the more-aptly-named `hexdump`). With no flags, it behaves pretty much like `hexdump -C` (or `hd`):
<div class="highlighter-rouge"><div class="highlight"><pre class="highlight"><code>$ <b>xxd sample.wav</b>
00000000: 5249 4646 8d02 0100 5741 5645 666d 7420  RIFF....WAVEfmt 
00000010: 1000 0000 0100 0100 44ac 0000 cc04 0200  ........D.......
00000020: 0300 1800 6461 7461 6902 0100 9c2d 0014  ....datai....-..
00000030: 76ff a7ee ff53 e3ff 943d ffdb 0601 3e9a  v....S...=....>.
00000040: 0164 bbff b423 ff43 33ff ba17 0038 5300  .d...#.C3....8S.
00000050: aa84 0037 fa02 f763 0072 0af8 4e44 0059  ...7...c.r..ND.Y
...
</code></pre></div></div>
However, `xxd` has several neat options lacking in other hexdump tools.

xxd -p
------
Plain mode. Just dumps hex continuously, byte-by-byte, with no fancy formatting. (Still includes newlines; pipe into `tr -d '\n'` to remove.)

<div class="highlighter-rouge"><div class="highlight"><pre class="highlight"><code>$ <b>xxd -p sample.wav</b>
524946468d02010057415645666d7420100000000100010044ac0000cc04
02000300180064617461690201009c2d001476ffa7eeff53e3ff943dffdb
06013e9a0164bbffb423ff4333ffba1700385300aa840037fa02f7630072
0af84e440059...
</code></pre></div></div>

Fun facts:
- Has aliases `-plain`, as well as `-ps` and `-postscript` (because you can use this to embed data in a postscript file in-line).
- You can do the same thing with `hexdump -ve '1/1 "%.2x"'`.

xxd -r
------
Reverse mode! Converts a hexdump back into the original bytes. Combine with `-p` to convert plain hex to bytes.

<div class="highlighter-rouge"><div class="highlight"><pre class="highlight"><code><b>$ echo '00000000: 6865 6c6c 6f20 776f 726c 640a' | xxd -r</b>
hello world
</code></pre></div></div>

<div class="highlighter-rouge"><div class="highlight"><pre class="highlight"><code><b>$ echo '68656c6c6f20776f726c640a' | xxd -r -p</b>
hello world
</code></pre></div></div>

xxd -i
------
Last but not least, include mode. Outputs valid C suitable for dumping in a header file ([XBM](https://en.wikipedia.org/wiki/X_BitMap)-style), for when you want to include a blob in your program but don't want to/can't open it from a filesystem (for example, some embedded contexts).
<div class="highlighter-rouge"><div class="highlight"><pre class="highlight"><code>$ <b>xxd -i sample.wav</b>
unsigned char sample_wav[] = {
  0x52, 0x49, 0x46, 0x46, 0x8d, 0x02, 0x01, 0x00, 0x57, 0x41, 0x56, 0x45,
  0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
  0x44, 0xac, 0x00, 0x00, 0xcc, 0x04, 0x02, 0x00, 0x03, 0x00, 0x18, 0x00,
  0x64, 0x61, 0x74, 0x61, 0x69, 0x02, 0x01, 0x00, 0x9c, 0x2d, 0x00, 0x14,
  0x76, 0xff, 0xa7, 0xee, 0xff, 0x53, 0xe3, 0xff, 0x94, 0x3d, 0xff, 0xdb,
  0x06, 0x01, 0x3e, 0x9a, 0x01, 0x64, 0xbb, 0xff, 0xb4, 0x23, 0xff, 0x43,
  0x33, 0xff, 0xba, 0x17, 0x00, 0x38, 0x53, 0x00, 0xaa, 0x84, 0x00, 0x37,
  0xfa, 0x02, 0xf7, 0x63, 0x00, 0x72, 0x0a, 0xf8, 0x4e, 0x44, 0x00, 0x59,
...
  0x00, 0x00, 0x4d, 0x01, 0x00, 0x61, 0x01, 0x00, 0x19, 0x01, 0x00, 0x95,
  0x01, 0x00, 0x92, 0x01, 0x00, 0xd0, 0x02, 0x00, 0xa0, 0x01, 0x00, 0x38,
  0x01, 0x00, 0x00, 0x00, 0x00
};
unsigned int sample_wav_len = 66197;
</code></pre></div></div>

Note that this *can't* be combined with the previous two options. `xxd -r -i`
results in an apologetic error. If both `-p` and `-i` appear, whichever appears
later takes precedence.
