


document.addEventListener('touchstart', async () => {

    await getAudioContext().resume() // fix audio on iOS

}, { capture: true }); // add a dummy listener to fix touch in iframes on iOS

