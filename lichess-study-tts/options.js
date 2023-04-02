function saveOptions() {
  const selectedVoice = document.getElementById('voiceSelect').value;
  const autoRead = document.getElementById('autoReadToggle').checked;
  chrome.storage.local.set({ ttsVoice: selectedVoice, autoRead: autoRead }, () => {
    console.log('TTS voice saved:', selectedVoice);
    console.log('Auto read saved:', autoRead);
  });
}

function loadOptions() {
  chrome.storage.local.get(['ttsVoice', 'autoRead'], (data) => {
    if (data.ttsVoice) {
      document.getElementById('voiceSelect').value = data.ttsVoice;
    }
    if (data.autoRead !== undefined) {
      document.getElementById('autoReadToggle').checked = data.autoRead;
    }
  });
}

function populateVoiceList() {
  const voiceSelect = document.getElementById('voiceSelect');
  const voices = speechSynthesis.getVoices();

  voices.forEach((voice) => {
    const option = document.createElement('option');
    option.textContent = voice.name;
    option.value = voice.name;
    voiceSelect.appendChild(option);
  });

  loadOptions();
}

speechSynthesis.onvoiceschanged = populateVoiceList;

if (speechSynthesis.getVoices().length > 0) {
  populateVoiceList();
}

document.getElementById('voiceSelect').addEventListener('change', saveOptions);
document.getElementById('autoReadToggle').addEventListener('change', saveOptions);

