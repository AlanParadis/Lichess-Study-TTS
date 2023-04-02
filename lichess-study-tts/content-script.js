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

  const listenButton = document.createElement('button');
  listenButton.textContent = '🔊';
  listenButton.style.cssText = 'margin: 10px 42% 10px 42%; padding: 5px; text-align: center; border: solid; border-radius: 5px;';
  listenButton.classList.add('listen-tts');
  commentDiv.appendChild(listenButton);

  listenButton.addEventListener('click', () => {
    const commentText = commentElement.innerText;
    const utterance = new SpeechSynthesisUtterance(commentText);

    chrome.storage.local.get('ttsVoice', (data) => {
      if (data.ttsVoice) {
        const selectedVoice = speechSynthesis.getVoices().find(voice => voice.name === data.ttsVoice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
	  if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
	  else
	  {
		speechSynthesis.speak(utterance);
	  }
    });
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
