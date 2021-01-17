---		
layout: project
title: "BlackPipe"
summary: "Expose realtime terminal outputs without sacrificing security."
description: "BlackPipe is a simple tool to expose realtime terminal outputs without sacrificing security."
thumbnail: "projects/thumbnails/blackpipe-example.jpg"
visit: "https://shajanjacob.com/blackpipe/"
source: "https://github.com/shajanjp/blackpipe"
technologies: ["NodeJS", "ExpressJS", "MongoDB", "EJS"]
categories: ["project"]
---
<p>
Piping outputs to blackpipe is easy. You can use the same bash syntax that you are familiar with.
That's easy as this.</p>
<p>Theres no limitation on what command's output you are piping to blackpipe. BlackPipe works with pretty much any command line tool that generates an output.</p>

<p>Custom session : BlackPipe uses sockets to stream data to the web page. By default, it uses a server hosted at https://blackpipe.glitch.me/. BlackPipe allows you to pre define the session name using --session params. </p>