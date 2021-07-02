const fs = require("fs");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const accountId = "demo1234";

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set local variables
app.use(function (req, res, next) {
  const subdomainParts = (req.subdomains[0] || "").split("-");
  const subdomainId = subdomainParts[subdomainParts.length - 1];
  app.locals.accountId = subdomainId || accountId;
  const hostname = req.hostname || "";
  app.locals.isLocal = !hostname.includes("userfront.dev");
  app.locals.showHeader = !hostname.startsWith("live-") && !hostname.startsWith("test-");
  app.locals.scriptVersion = hostname.includes("vtest-") ? "vtest" : "toolkit";
  next();
});

app.get("/", (req, res) => {
  // Show the landing page (index.html), unless the site is
  // userfront.dev, in which case show the start page.
  let fileToSend = "./pages/index.html";
  if (req.hostname === "userfront.dev") {
    fileToSend = "./pages/start.html";
  }

  fs.readFile(fileToSend, "utf8", (err, data) => {
    if (err) return res.send("Problem loading page");
    res.send(buildPage(data));
  });
});

app.get("/signup", async (req, res) => {
  fs.readFile("./pages/signup.html", "utf8", (err, data) => {
    if (err) return res.send("Problem loading page");
    res.send(buildPage(data));
  });
});

app.get("/login", async (req, res) => {
  fs.readFile("./pages/login.html", "utf8", (err, data) => {
    if (err) return res.send("Problem loading page");
    res.send(buildPage(data));
  });
});

app.get("/reset", async (req, res) => {
  fs.readFile("./pages/reset.html", "utf8", (err, data) => {
    if (err) return res.send("Problem loading page");
    res.send(buildPage(data));
  });
});

app.get("/dashboard", async (req, res) => {
  fs.readFile("./pages/dashboard.html", "utf8", (err, data) => {
    if (err) return res.send("Problem loading page");
    res.send(buildPage(data));
  });
});

app.get("/iframe/:toolId", async (req, res) => {
  fs.readFile("./pages/iframe.html", "utf8", (err, data) => {
    if (err) return res.send("Problem loading page");
    const page = buildPage(data);
    res.send(page.replace(/TOOL_ID/, `userfront-${req.params.toolId}`));
  });
});

function buildPage(page) {
  return page
    .replace(/ACCOUNT_ID/g, app.locals.accountId)
    .replace(/SCRIPT_VERSION/g, app.locals.scriptVersion)
    .replace(/header-display/g, `header-${app.locals.showHeader}`);
}

// Create server
const http = require("http");
const port = process.env.PORT || "3333";
app.set("port", port);
const server = http.createServer(app);
server.listen(port, () => {
  console.log("Server running on port %s", port);
});
