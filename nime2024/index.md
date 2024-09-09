---
layout:    scorecard-workshop
title:     ScoreCard Workshop
permalink: /nime2024/
---

Welcome, dear participants, to _Process Pieces as Paper Programs_!

Before we begin, here are some handy links that you might want to refer back to over the course of the workshop:
- [Intro Slides](slides)
- [Player](/s)
- [Creator](/scorecard-creator)
- [Examples](https://github.com/ijc8/scorecard/tree/main/examples)
- [ScoreCard Paper (WAC 2024)](https://ijc8.me/static/scorecard.pdf)

# Schedule

This is a half-day workshop (14:30-18:30), and we'll be following this rough schedule (which may be adjusted as needed):
- 14:30-15:00: Introduction to ScoreCard
- 15:00-16:00: Hands-on tutorial (guided examples of increasing complexity)
- 16:00-16:15: Break
- 16:15-16:30: Card Tricks (Forbidden Techniques)
- 16:30-18:00: Create Your Own Cards!
- 18:00-18:30: Trading Cards

# Introduction to ScoreCard

In this segment, I'll talk about a bit about what ScoreCard is and what you can do with it!

I will be presenting with [these slides](slides), if you'd like to follow along on.

# Hands-on Tutorial

Now that you know a bit about ScoreCard, let's see how we can create our own. We'll work through several examples of increasingly complexity.

<!-- ## Teaser

Just to give you a sense of what we can do in under 3KB, here's a relatively complex ScoreCard. We'll work our way up to this!

TODO -->

## Creating ScoreCards

In order to create a scorecard, we need to produce a WebAssembly (Wasm) binary that can generate audio samples.

This requires a compiler toolchain capable of targeting Wasm, such as clang (possibly wrapped by [Emscripten](https://emscripten.org/)). But, to save you the hassle of installing this on your machine during this workshop, you can instead use the web-based [ScoreCard Creator]({{ site.baseurl }}/scorecard-creator).

Oh, don't worry about me---the compiler still runs on your machine. (I am much too cheap/lazy to set up a backend compilation service. ☺) But the compiler *itself* has been compiled to WebAssembly, so that it can run in the browser... to produce binaries that run in the browser!

Aside from being really nifty, this trickery will allow you to create ScoreCards without first installing (per se) Emscripten. Hooray! (This is possible thanks to Jorge Prendes's work on [Emception](https://github.com/jprendes/emception)!)

If you would like to set up Emscripten to run on your machine natively, or if you'd like to try creating scorecards with languages other than C (such as Rust or Zig), we can do that too! The goal of the Creator is just to get you up and running as quickly as possible, and to ensure that nobody is blocked by installation issues. ♥

## Structure of a ScoreCard

Okay, enough prelude, let's get some actual code on a card already!

```c
// 4ever'33"
float process() {
    return 0;
}
```

<iframe src="https://ijc8.me/s?c=06Y-DUJ::H90TOKV.$TI$XET-20I3I4K3HU1:$FHJ128FLL6IRPCWU7H:2GNU0BHD9LTOEJ/"></iframe>

This is about as simple as it gets: the silent card.

This demonstrates the one thing that a program *must do* to serve as a scorecard: generate samples by exporting a `process()` function.

(Technically the function is ultimately exported as `p` to save precious bytes, but you don't need to worry about that.)
{: style="font-size: smaller"}

The above example outputs the same sample forever. To make things more interesting, we need some *state*, so that subsequent calls to `process()` (which takes no arguments) can yield different results.

```c
// bzzz
float t = 0.0f;

float process() {
    t += 0.01f;
    if (t > 1.0f) t -= 2.0f;
    return t;
}
```

<iframe src="https://ijc8.me/s?c=07JF3U+EK2AU8YNW1$::MID.8O0B0BGA3CJIL6PIG$:D9CR0I7MK49-PPW+T1MX-5NCU49:ETAPHT0JTDRES9K:1*A1JFQZQK9S$6$OC$I/2DP./DINGM1AX01L25-5I"></iframe>

(Note that you can click "Show Card" above to see the compiled card for this program!)

In this case, our *state* is explicitly declared as a global variable, which `process()` *mutates* every time it is called.

However, we can also have *implicit state* if we use standard library functions that have side-effects, such as C's `rand()`.

```c
// pssshhh
#include <stdlib.h>

float process() {
    return rand() / (float)RAND_MAX * 2 - 1;
}
```

<iframe src="https://ijc8.me/s?c=01-ZFQXB4E1AS95D2ACIFEW.V5896K$5OLRDXOXCCQBUF$$PCRB1B8AQO$$TBSBMP*.5MQ06-U2+ERMJR-V30YZHFNRAFW+WCD7.SC95ZF6I1LKR1I27VLBXH*G-5G2GOF7SX3EGA:/N9FZAZ3.2P"></iframe>

Notice that the size of the binary has actually increased from the previous one, despite the program getting shorter. This is due to our use of `rand()`; the implementation of `rand()` must now be included in the binary by the linker. Because these programs are statically-linked, we pay for what we use (and nothing else)!

This principle is an important constraint when composing scorecards, and it's why we're using a language like C rather than, say, Python or Pure Data. To analogize, if you want a grand piano at the gig, you're going to have bring it in your van. It won't fit in your van? Perhaps consider an electronic keyboard instead.

*Fun exercise:* see what happens if you call `sin()` or `sinf()`.

## Interlude: The Value Shopper

At this point, things may be feeling a little cramped, a bit spartan. Our examples so far have included... silence, an aliased sawtooth, and noise. Trying to play a single sine wave totally broke the bank!

But don't give up hope. I promise we really can do some interesting things that fit within the confines of a card's QR code; we just have to get a little creative. In particular, we must shop for _value_. We don't need to do less, but we need to make less do more.

Composing a card is an exercise in concision. How much code does it take to explain your idea to the computer? Are you repeating yourself? Use the tools at your disposal keep it brief. These are the core classics of abstraction: loops and functions. (Beware of macros.) Code is compression.

Beyond coding techniques, hunt for _deals_ in the realms of synthesis and music theory. Often, great insights require only a brief description. For example, here are some *cheap* synthesis classics that have withstood the test of time: FM synthesis. Karplus-Strong. The State Variable Filter.

These are *great value*: they'll give you a lot of bang for your buck (or byte, as it were). These techniques take just a few lines of code to describe, but they open up worlds of timbral possibilities.

## deck.h

To aid you in your quest for value, I have created a little library (in the form of a header file) to give you some cheap utilities.

## Case study: Quirky FM ramps

Let's modulate some frequencies.

First, let's just play a single frequency. Rather than writing our oscillation function from scratch, we'll use one of the cheapo waveforms provided by `deck.h`.

```c
#include "deck.h"

float phase = 0;
float freq = 500;

float process() {
    return sqr(&phase, freq);
}
```

<iframe src="https://ijc8.me/s?c=0ENP9HJ**CI21I*JV$E13E9:EXL96WB.L+X5KC-IZ-H.M4EZCGA.AZF/3N:LGF*LIUI2Q3I7N2NTMZ+-BB:8H8MSW080.8OZAAI7WPNNVIK$2*G30Y5JUC40*6PSZKQR.W8JQVNF24PMK8.XT70Z66PW/*1Y8TMIDXC3R+U1I5ILRAK"></iframe>

Ta-da. `sqr()` takes in phase and frequency, and it generates a square wave at the requested frequency. (`deck.h` includes the ScoreCard sample rate, which is fixed at 48000 kHz). `saw()` and `tri()` are also included.

Note that the *state* is in `phase`, which `sqr()` mutates (hence passing a pointer).

We can combine two instances of `sqr()` --- using the output of one to modulate the frequency of the other --- to get a more complex timbre.

```c
#include "deck.h"

float phase = 0;
const float base_freq = 500;
float mod_phase = 0;
const float mod_ratio = 10;
float mod_freq = base_freq / mod_ratio;
float mod_depth = 0.5;

float process() {
    float mod = mod_depth * sqr(&mod_phase, mod_freq);
    float freq = base_freq * (1 + mod);
    float out = sqr(&phase, freq);
    return out;
}
```

<iframe src="https://ijc8.me/s?c=01ODASQX+1G.R1T6BLFHZ-LHH3QH91-:HX*VZDFK91U3JBE5PUS*E.IYHUEZLZLEGQO*3PTZ3H.HDW+XY3QOWP0MCG05VADJWQA.Q/2DF1VY2+SSWO$*BAA*73G6V90-KZO1VD$-:ZTFGP.XPABFE8M0XHUEV/TM$OTW2PUTRMJ3-J**RL6JO1$J-KI/:56L$FEYMAL*-OF:ZZ5$MSJC8BC0V.564M/V81-QY3*WWJ48+R+JGMJ+.+QLBGKMAEMGD9SCS5S3T4F"></iframe>

We can apply some envelopes and ramps to make the sound more dynamic...

```c
#include "deck.h"

float t = 0, dur = 1.0, start = 300, end = 900, phase = 0;
float mod_depth = 0.5, mod_phase = 0, mod_ratio = 10;

float process() {
    if (t > dur) return 0;
    float freq = ramp(t, dur, start, end);
    float mod_freq = freq / mod_ratio;
    freq *= 1 + mod_depth*sqr(&mod_phase, mod_freq);
    float out = sqr(&phase, freq) * env(t, dur);
    t += dt;
    return out;
}
```

<iframe src="https://ijc8.me/s?c=02*-IRGU-/9Y1HW+OLZJ36PE/FIL2HH5HAX3HT/7K.2Z-4/0M64O1N::YWQU+-M-LSL:Z6H-R2MQP*NV1AHWX8D+443HBCT795GNE26-ZM0XB/2RH/EZOFOB29DO2RK6SN$J$KBV.MM9.CRDR2SZ63E7VWOY7U:5I2:4.:2K6.*-UJOCMI3$5*H/L5LTY6697ID-2F$PQY6.B$TF9-C0CT29BTF4XWZ1/5.JZ/TJCQ1G-FV-O8N$467OJFR9GT1TK6TK7SD0T-RH92-I*GL-CENI2646S8H.SIMD:GQE/GHIL6.GYUJS0OJWWC4W-BSH-2IL1YD8QLQRSOX+*L9Z:ZQV3CXY64RL9M5-177WOGQ.MK3GJD.RNJSFXMK9*T:9:WYPKRVKVQ9PGB:.*"></iframe>

Now we have a sound with a bit of character. We can get a lot of *different* sounds with character by randomizing some of the parameters. While we're at it, let's give this thing a name.

```c
#include "deck.h"

card_title("Quirky FM ramps");

float t, dur, start, end, phase;
float mod_depth, mod_phase, mod_ratio;
float dur_options[] = {0.25, 0.5, 1.0, 2.0, 4.0};

void setup(unsigned int seed) {
    srand(seed);
    dur = choice(dur_options);
    start = uniform(0, 1000);
    end = uniform(0, 1000);
    mod_ratio = uniform(1, 100);
    mod_depth = uniform(0, 1);
}

float process() {
    if (t > dur) return 0;
    float freq = ramp(t, dur, start, end);
    float mod_freq = freq / mod_ratio;
    freq *= 1 + mod_depth*sqr(&mod_phase, mod_freq);
    float out = sqr(&phase, freq) * env(t, dur);
    t += dt;
    return out;
}
```

<iframe src="https://ijc8.me/s?c=01093JM**N3SDC8-2JZ7E-M59ZWDTY5CWWVQZCBRFMU4RG-Y0AYD-6D1+MJAQ0RT9$QGTPGXOCO4F*984:4ZW1AW6C/P3V4Z6*VG8+MZ4E1WTJ+HX*M7OPLINGWFAGSXWGA/S-*EBTXTSP4Q73$FVGH8US*J-/NEBFEG$A49F$N-RMYQW7-3237YWZK-:7ZCN52T9DJ-WUF$5AUGIW6HI$EFNK5I2Q9/XW4Z-F0M95/J67SJBBU1PHAA6R9IUPXHE9.Y*YX9-E-IGK6ZR+9J3U4-+8J1OOQVWK1NSA$G.$YP6488T29SZHR22U+GL82Z/E9P4QUDM+IYI:ED+2BW4*WERS4FIYX0:OQL5*AR9-14K5+R2WS6P-2Y$B9IJIQEGLMM8XJD4*Y95C4ML$YC4V85D6IG:V94BWLCBSQO/9BD2E*PI9QT5Q+E2RTQ$7SN8JJJ*X9N7:MA3IL.YBZXUX6:B*:-S71V45/DLFH5P997W:L3QB3S/FEH80QALNR*HQL0QAGXQXD7VHDJMEW/KU418*/*M3WILVN93+3D1RGM+$FPH8$*A07*FK5SV0GE0S-KI45.8UXUL7K0C4W/M$0$5G$4/6758YB1PXF+$YG9INLKB0PA0UI$WRUQGH478VGLD.2VD5P20YF198J7YOBZS*V8WRVE4ZT.IZNMQ-CITFEREHXPGD.N35V$O1:4*I:MS$1YC*H4$F7NIF9/ZZAX$RJG/"></iframe>

This version of the card introduces the *optional* things that a ScoreCard can do. (Recall that the one thing it *must* do is generate audio samples via `process()`.)

In addition to `process()`, we define `setup()`, which can take a *random seed* and use it however it likes. In this case, we use it to seed the standard library's PRNG via `srand()`, and then use the convenience function `uniform()` and the macro `choice()` to leave some things up to (pseudo-)chance. (Try pressing the reset button to hear different variants! You can also try locking the seed or setting it manually.)

Finally, we've added a call to `card_title()`, a macro which allows us to declare a string that the ScoreCard player can display to the user. (This string is embedded in the WebAssembly binary.)

## Higher-Level Structure

At this point, we've seen how to make some cards that make some nifty little sounds. But this work has remained firmly in the realm of synthesis, perhaps edging into sound design. How can we represent *musical elements* beyond timbre, such as *notes*, *rhythms*, and *events*, or even *phrases* and *sections*?

Well, we're programming, so if we want to talk about higher levels of abstraction... we can just build the abstraction! For example, we can readily define `struct`ures to represent notes or other musical materials, and then write functions that operate on these data types.

But, there's a catch. `process()` is still called once per sample by the player, and this drives the entire program. This means that when `process()` is called to generate the next sample, we have to figure out where we are in the higher-level structure and react accordingly. If we're in the middle of a note, for example, we should run all the oscillators and envelopes and so on in order to generate the next sample of that note. But if we're at the end of a note, or at the very beginning of playback, we need to execute some other logic to determine what note to play!

If we approach this naively, we'll end up with a big old state machine, probably in the form of a gnarly `switch` branching on the various values of an enum. In practice, this is quite awkward, as it forces us to flatten out all of our control flow and manually connect the states. If the *card* were driving instead of the *player*, we wouldn't have to deal with this inversion of control and we could simply use ordinary control flow constructs (such as loops).

## Fake Generators Yield Real Fun

The good news: languages have figured out to deal with the problem of preserving control flow and state across multiple "entries" into a program. The general answer is [coroutines](https://en.wikipedia.org/wiki/Coroutine#Generators). Different languages have different flavors and names (e.g. "generators" in Python and JS), but the key point is that you have something that *looks like a function*, and which can use all the conventional control flow you'd expect, but which can "return" (yield) multiple times. Each time it's called again (resumed), it simply picks up from where it left off.

The bad news: C does not have coroutines.

The funny news: [Simon Tatham has demonstrated](https://www.chiark.greenend.org.uk/~sgtatham/coroutines.html) that we can fake coroutines reasonably well by abusing other language features, particularly macros and [Duff's device](https://en.wikipedia.org/wiki/Duff%27s_device). What a language.

Anyhow, `deck.h` includes an implementation of generators based on Tatham's work, and you can use them to encode higher-level structure in (apparently) normal control flow!

Let's look at a quick example. We'll play a melody repeatedly, with some logic to vary subsequent repetitions.

```c
#include "deck.h"

card_title("lick spiral");

struct note_t {
    uint8_t pitch;
    uint8_t dur;
};

struct note_t notes[] = {
    {62, 1}, {64, 1}, {65, 1}, {67, 1},
    {64, 2}, {60, 1}, {62, 1},
};

float process() {
    static float phases[2];
    static float freq, dur, base_dur = 0.25, t = 0;
    static int offset = 0, i;
    gen_begin;
    for (;; offset = (offset + 1) % 12) {
        for (i = 0; i < SIZEOF(notes); i++) {
            freq = m2f(notes[i].pitch + offset);
            dur = notes[i].dur * base_dur;
            for (; t < dur; t += dt) {
                float pos = t / dur;
                pos = (i + pos) / SIZEOF(notes);
                pos = (offset + pos) / 12;
                float x = pos*tri(&phases[0], freq/2)
                    + (1-pos)*tri(&phases[1], freq);
                yield(x * ad(t, dur/8, dur*7/8));
            }
            t -= dur;
        }
    }
    gen_end(0);
}
```

<iframe src="https://ijc8.me/s?c=045TIBUYK0Z/QIR478JAVF++D/830PINJT/KD75W49F.O.S2WG8X5Y$8AU4.2:8ONQ:C*BUX6TJHS$V4N4QO$P3LZ$XIIF+7*AXT:MDVPZ*-/NMNAYA.DVX1H+/H8/I9Q5NMONFXE9:/J*VZ47RP6LUVZ$KYS58Q1OYJOYBO:1SJP+W8-*BRVLJJB.MJA*SRVWT:0FMGR*RGXUY2XABW59HH+H6YLZMBDKBI2MARFTTQ5E:P-1$U-ZQYYOLT1VD65*0$0ZD80.:F-B7*LM0INRV6HOU.EKS/2BNB--X5ORVAWQFHSJ$RIHSF6Q8K/P76RKBYMSOWBR:MZBI3S1$EG0WY*D+P*H8V4P89:E:7HA5RBC:332F:8U3$TYQB9EJ8UMH4Q6LBOKR/Y9CJ1SHK0:TIE$2BKTWHPO6$0JISIZXH*IPDBC:UJO+X6ML0+XS+51+V-UHU68T/-K8HC$26:7F6Q2$1KTIP4.7EUR2MKA43M*HNVV3JBEO:31H0K5X*S.M5+M9SLWUS:9P83SD4CJE1UBY6LUT.9:BTW1I3M-86DS/+:ZP5U8A9I2OCG8/7Z7+9A/IZ/4-GM0NZ1YYJ5NS4:SP4SI5V1T5WQ1MVH-0V3Y.*D.IX-S5CS:V8UU.G59+.P+9JL3LZZI169J/9*-30QGE0MDTEQWSS.3:JGQ/M38GDAHYH2:MB+BZWV2H7$XG80AK:ICMBWTNA:WT2/9:HD-2H7FVO/6*:IGVCO+MZMTGCHX6XLN6ZZ/NM0FC3CO8QJDCB82X03ULZLSO+WAGVXD-/DLRHXTJ2.KE9I3CGY*QRPL2S82-GSY6N43CVE*QTWJCZ-KF3UOHH09OM8V4$*$8:J*U419KYJQ/57M*VN.KOVIVM3Z0-NT86F/IY-Q:LP5*68EG44$.IIJ8T8PN6E+A3.6F*XI.NIS4.CJKM5V6W428185:WUWJFNKQTGJ81TQS.8CHHEPCKQUC+9S0PE+2IHUGY6NVPGV"></iframe>

We're using three generator-related macros here. `gen_begin` and `gen_end()` are basically boilerplate that you need to turn your function into a "generator". The argument to `gen_end()` defines what your generator will return after it's exhausted (reached the end of the control flow), so it needs to match the function's return type. `yield()` is where the action is, though --- when we `yield()`, we "suspend" the function's execution, returning the argument passed to `yield()`, and we'll pick up from the same point when the function is called again.

Thus, in this example, we can simply iterate through our melody using a `for` loop, `yield()`ing whenever (from "our perspective") we feel like it.

Note that there's one other change we add to make to our function: all the locals are `static`. We have to do this because, ultimately, `process()` really is just a normal function getting called multiple times, and locals are destroyed when a function exits. We need them to persist between calls, hence --- `static`.

If you're familiar with `static` and thinking ahead a bit, you might wonder how this will work when we have multiple instances of a generator (an issue that doesn't affect `process()` but might affect other generator functions). The answer is, it won't! You need to put your state somewhere else. Put it in a `struct`, and you can have as many instances of generator running at the same time as you want. `deck.h` includes re-entrant versions of the generator macros (cleverly prefixed with `re`-) for just this purpose, although the resulting code is slightly more awkward.

## Composing Generators

Here's a more involved example in which we compose two generators together. `process()` itself is a generator function, but it just deals with synthesizing notes (and rests). It pulls notes from another function, `arp()`, which is also a generator: a higher-level one that emits events!

```c
#include "deck.h"

card_title("arpeggios");
setup_rand;

const uint8_t scale[] = {0, 2, 3, 5, 7, 9, 10, 12, 14};

const uint8_t chords[][5] = {
    {0, 2, 4, 6, 7},
    {0, 2, 3, 5, 7},
    {0, 1, 3, 6, 7},
    {1, 3, 4, 6, 8}
};

typedef struct {
    uint8_t length;
    const uint8_t *order;
} pattern_t;

const pattern_t patterns[] = {
    {3, (uint8_t []){0, 1, 2}},
    {3, (uint8_t []){2, 1, 0}},
    {4, (uint8_t []){0, 1, 2, 3}},
    {4, (uint8_t []){4, 3, 2, 1}},
    {4, (uint8_t []){0, 1, 2, 4}},
    {4, (uint8_t []){0, 2, 1, 2}},
    {6, (uint8_t []){0, 1, 2, 3, 2, 1}},
    {8, (uint8_t []){0, 1, 2, 3, 4, 3, 2, 1}},
};

typedef struct {
    int pitch;
    float dur;
} event_t;

event_t arp() {
    const float dur = 60.0 / 110;
    static int c, i, j, octave;
    static pattern_t pattern;
    gen_begin;
    for (;;) {
        octave = rand() % 3;
        pattern = choice(patterns);
        for (c = 0; c < SIZEOF(chords); c++) {
            for (i = 0; i < 4; i++) {
                for (j = 0; j < pattern.length; j++) {
                    int deg = chords[c][pattern.order[j]];
                    yield((event_t){
                        scale[deg] + 48 + octave*12,
                        dur / pattern.length
                    });
                }
            }
        }
    }
    gen_end((event_t){});
}

float process() {
    static event_t event;
    static float t = 0, freq, phase;
    gen_begin;
    for (;;) {
        event = arp();
        if (event.pitch == 0) {
            sleep(t, event.dur);
            continue;
        }
        freq = m2f(event.pitch);
        for (; t < event.dur; t += dt) {
            float amp = ad(t, 0.03, event.dur - 0.03);
            yield(saw(&phase, freq) * amp);
        }
        t -= event.dur;
    }
    gen_end(0);
}
```

<iframe src="https://ijc8.me/s?c=043/*/4$YNOBQ4:ZP2JZ:WV7M$O30AQ:C4G7HLV*0G$4-/T05Z2N9$++NJASFV3ZP*YCYPE0+PR*RX4$:/XJAS-UZCIA6BJ70+D9MGWCYCGCGD/OC.6XAMYDM5TFPENT7EDL*MISDZ6CAIJ4:NL.82+87CHZNV$L+SC+U7W4RU1KCWLU6+H1VSU5OYT1EUM4GV0NSH+HR7*ZAFREV+9P:7M+NBYO*AX-7WK$YAUQB7DL5-T8CLXUI2Q2F2Y9T*B/K.L.JIX8N0CY3HEI7UAV1.UUP+8MCJGCS8FJW2EVZ14-JOR$0PZ*YLWZ/BR:--E-/6VNM:5-$9O:Q$00H+F4DPI7TP6/E-9PXNCWUK44VW9C69R+VV7$5FXK-J842EUAJS986:C:.GC/BJ3//5-DOP*SM8Q**H5*AF3XQ37CFX+77CC*4HO4TJMP:-LW2B7UP--SQ*O$XLR-K-1$JXSQQE0PTNG9TZ0M$P0:60-FR-AD6P766:LZ4Z03I01EN4Q+/0CIY:EKRF9DLR9O3E0$6CDTWRP+LAQN34B3YNB92W4X/QPU-$SVP-0+91D+06*L*J3UKI9NITFA0579P91E6.+0X/-1KAKKTIQX1TAVM1MP:6E*NN39ZU+IN$1J6SWFJT$60MVZFU6NGEY8PG:29ANJQVM+-UX**MDLAP9:85ZGRJ0ZOWZS4IKZ5QX2.VGD:5L4UG74H4EK10/7+L-J/S3$+AXBW.JS6K:WNG035KJ-W9Q05W4LINY4WDDIWR2ZIULHP8RFD3:TC9Q$JGFRF+L1HGB5WSC44/I/.PTNGGJMDZTLQ.KJ2AUFQ8CZ$P1YFIXR8$UTI41Y+H*WN/5C*A5FMKK4U.PUT$UMXW1B*76*0GPLO7E1QJJO9L22I.-5.IKF7NWS.WFQ4NZ-FK7+T9S17IY+NMO27Y15V16XJYG-/I+Y8F/EKUVJ/$PMGJQ2TPY2N02EOY*US*CX/13N54PNORE52696TBR3DXB1ZSOO24C+R3Q9K:L7PD1271XED4PJXNKRVSX:GSPYF0W4HFY6M3LQZ07XRZF47DXGU52A.6UUV4RSD3-AX1V6KF2HD0BSFCO/*YQ*/2A4UD9UM+HL.XI284680OPA:W37+BS1RO/*CPQ8AJX7A4MJSZ.BI2DN348:X+4Y1O+YD0.TSPWUGVYUHGN0*9N/:AQBVN70AFYW55I85+IJN+*NKWRWMMFBKE*BU$2CKSDI0-7.*ZOIMAPLW8G-UM.N047CFHI*QBDGFZSTO8WT$..K1PB$C::-.596L*4KYXV6PYDY31:RY72Q-7PA-BP/Z4NDPX:1CCGJHYM/Y+HMFNYMMQ43JUC3C9XCCH8HRX-/WXU9XZSY1ULI+NILDZ$MXNUI87DXVDR8:HM78FX/M5L:E.UB80MQZ-F6ND33PJ+*JKS9C92AC2$+$LW$D5BNNJV.7I5J$6VKHWJCVGFFM2X:AN9FQY5VSQX$QC*RF::YH4:*RR.LN*1XNX49IU$RT/AJ8Q8CI$HJ9/PZRRI*5.PYFW4+X.WJ0R621X.7HVIIFFW9V5RQ6+RZEWDH7K.85B72B6R/E6+QP77X.M7.WCN0$A/0MNCPO.FSTPZV+DH4HG7YO+VH$Z.BZJXG:1G4*9V$WT5Q1*B1V*O2P94T2XEVZMI0I35J3O1UI:G:8T6W/MVBDI+FF:I9Z8D*VAAF..D0IGZS2QW3UTD-4BDH4OPA4K/PCY+.F+S0JMOVZYEW0P1SU.Y97EWVI9RBGZA3OU0T84U06V/*U37H+IHCX-K+ZHRS2WRTVEHC:XSDADH4JNN/25HVM-EI2NBB:UGS76:FK25C8XZV1IEILLBE22$8IV.T536"></iframe>

# Break

Phew! After all that, it's probably a good time to get up, stretch, and walk around. Consider hydrating!

# Card Tricks

At this point, if you're not an incurable C hacker, you may be asking a reasonable question:

"Okay, it's kinda cool (and maybe a bit freaky) that you can abuse C to make it sort of usable for composing cards, but... do I really have to write this stuff in C? I just want to make little musical cards!"

The answer is no: you don't have to write this stuff in C. As mentioned previously, you pay for whatever you bring with you, so you need a language that allows you to *only bring what you need* into a self-contained executable. (E.g. if we have a Pd patch and only use `osc~` and `dac~`, the "self-contained" size is the size of our patch + the size of Pd, and Pd doesn't get any smaller just because our patch is simpler.) But other compiled languages let you only bring what you need: in particular, Zig and Rust (with some coaxing) can produce sufficiently tiny Wasm binaries to fit in a card. Faust and Pd (via the Heavy Compiler) may also prove viable. (And of course you can always write Wasm by hand. ☺)

But, there's another option: start with something else entirely, and generate C. Or start with a C template, and fill in one small but crucial fragment. Following this strategy, I've created a few tiny tools/templates you can use to create ScoreCards without writing C yourself. Each lets you do something specific, like play with bytebeat expressions, or record a short sample, or tinker with Tidal-esque patterns, and they take care of the boilerplate for you. (You can also use the resultant C as a starting point for further hacking.)

# Create Your Own Cards!

Create cards! Collaborate or compete! Preserve your code as a printed card, or just use it as a sticker.

If the pacing has worked out as intended, there should be ample time for this segment of the workshop. Feel free to ask questions, try weird things, or provoke interesting tangents.

# Trading Cards

Share with the class. ☺

Discuss: fun? frustrations? fantasies?

<script type="text/javascript">
const iframes = [...document.querySelectorAll("iframe")]

for (const iframe of iframes) {
    const newParent = document.createElement("div")
    newParent.style = "border: 1px solid black"
    iframe.insertAdjacentElement("afterend", newParent)
    const button = document.createElement("button")
    button.textContent = "Show Card"
    button.style = "width: 100%; height: 30px; font-family: Sysfont; font-size: large; position: relative; z-index: 1"
    newParent.appendChild(button)
    newParent.appendChild(iframe.previousElementSibling)
    newParent.appendChild(iframe)
    newParent.children[2].style = "display: none"
    let state = "code"
    button.onclick = () => {
        if (state === "code") {
            state = "card"
            newParent.children[1].style = "display: none"
            newParent.children[2].style = ""
            button.textContent = "Show Code"
        } else {
            state = "code"
            newParent.children[2].style = "display: none"
            newParent.children[1].style = ""
            button.textContent = "Show Card"
        }
    }
}
</script>
