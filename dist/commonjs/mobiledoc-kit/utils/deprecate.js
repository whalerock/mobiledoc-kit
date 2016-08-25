"use strict";

exports["default"] = deprecate;

function deprecate(message) {
  console.log("[mobiledoc-kit] [DEPRECATED]: " + message); // jshint ignore:line
}