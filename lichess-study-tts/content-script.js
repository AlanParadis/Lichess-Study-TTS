function playTextToSpeech(commentElement) {
  const commentText = commentElement.innerText;
  const utterance = new SpeechSynthesisUtterance(commentText);

  chrome.storage.local.get('ttsVoice', (data) => {
    if (data.ttsVoice) {
      const selectedVoice = speechSynthesis.getVoices().find(voice => voice.name === data.ttsVoice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    speechSynthesis.speak(utterance);
  });
}


function readCommentText() {
  const commentDiv = document.querySelector('.analyse.variant-standard.has-players.gamebook-play .comment');
  if (!commentDiv) {
    console.warn('Comment element not found');
    return;
  }
  const commentElement = commentDiv.querySelector('.content');
  if (!commentElement) {
    console.warn('Comment element not found');
    return;
  }

  chrome.storage.local.get('autoRead', (data) => {
    if (data.autoRead) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      playTextToSpeech(commentElement);
    }
  });

  //check if button already exists
  if (commentDiv.querySelector('.listen-tts')) {
    return;
  }

  const listenButton = document.createElement('button');
  listenButton.textContent = '🔊';
  listenButton.style.cssText = 'margin: 10px 42% 10px 42%; padding: 5px; text-align: center; border: solid; border-radius: 5px;';
  listenButton.classList.add('listen-tts');
  commentDiv.appendChild(listenButton);

  listenButton.addEventListener('click', () => {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        return;
    }
    playTextToSpeech(commentElement);
  });

  const observer = new MutationObserver(() => {
    chrome.storage.local.get('autoRead', (data) => {
      if (data.autoRead) {
        if (speechSynthesis.speaking) {
          speechSynthesis.cancel();
        }
        listenButton.click();
      }
    });
  });

  observer.observe(commentElement, { childList: true, subtree: true });
}

readCommentText();

// Add another observer to watch for changes in the #main-wrap div
const mainWrap = document.querySelector('#main-wrap > main > div.gamebook');
if (mainWrap) {
  const mainWrapObserver = new MutationObserver((mutations) => {
    // Check for changes to the .analyse__board main-board div
    mutations.forEach((mutation) => {
      if (mutation.target.className == 'gamebook') {
        // read the comment
        // Delay the call to readCommentText by 1 second (1000 milliseconds)
        setTimeout(() => {
          readCommentText();
        }, 100);
      }
      });
    });

  mainWrapObserver.observe(mainWrap, { childList: true, subtree: true });
} else {
  console.warn('main-wrap element not found');
}