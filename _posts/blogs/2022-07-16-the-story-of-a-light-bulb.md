---   
layout: blog
title: "Story of a light bulb"
thumbnail: "blogs/thumbnails/the-story-of-a-light-bulb-thumbnail.jpg"
cover: "blogs/thumbnails/the-story-of-a-light-bulb-thumbnail.jpg"
summary: "I just love seeing them glow"
description: ""
tags: ["iot", "light", "diy", "project", "fun"]
categories: ["blog"]
---

<img src="{{site.baseUrl}}/uploads/blogs/the-story-of-a-light-bulb.jpg" style=" height: auto; width:100%;">
## Short Story
I made a simple internet-connected table lamp that blinked when you visited this page.
It will blink again if you click on the below button.
<button class="button send-message-button m-b-1em" style="width: 100%; padding: 1em 1.5em; font-size: 1.5em; margin-bottom: 1em;">Give me a clap</button>
See a better playground [here](https://globo.deno.dev/).

## Love for lights
I get attracted to lights very easily. My shelf, windows, and drawer are almost filled up with different types of LED bulbs and fairy lights.
This interest hit me long back when I was in 5th grade and one of the seniors named Riya brought a battery and bulb for the school science exhibition.
That was the first time I came to know that a battery and wire can light up a bulb. That day I returned home and pulled out batteries from the TV remote control, and started trying out the same.
I was so happy when it worked for the first time. I knew nothing about battery and bulb, but it just worked. Even now, when I make something with the bulb, I remember her.

## From zero
Fast forward to 2022. It was a boring rainy weekend and I had a ton of time to kill. Like everyone else, I have a dozen of DIY project ideas on my bucket list. I wanted to finish at least one of them per month. One of the ideas was to make a mood light that stays on my table and should be more than just a light at the same time.

The initial thought I had in my mind was to hack the IoT bulbs I already have (so that I don't have to build one). But most commonly available IoT bulbs don't have public APIs. I have even reached out to the Smitch and Syska team regarding this, but no hope. Reverse engineering their protocol is a headache.

I decided to build one. These things happened over the night.

## Why
Why should I do this ? For fun. Yeah, that's the first priority.

I like to get notifications that won't disturb me. Notifications are supposed to be disturbing, but I wanted to make them friendlier. Notifications from the calendar, social media, chat, GitHub hooks, and whatnots.

### Choosing the stack
My interest in electronics (and obviously bulbs) grew up with me (no, I still don't know how to use a multimeter properly). I used to disassemble and repair electronic gadgets in my house (and damaged most of them for some mysterious reasons).
I chose computer science as my main subject in 12th grade. I learned some programming concepts. Then I came to know about Arduino boards (programmable microcontrollers), and started playing with them.

I have a couple of RaspberryPi boards but it will be an overkill for this tiny little project. Even [RaspberryPi Zero](https://www.raspberrypi.com/products/raspberry-pi-zero/) would be too much. [RaspberryPi Pico](https://www.raspberrypi.com/products/raspberry-pi-pico/) is ok, but I would have to wire up additional [esp-01](https://en.wikipedia.org/wiki/ESP8266) with it for the WiFi connectivity. [RaspberryPi Pico W](https://www.raspberrypi.com/news/raspberry-pi-pico-w-your-6-iot-platform/) is perfect but it's not available in stores at the time of writing this.

A couple of years back, I bought some [NodeMCU](https://en.wikipedia.org/wiki/NodeMCU)s (think of them as Arduino + WiFi) but way cheaper. It was like 2$ when I purchased it. I also bought some sensors and relays to make hobby projects out of it.

Finally, I decided to use the NodeMCU.

### Neopixels
We all know about LEDs, they are awesome. Think of LED strips(LED bulbs connected to each other), they are super cool. Think of led strips in which each LED can make more than 10000 colors(combinations of red, green, and blue), superb.
Now think about controlling each LED and its color individually, that's heaven!
[NeoPixel](https://www.adafruit.com/category/168) is the one.
There was no doubt about using addressable LEDs like WS2812B. The one I chose is the rounded [WS2812B with 24 LEDs](https://www.electronicscomp.com/sensors-module/modules/24-bit-ws2812-5050-rgb-led-built-in-full-color-driving-lights-circular-development-board?sort=pd.name&order=DESC).

### Power
Even though this is going to be on my table all day, I'm hesitant to power it with a wired adapter of any sort. I had a plan to use a few [18650](https://commonsensehome.com/18650-battery/) batteries I have, but the charging modules and voltage regulators are going to complicate things. Then I thought that I will use my old Mi power bank, but since it doesn't have a low power mode, it will turn off if a minimum amount of power is not consumed from it. NodeMCU only draws around 110 mA when idle.

Finally, I bought the [Mi pocket power bank pro](https://store.mi.com/in/item/3204500003), which is considerably small and has a low power mode.

### Software and services
[Deno](https://deno.land/) is used to build the backend REST API and WebSocket server. Deployed on deno deploy. [Glitch](https://glitch.com/) is also a good alternative, but it sleeps when no requests are made for 5 mins or so.

Logic in NodeMCU is written in [Arduino](https://www.arduino.cc/) (a framework built on top of C++).

## How it works
I have deployed the REST API and a web socket server in [deno edge](https://deno.com/deploy). The REST API can be used as a hook API. The server accepts messages and broadcasts to all the connected web socket clients. NodeMCU is subscribed to the above-mentioned WebSocket server and handles incoming requests whenever a message event occurs.

## Future plans
- I will be adding a push button that will act as an IoT button(like an [Amazon button](https://en.wikipedia.org/wiki/Amazon_Dash) or [bttn](https://bt.tn/)) to trigger useful events.
- I will also add a buzzer for handling more priority notifications. (Thinking of using morse code at some point).
- Add a firefly light effect and play that randomly.
- Add a real-time clock module and use the LEDs to show time.

<button class="button send-message-button" style="width: 100%; padding: 1em 1.5em; font-size: 1.5em; margin-bottom: 1em;">Give me a clap again</button>

<img src="{{site.baseUrl}}/uploads/blogs/globo-iot-mood-light-table.jpg" style=" height: auto; width:100%;">

<script>
    const sendMessageButtons = document.getElementsByClassName('send-message-button');
    const url = `wss://globo.deno.dev`;
    const socket = new WebSocket(url);
    
    for(const sendMessageButton of sendMessageButtons) {
        sendMessageButton.addEventListener('click', () => {
            console.log("sending...")
            socket.send(JSON.stringify({ r: 255, g: 255, b: 0 }));
        })
    }

    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({ r: 255, g: 255, b: 0 }));
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });

    function sendMessage(message){
        socket.send(message);
    }
</script>
