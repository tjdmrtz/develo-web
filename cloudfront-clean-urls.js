"use strict";

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith("/")) {
    request.uri += "index.html";
  } else if (!uri.split("/").pop().includes(".")) {
    uri += "/index.html";
    request.uri = uri;
  }

  return request;
}

if (typeof module !== "undefined") {
  module.exports = handler;
}
