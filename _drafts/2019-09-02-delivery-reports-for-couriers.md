---   
layout: blog
title: "Push notification for courier delivery reports"
thumbnail: "blogs/thumbnails/delivery-reports-for-couriers.jpg"
summary: "Get delivery report notifications for courier mails on your phone"
description: ""
tags: ["IFTTT", "DIY", "HACK"]
categories: ["blog"]
---

Hi, 
My best friend was leaving the company, and I was planning to gift her a custom-made DIY greeting card. I wanted to know when she will open the card.
In the case of digital messages, we can track whether our messages are delivered/read. Eg: Whatsapp uses grey tick to indicate that the message is delivered, and blue tick to indicate that the message is seen by the receiver. 
How about couriers and physical cards? We don't even know whether the package is delivered or opened.
Yeah, I have come up a hack to get this thing done.

Solution : 
In one word, IFTTT. :)

IFTTT is a service for connecting and automating online services. Almost any web services can be connected to IFTTT and we can do simple and sometimes complex flows with it.

One of the interesting thing that IFTTT offers is the webhook service, which can accept and emit web requests. This event can be chained with another service "Notifications" which will do our job.

So, this is how it's going to work.
We will setup an IFTTT webhook, use it as a trigger and uses "Notifications" service as an action. Encode the webhook request into a QRCode image. Stick this inside the package. Done !

Lets break this into steps.

Steps :
  * Sign-up / sign-in to IFTTT.
  * Install IFTTT application on mobile.
  * Goto https://ifttt.com/create
  * Click This and choose Webhooks
  * 
  8  
https://ifttt.com/maker_webhooks