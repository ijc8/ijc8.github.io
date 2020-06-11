---
layout:    page
title:     special page for a special day
permalink: /em/
---

_A video awaits..._ <br>
_To mark a special date!_
{: style="font-size: larger"}

<div id="player" style="transition: opacity 4s; opacity: 1"></div>

<script src="https://www.youtube.com/player_api"></script>

<script>

// create youtube player
var player;
function onYouTubePlayerAPIReady() {
		player = new YT.Player('player', {
			width: '640',
			height: '390',
			videoId: 'm1ZgsNWj0CI',
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange
			}
		});
}

function onPlayerReady(event) {
		event.target.playVideo();
}

function onPlayerStateChange(event) {        
		if (event.data === YT.PlayerState.ENDED) {          
				document.querySelector("#player").style.opacity = 0;
				setTimeout((() => document.querySelector("#part1").style.opacity = 1), 2000);
				setTimeout((() => document.querySelector("#part2").style.opacity = 1), 4000);
		}
}

</script>

<span id="part1" style="transition: opacity 5s; opacity: 0">_That video's too exciting!_</span> <br>
<span id="part2" style="transition: opacity 5s; opacity: 0">_Now rest seems most inviting._ 😴</span>
{: style="font-size: larger"}
