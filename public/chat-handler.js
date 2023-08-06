const chatContainer = document.getElementById("chat-content");
const messageInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-message");

// Function to add a message to the chat container
function addQuestion(message) {
  const messageElement = `
      <div class="media media-chat media-chat-reverse">
        <div class="media-body">
            <p>${message}</p>
        </div>
      </div>
  `;
  $("#chat-content").append(messageElement);
}

function addAnswer(message) {
  const messageElement = `<div class="media media-chat">
      <img class="avatar" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="..." />
      <div class="media-body">
        <p>${message}</p>
      </div>
    </div>`;
  $("#chat-content").append(messageElement);
}

// Function to handle user message submission
async function sendMessage() {
  const message = $(".user-input").val();
  addQuestion(message);

  // Send user message to the server
  const response = await fetch(`/chat?message=${encodeURIComponent(message)}`);
  const data = await response.text();

  addAnswer(data);

  $(".user-input").val("");
}

// Event listeners
$("#send-message").click(sendMessage);

$(".user-input").on("keydown", function (event) {
  if (event.which == 13) sendMessage();
});

$(document).keypress(function (event) {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == "13") {
    sendMessage();
  }
});
