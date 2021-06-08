var tenantId = document
  .getElementById("Userfront-script")
  .innerHTML.split('", "https:')[0]
  .split('"Userfront", "')[1];

function startup() {
  console.log("Initialize for " + tenantId);
  try {
    Userfront.init(tenantId);
    console.log("Getting self");
    getSelf().then(function (user) {
      console.log("User", user);
      if (user && user.userId) {
        showLoggedIn(user);
      } else {
        showLoggedOut();
      }
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Make an API call to get the user information, then either insert
 * it into the DOM, or show that the user is not logged in.
 */
console.log("Running", Object.keys(window.Userfront));
window.Userfront.ready(startup);
console.log("ready", window.Userfront.ready);
console.log("rq", JSON.parse(JSON.stringify(window.Userfront.rq)));

/**
 * Request the user's information from the Userfront API.
 * Most of this information can be found by reading the ID token instead,
 * but we are showing an API call here for demonstration.
 */
function getSelf() {
  var accessToken = Userfront.accessToken();
  return axios
    .get("https://api.userfront.com/v0/self", {
      headers: {
        authorization: "Bearer " + accessToken,
      },
    })
    .then(function (res) {
      return res.data;
    })
    .catch(function (error) {
      return {};
    });
}

/**
 * Insert user information into the DOM
 * @param {Object} user
 */
function showLoggedIn(user) {
  // Set image
  document.querySelector("#logged-in img").src = user.image;

  // Set name
  document.getElementById("user-name").innerText = user.name;

  // Set email
  document.getElementById("user-email").innerText = user.email;

  // Set access token information
  var token = jwt_decode(Userfront.accessToken());

  // Set up display token
  var displayToken = {
    mode: token.mode,
    tenantId: token.tenantId,
    userId: token.userId,
    userUuid: token.userUuid,
    isConfirmed: token.isConfirmed,
    authorization: token.authorization,
  };

  // Add to card
  document.getElementById("access-token-display").innerText = JSON.stringify(displayToken, null, 2);

  // Show card
  document.getElementById("logged-in").style.display = "block";
}

function showLoggedOut() {
  document.getElementById("logged-out").style.display = "block";
}
