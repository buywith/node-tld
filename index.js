"use strict";

var url = require('url');

var parse_url = function (remote_url) {
  if (typeof remote_url == "string")
    remote_url = url.parse(remote_url);

  // support ips and localhost
  if (remote_url.hostname === 'localhost' || /[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/.test(remote_url.hostname)) {
    return {
      tld: '',
      domain: remote_url.hostname,
      sub: '',
    };
  } else {
    return parse_host(remote_url.hostname);
  }
};

var tlds = {
  "com": 1,
  "au": 1,
  "com.au": 2,
  "me": 1,
  "br": 1,
  "com.br": 2,
  "il": 1,
  "co.il": 2,
  "myshopify.com": 2,
  "uk": 1,
  "co.uk": 2,
}

var parse_host = function (host) {
  var parts = host.split(".");
  var stack = "", tld_level = 1; //unknown tld are 1st level
  for (var i = parts.length - 1, part; i >= 0; i--) {
    part = parts[i];
    stack = stack ? part + "." + stack : part;

    if (!tlds[stack]) break;
    tld_level = tlds[stack];
  }

  if (parts.length <= tld_level)
    throw new Error("Invalid TLD");

  return {
    tld: parts.slice(-tld_level).join('.'),
    domain: parts.slice(-tld_level - 1).join('.'),
    sub: parts.slice(0, (-tld_level - 1)).join('.'),
  };
};

module.exports = parse_url;
module.exports.parse_host = parse_host;
