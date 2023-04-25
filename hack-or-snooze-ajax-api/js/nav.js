
"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */


/** Show main list of all stories when click site name */
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//Shows the new story submission form when 'Submit' is clicked in the navbar 
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $newStoryForm.show();
}

// Event listener to the 'submit' button in the nav bar
$("#nav-submit").on("click", navSubmitClick);

// Displays the user's favorite stories
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  evt.preventDefault();
  hidePageComponents();
  putFavoritesOnPage();
}
$("#nav-favorite").on("click", navFavoritesClick);

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $("#favorited-stories-list").empty();

  if (currentUser) {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $("#favorited-stories-list").append($story);
    }
  }

  $("#favorited-stories-list").show();
}

// Show the user's stories when 'my stories' is clicked in the nav bar
async function navMyStoriesClicked(evt) {
  evt.preventDefault();
  hidePageComponents();
  if (currentUser) {
    putUserStoriesOnPage();
  } else {
    $loginForm.slideToggle();
  }
}

$("#nav-my-stories").on("click", navMyStoriesClicked);