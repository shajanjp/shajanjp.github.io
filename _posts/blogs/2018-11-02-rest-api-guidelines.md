---		
layout: blog
title: "REST API Guidelines"
thumbnail: "blogs/thumbnails/rest-api-guidelines.png"
summary: "Checklist for building REST APIs"
description: ""
tags: ["test", "tech"]
categories: ["blog"]
---

# REST API Guidelines
The API is like a language, for developers, so it should be easy to understand and should follow the grammar.

Main topics
 * [API Endpoints](#api-endpoints)
 * [HTTP Verbs](#http-verbs)
 * [HTTP Response Status Codes](#http-response-status-codes)
 * [Response Data](#response-data)
 * [Searching, sorting, filtering and pagination](#searching-sorting-filtering-and-pagination)
 * [Versions](#versions)
 * [API Examples](#api-examples)

## API Endpoints
The resources should always be plural in the API endpoint.
Each instance of the resource should have an unique ID, which can be passed in the URL to get the detail of the specific resource.


## HTTP Verbs
 * method `GET` on path */gardens* should get the list of all gardens
 * method `POST` on path */gardens* should create a new garden with given details
 * method `GET` on path */gardens/5* should get the detail of garden 5
 * method `PUT` on path */gardens/5* should update the detail of garden 5
 * method `DELETE` on path */gardens/5* should delete garden 5

likewise nested resources should be handled like
 * method `GET` on path */gardens/6/plants* should get the list of all plants in garden 6

<table class="ui table">
  <thead>
    <tr>
      <th>HTTP verb</th>
      <th>Action</th>
      <th>Collection</th>
      <th>Importance</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>GET</td><td>Fetch resource</td><td>*/collection* or */collection/:resourceId*</td><td>STRICT</td></tr>
    <tr><td>POST</td><td>Create resource</td><td>*/collection*</td><td>STRICT</td></tr>
    <tr><td>PUT</td><td>Update resource</td><td>*/collection/:resourceId*</td><td>STRICT</td></tr>
    <tr><td>DELETE</td><td>Remove resource</td><td>*/collection/:resourceId*</td><td>STRICT</td></tr>
    <tr><td>PATCH</td><td>Update resource</td><td>*/collection/:resourceId*</td><td>OPTIONAL</td></tr>
    <tr><td>OPTIONS</td><td>Supported resource methods</td><td>*/collection/:resourceId*</td><td>OPTIONAL</td></tr>
    <tr><td>CONNECT</td><td>Converts to TCP/IP</td><td>*/collection/:resourceId*</td><td>OPTIONAL</td></tr> 
  </tbody>
</table>

## HTTP Response Status Codes
HTTP response status codes helps the client to understand the status of the request, whether it failed, passed, the request was wrong or even the API is not available. There are number of standardized codes.
These can be broadly divided into 5 categories :

<table class="ui table">
  <thead>
    <tr><th>Code</th><th>Summary</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>1xx</td><td>Informational</td><td>It means the request has been received and the process is continuing.</td></tr>
    <tr><td>2xx</td><td>Success</td><td>It means the action was successfully received, understood, and accepted.</td></tr>
    <tr><td>3xx</td><td>Redirection</td><td>It means further action must be taken in order to complete the request.</td></tr>
    <tr><td>4xx</td><td>Client Error</td><td>It means the request contains incorrect syntax or cannot be fulfilled.</td></tr>
    <tr><td>5xx</td><td>Server Error</td><td>It means the server failed to fulfill an apparently valid request.</td></tr>
  </tbody>
</table>


The following are the important categorization of HTTP codes:
<table class="ui table">
  <thead>
    <tr><th>Code</th><th>Summary</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>200</td><td>OK</td><td>Everything is working</td></tr>
    <tr><td>201</td><td>CREATED</td><td>New resource has been created</td></tr>
    <tr><td>204</td><td>NO CONTENT</td><td>The resource was successfully deleted, no response body</td></tr>
    <tr><td>304</td><td>NOT MODIFIED</td><td>The date returned is cached data (data has not changed)</td></tr>
    <tr><td>400</td><td>BAD REQUEST</td><td>The request was invalid or cannot be served. The exact error should be explained in the error payload. Eg The REQUEST BODY is not valid .</td></tr>
    <tr><td>401</td><td>UNATHORIZED</td><td>The request requires user authentication.</td></tr>
    <tr><td>403</td><td>FORBIDDEN</td><td>The server understood the request, but is refusing it or the access is not allowed.</td></tr>
    <tr><td>404</td><td>NOT FOUND</td><td>There is no resource behind the URI.</td></tr>
    <tr><td>410</td><td>GONE</td><td>Gone indicates that the requested resource is no longer available which has been intentionally moved.</td></tr>
    <tr><td>500</td><td>INTERNAL SERVER ERROR</td><td>API developers should avoid this error. If an error occurs in the global catch blog, the stack trace should be logged and not returned as response.</td></tr>
    <tr><td>503</td><td>SERVICE UNAVAILABLE </td><td>Service Unavailable indicates that the server is down or unavailable to receive and process the request. Mostly if the server is undergoing maintenance</td></tr>
  </tbody>
</table>

## Response Data
Any casing convention is fine, but make sure it is consistent across the application. If the request body or response type is JSON then please follow camelCase to maintain the consistency.
https://google.github.io/styleguide/jsoncstyleguide.xml

## Searching, sorting, filtering and pagination
<table class="ui table">
  <thead>
    <tr><th>Action</th><th>Query</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>sort</td><td>*/cats?sort=weight*</td><td>sort the cats by its weight in ascending order.</td></tr>
    <tr><td>search</td><td>*/cats?search=kitty*</td><td>returns the cats having name kitty.</td></tr>
    <tr><td>filter</td><td>*/companies?height=5&weight=1.5*</td><td></td></tr>
    <tr><td>limit</td><td>*/cats?limit=10*</td><td>returns only first 10 cats</td></tr>
    <tr><td>skip</td><td>*/cats?skip=5*</td><td>skips first 5 cats</td></tr>
    <tr><td>pagination</td><td>*/cats?limit=10&skip=5*</td><td>skips first 5 cats and returns next 10</td></tr>
  </tbody>
</table>

## Versions

APIs are not intended to be changed often.
But critical and feature upgrades are always appreciated. Given the new APIs should not lead to break the existing products or services using your APIs.
**http://api.example.com/v1/cats/1** is a good example, which has the version number of the API in the path. If there is any major breaking update, we can name the new set of APIs as v2 or v1.x.x

## API Examples

* `GET` */cats*
  > List cats

  Status Code : 200
  <pre class="prettyprint lang-json">
  [
    {
      "id":1,
      "fullName": "Kitty"
    },
    {
      "id":1,
      "fullName": "Blue"
    },
    {
      "id":1,
      "fullName": "Little kitty"
    }
  ]    
  </pre>
 
* `POST` */cats*
  > Create cat

  Status Code : 201
  ```json
  {}
  ```


* `GET` */cats/1*
  > Get cat detail

  Status Code : 200
  ```json
  {
    "id":1,
    "fullName": "Kitty"
  }

  ```


* `PUT` */cats/1*
  > Update cat detail

  Status Code : 200
  ```json
  {}

  ```

* `DELETE` */cats/1*
  > Remove cat

  Status Code : 200
  ```json
  {}

  ```