---
title: Pixels String
description: WiFi ESP32 pixel LED string controller - 23 effects, 5 variations, button, web dashboard, REST API & MCP.
thumbnail: "pixels-string.jpg"
icon: "pixels-string-icon.png"
created: 2026-07-29
tags:
  - diy
  - esp32
  - m5stack
  - arduino
  - neopixel
  - light
  - web
  - rest-api
sourceCodeUrl: https://github.com/shajanjp/pixels-string
livePreviewUrl: https://shajanjacob.com/pixels-string
---
<div style="display: flex; justify-content: center;">
  <iframe width="315" height="560" src="https://www.youtube.com/embed/ldeJXF3cC08" title="YouTube video player" frameborder="0"></iframe>
</div>

A WiFi-enabled ESP32 LED pixel string controller with 23 stunning effects, 5 variations per effect, a physical button interface, and an embedded web dashboard for browser-based control. It also exposes a full **REST API** for programmatic control over HTTP and a built-in **MCP (Model Context Protocol)** server so AI assistants can drive the LEDs directly.

<img src="https://shajanjacob.com/pixels-string/pixels-string-dashboard-screenshot.jpg" alt="Pixels String Web Dashboard" style="height: auto; width: 100%;">

## Features

- **23 LED Effects** - Fireflies, Rainbow Swipe, Aurora, Comet, Chasing Dots, Cylon, Dual Comet, Sparkle Sweep, Police, Plasma, Rainbow Gradient, Pulse Wave, Single Runner, Audio Visualizer, Heartbeat, Twinkle, Fire Flicker, Bouncing Balls, Lightning Storm, Kaleidoscope, Colliding Fill, Paint Splat, Snake
- **5 Variations Per Effect** - Cycle through variations with successive taps on the same button
- **Web Dashboard** - Embedded HTML/CSS/JS dashboard served directly from the ESP32, with animated icons and API feedback
- **Physical Button** - Single-click to cycle effects, double-click for variations, long-press for power on/off
- **REST API** - Full programmatic control over HTTP
- **MCP Server** - Built-in Model Context Protocol server so AI assistants can control the LEDs directly
- **Apple Home (HomeKit)** - Exposes the strip as a Apple HomeKit Lightbulb (on/off, brightness, color) via HomeSpan
- **Static IP & mDNS** - Reliable network configuration with custom hostname
- **Persistent LED Count** - Number of LEDs is stored in NVS (non-volatile storage) and configurable via API
- **Auto-reconnect** - Monitors WiFi and reconnects automatically

<img src="https://shajanjacob.com/pixels-string/pixels-string-dashboard-mobile-screenshot.jpg" alt="Pixels String Mobile Friendly Web Dashboard" style="height: auto; width: 100%;">
