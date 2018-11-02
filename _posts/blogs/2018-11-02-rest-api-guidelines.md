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

| HTTP verb | Action | Collection | Importance |
|:--- |:---|:---|:-- |
| GET | Fetch resource | */collection* or */collection/:resourceId* | STRICT |
| POST | Create resource | */collection* | STRICT |
| PUT | Update resource | */collection/:resourceId* | STRICT |
| DELETE | Remove resource | */collection/:resourceId* | STRICT |
| PATCH | Update resource | */collection/:resourceId* | OPTIONAL |
| OPTIONS | Supported resource methods | */collection/:resourceId* | OPTIONAL |
| CONNECT | Converts to TCP/IP | */collection/:resourceId* | OPTIONAL | 

## HTTP Response Status Codes
HTTP response status codes helps the client to understand the status of the request, whether it failed, passed, the request was wrong or even the API is not available. There are number of standardized codes.
These can be broadly divided into 5 categories :

| Code | Summary | Description |
|:-- |:-- |:-- |
| 1xx | Informational | It means the request has been received and the process is continuing. |
| 2xx | Success | It means the action was successfully received, understood, and accepted. |
| 3xx | Redirection | It means further action must be taken in order to complete the request. |
| 4xx | Client Error | It means the request contains incorrect syntax or cannot be fulfilled. |
| 5xx | Server Error | It means the server failed to fulfill an apparently valid request. |


The following are the important categorization of HTTP codes:

| Code | Summary | Description |
|:-- |:-- |:--|
| 200 | OK | Everything is working |
| 201 | CREATED | New resource has been created |
| 204 | NO CONTENT | The resource was successfully deleted, no response body |
| 304 | NOT MODIFIED | The date returned is cached data (data has not changed) |
| 400 | BAD REQUEST | The request was invalid or cannot be served. The exact error should be explained in the error payload. Eg The REQUEST BODY is not valid . |
| 401 | UNATHORIZED | The request requires user authentication. |
| 403 | FORBIDDEN | The server understood the request, but is refusing it or the access is not allowed. |
| 404 | NOT FOUND | There is no resource behind the URI. |
| 410 | GONE | Gone indicates that the requested resource is no longer available which has been intentionally moved. |
| 500 | INTERNAL SERVER ERROR | API developers should avoid this error. If an error occurs in the global catch blog, the stack trace should be logged and not returned as response. |
| 503 | SERVICE UNAVAILABLE  | Service Unavailable indicates that the server is down or unavailable to receive and process the request. Mostly if the server is undergoing maintenance |

## Response Data
Any casing convention is fine, but make sure it is consistent across the application. If the request body or response type is JSON then please follow camelCase to maintain the consistency.
https://google.github.io/styleguide/jsoncstyleguide.xml

## Searching, sorting, filtering and pagination

| Action | Query | Description |
|:-- |:-- |:-- |
| sort | */cats?sort=weight* | sort the cats by its weight in ascending order. |
| search | */cats?search=kitty* | returns the cats having name kitty. |
| filter | */companies?height=5&weight=1.5* |  |
| limit | */cats?limit=10* | returns only first 10 cats |
| skip | */cats?skip=5* | skips first 5 cats |
| pagination | */cats?limit=10&skip=5* | skips first 5 cats and returns next 10 |

## Versions

APIs are not intended to be changed often.
But critical and feature upgrades are always appreciated. Given the new APIs should not lead to break the existing products or services using your APIs.
**http://api.example.com/v1/cats/1** is a good example, which has the version number of the API in the path. If there is any major breaking update, we can name the new set of APIs as v2 or v1.x.x

## API Examples

* `GET` */cats*
  > List cats

  Status Code : 200
  ```json
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
  ```

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