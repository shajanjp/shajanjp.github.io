---   
layout: blog
title: "Representing IP addresses using WS2812B"
thumbnail: "blogs/thumbnails/representing-ip-address-using-rgb-leds.jpg"
cover: "blogs/thumbnails/representing-ip-address-using-rgb-leds.jpg"
summary: "I just wanted the NodeMCU to tell me the IP through some interface without needing a computer."
description: ""
tags: ["iot", "light", "diy", "project", "fun"]
categories: ["blog"]
---
<p>Colors and lights always make me happy. Its a pleasant feeling when I see my favorite color palettes. I'm a bit strict about the colors I choose, but I still like seeing random colors floating around.</p>
<p>I was making an IoT moodlight using <a target="_blank" href="https://www.nodemcu.com/index_en.html">NodeMCU</a> and <a target="_blank" href="https://en.wikipedia.org/wiki/LED_strip_light">WS2812B</a>. Which can be controlled using <a target="_blank" href="https://shajanjacob.com/easyhome">easyhome</a> (dashboard for controlling RGB WS2812B from the web). Every time the NodeMCU get connected to the WiFi access point, it had different IPs assigned to it. So it was hard to find the current IP, I used to connect the NodeMCU to the computer and made use of the serial monitor of Arduino IDE to find its IP. This worked for me as long as the computer and MCU are close enough for a wired USB connection.</p>
<p>I just wanted the NodeMCU to tell me the IP through some interface without needing a computer. All I had was a WS2812B strip, So I represented the IP using 4 LEDs. Initially IP was split into 4 parts. Parts were displayed in red, green, blue and white respectively. This is how the LED shows, when the IP address is lets say, 192.168.100.1</p>
<ul>
  <li>...* RED</li>
  <li>*..* RED</li>
  <li>..*. RED</li>
  <li>...* GREEN</li>
  <li>.**. GREEN</li>
  <li>*... GREEN</li>
  <li>...* BLUE</li>
  <li>.... BLUE</li>
  <li>.... BLUE</li>
  <li>...* WHITE</li>
</ul>