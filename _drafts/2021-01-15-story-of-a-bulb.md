---   
layout: blog
title: "Story of a light bulb"
thumbnail: "blogs/thumbnails/representing-ip-address-using-rgb-leds.jpg"
cover: "blogs/thumbnails/representing-ip-address-using-rgb-leds.jpg"
summary: "This is what happened on a friday evening"
description: ""
tags: ["iot", "light", "diy", "project", "fun"]
categories: ["blog"]
---

<h2>Short Story</h2>
I made a simple internet connected bulb that blinked when you visited this page.
It will blink again if you click on the below button.
<button class="button" style="width: 100%; padding: 1em 1.5em; font-size: 1.5em;" onclick="sendMessage('CLAPS')">Give me a clap</button>

<h2>Love for lights</h2>
I get attracted to lights very easily. My shelf, windows, and drawer are almost filled up with different types of LED bulbs and fairy lights.
This interest came long back when I was in 5th grade and one of the senior girls brought a battery and bulb for the school science exhibition.
That was the first time I came to know that a battery and wire can light up a bulb. That day I returned home and pulled out batteries and bulbs from the TV remote control and radio, and started trying out the same. 
I was so happy when it worked for the first time. I knew nothing about battery and bulb, but it just worked. Even now, when I make something with the bulb, I remember her.

<h2>NodeMCU</h2>
My interest with electronics (and obviously bulbs) grew up with me (no, I still dont know how to use a multimeter properly). I used to disassemble and repair electionic gadgets in my house (and damaged most of them for some unknown reasons).
I chose computer science as my main subject in 12th grade. I learned some programming concepts. Then I came to know about arduino boards (programmable micro controllers), and started playing with it.
Couple years back, I bought some NodeMCUs (think of it as arduino + wifi) but way more cheaper. It was like 2 dollers when I purchased. I also bought some sensors and relays to make hobby projects out of it.

<h2>Neopixels</h2>
We all know about LEDs, they are awesome. Think of LED strips(LED bulbs connected to each other), they are super cool. Think of led strips in which each LED can make more than 10000 colors(combinations of red, green and blue), superb.
Now think about controlling each LED and its color individually, thats heaven !
NeoPixel is the one.

<h2>Glitch Playgroud</h2>
NodeJS (server-side javascript runtime) is the technology that I'm working on. glitch is service that allows to edit, maintain and run NodeJS applications.

<h2>Smitch Smart Bulb</h2>
I usually turn on dim lights when I sleep. I recently bought a table RGB smart table lamp from Smitch. It can be controlled from their mobile application.

<h2>EasyHome</h2>

<h2>Sockets</h2>

<h2>Future improvements</h2>

<button class="button" style="width: 100%; padding: 1em 1.5em; font-size: 1.5em;" onclick="sendMessage('CLAPS')">Give me a clap again</button>

<script>
    const url = `wss://easyhome-server.glitch.me/ws`;
    const socket = new WebSocket(url);
    // Connection opened
    socket.addEventListener('open', function (event) {
        console.log("connected");
        socket.send("VISIT");
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });

    function sendMessage(message){
        console.log('sending message', message);
        socket.send(message);
    }
</script>
