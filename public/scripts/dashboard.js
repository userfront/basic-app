/**
 * Make an API call to get the user information, then either insert
 * it into the DOM, or show that the user is not logged in.
 */
Userfront.ready(function () {
  if (Userfront.accessToken()) {
    showLoggedIn(Userfront.user);
  } else {
    showLoggedOut();
  }
});

/**
 * Request the user's information from the Userfront API.
 * Most of this information can be found by reading the ID token instead,
 * but we are showing an API call here for demonstration.
 */

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

  // Add access token info
  var accessTokenInfo = jwt_decode(Userfront.accessToken());
  document.getElementById("access-token-display").innerText = JSON.stringify(
    accessTokenInfo,
    null,
    2
  );

  // Show card
  document.getElementById("logged-in").style.display = "block";
}

function showLoggedOut() {
  document.getElementById("logged-out").style.display = "block";
}
