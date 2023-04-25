"use strict";

// Define  jQuery object for the "My Stories" list 
const $myStoriesList = $("#my-stories-list");

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
function generateStoryMarkup(story) {
  const hostName = story.getHostName();

  // Check if  current story is in list of favorites
  const isFavorite = currentUser && currentUser.favorites.some(s => s.storyId === story.storyId);

  // Determines whether to show the delete button -only visible for logged-in user who created the story
  const showDeleteButton = currentUser && currentUser.username === story.username;

  return $(`
      <li id="${story.storyId}">
        <i class="heart  ${isFavorite ? 'fas' : 'far'} fa-heart"></i>
        ${showDeleteButton ? '<i class="fas fa-trash-alt"></i>' : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Function submit a new story and displays it on the page
async function submitNewStory(evt) {
  evt.preventDefault();

  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  const newStory = await storyList.addStory(currentUser, { author, title, url });

  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
  $newStoryForm.slideUp("slow");
  $newStoryForm.trigger("reset");


  await getAndShowStoriesOnStart();
}

// Toggles a story's favorite status
function toggleStoryFavorite(evt) {
  const $tgt = $(evt.target);
  const storyId = $tgt.closest("li").attr("id");

  if ($tgt.hasClass("fas")) {
    currentUser.removeFavorite(storyId);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    currentUser.addFavorite(storyId);
    $tgt.closest("i").toggleClass("fas far");
  }
}

// Event listener to the "All Stories" list for favoriting/unfavoriting stories
$allStoriesList.on("click", ".heart", toggleStoryFavorite);

// Shows a user's own stories 
async function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $myStoriesList.empty();

  if (currentUser.ownStories.length === 0) {
    $myStoriesList.append("You haven't submitted any stories yet");
  } else {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story);
      $myStoriesList.append($story);
    }
  }

  $myStoriesList.show();
}

// Deletes story
async function deleteStory(evt) {
  const $tgt = $(evt.target);
  const storyId = $tgt.closest("li").attr("id");

  await storyList.deleteStory(currentUser, storyId);

  $tgt.closest("li").remove();
}

// Attach a click event listener to the delete button when the delete button is clicked, calls the deleteStory function
$myStoriesList.on("click", ".fa-trash-alt", deleteStory);