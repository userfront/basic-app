const fs = require("fs");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function getPage(pageName) {
  return new Promise(resolve => {
    fs.readFile("./pages/" + pageName + ".html", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.send("Problem loading page");
      }

      // Replace project ID or default to demo project
      const result = data.replace(
        /PROJECT_ID/g,
        app.locals.projectId || "g48xypb9"
      );
      resolve(result);
    });
  });
}

// Set local variables
app.use(function(req, res, next) {
  app.locals.isLocal = req.hostname.indexOf("userfront.dev") < 0;
  app.locals.projectId = req.subdomains[0] || "";
  next();
});

app.get("/", (req, res) => {
  // If the server is running locally or has a project ID,
  // serve the landing page. Otherwise serve the index page.
  let fileToSend;
  if (app.locals.isLocal || app.locals.projectId) {
    fileToSend = "./pages/landing.html";
  } else {
    fileToSend = "./pages/index.html";
  }

  fs.readFile(fileToSend, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.send("Problem loading page");
    }
    res.send(data);
  });
});

app.get("/signup", async (req, res) => {
  const page = await getPage("signup");
  res.send(page);
});

app.get("/login", async (req, res) => {
  const page = await getPage("login");
  res.send(page);
});

app.get("/reset", async (req, res) => {
  const page = await getPage("reset");
  res.send(page);
});

app.get("/dashboard", async (req, res) => {
  // Redirect if the auth.${projectId} header is not present
  console.log(req.cookies);
  console.log(`auth.${app.locals.projectId}`);
  console.log(req.cookies[`auth.${app.locals.projectId}`]);
  if (!app.locals.projectId || !req.cookies[`auth.${app.locals.projectId}`]) {
    return res.redirect("/?message=Log in to access the dashboard");
  }
  const page = await getPage("dashboard");
  res.send(page);
});

// Create server
const http = require("http");
const port = process.env.PORT || "3333";
app.set("port", port);
const server = http.createServer(app);
server.listen(port, () => {
  console.log("Server running on port %s", port);
});
