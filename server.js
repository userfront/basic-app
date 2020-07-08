const fs = require("fs");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const projectId = "demo1234";

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set local variables
app.use(function (req, res, next) {
  app.locals.isLocal = req.hostname.indexOf("userfront.dev") < 0;
  app.locals.projectId = req.subdomains[0] || projectId;
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
    res.send(replaceProjectId(data));
  });
});

app.get("/signup", async (req, res) => {
  fs.readFile("./pages/signup.html", "utf8", (err, data) => {
    if (err) return res.send("Problem loading page");
    res.send(replaceProjectId(data));
  });
});

app.get("/login", async (req, res) => {
  fs.readFile("./pages/login.html", "utf8", (err, data) => {
    if (err) return res.send("Problem loading page");
    res.send(replaceProjectId(data));
  });
});

app.get("/reset", async (req, res) => {
  fs.readFile("./pages/reset.html", "utf8", (err, data) => {
    if (err) return res.send("Problem loading page");
    res.send(replaceProjectId(data));
  });
});

app.get("/dashboard", async (req, res) => {
  // Redirect if the auth.${projectId} header is not present
  if (!req.cookies[`auth.${app.locals.projectId}`]) {
    return res.redirect("/login");
  }

  fs.readFile("./pages/dashboard.html", "utf8", (err, data) => {
    if (err) return res.send("Problem loading page");
    res.send(replaceProjectId(data));
  });
});

function replaceProjectId(page) {
  return page.replace(/PROJECT_ID/g, app.locals.projectId);
}

// Create server
const http = require("http");
const port = process.env.PORT || "3333";
app.set("port", port);
const server = http.createServer(app);
server.listen(port, () => {
  console.log("Server running on port %s", port);
});
