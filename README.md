# Quix
This is a tool for indexing IMDB ratings by movie titles. There is also support for storing selected movies in a database, which is accessed through a personal account.

## Why
Primarily, i built this for that specific moment when you're trying to find a movie with a decent rating to watch with a group of people. You liked one of the titles, but the rest  didn't? Save to favourites, move on.

Additionally, I wanted to teach myself web technologies through starting _and finishing_ a personal project involving an api, css, html, js and database functionality.

## Tech
More specifically, this project used the following technologies:

#### The omdbAPI (http://www.omdbapi.com/)
As an introduction to API's, it was rather convienient to use. However, the documentation didn't consist of anything more than a few tables with parameter functionality and two query examples. As this was a first look at APIs in general, I resorted to experimenting with different parameter values and inspecting the object which the API call returned. This led to me having to reformat my structure once or twice. For example, once I realised one of the two indexing methods (by imdbID and query by title) contain different properties (such as rating, poster and cast), I restructred the information so that every search would gather a complete set of movie properties. This caused inefficiency (two api calls, although asynchronously) but seemed to be a necessary solution since every search required properties from both indexing methods.

#### HTML/CSS/JS
I purposefully decided to avoid any frameworks or libraries as learning the foundations of vanilla html/css/js is a much better first-step than going straight to React, for example. Once I learn a frameowork, this will allow me to better understand and utilize the frameworks for their strengths - in situations when they are advantageous.  I know have a much better grip on the languages, as well as their strengths and weaknesses. For example, generating html through js was an extremely verbose and awkward process. As far as I know, React also allows you to write HTML, CSS and JS in once place. This would be of use, since locating where I manipulated a certain element quickly got confusing when it was potentially handled in any of the three languages (and its subfolders, files, etc).

#### Firebase Realtime Database
