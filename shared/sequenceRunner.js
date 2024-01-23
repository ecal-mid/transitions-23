async function loadIframe(url, target) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.addEventListener("load", (ev) => {
      resolve(iframe);
    });
    target.appendChild(iframe);
  });
}

export class SequenceRunner extends EventTarget {

  sequencesFiltered;
  currentFilter;
  currentSequence;
  preloadedSequence;
  main;

  constructor(sequences) {

    super()

    this.main = document.querySelector("main");
    this.sequences = sequences

    this.setFilter(undefined)

    window.addEventListener(
      "message",
      async (event) => {
        if (event.data === "finished") {
          this.activatePreloaded();
        }
      },
      false
    );
  }



  show(isVisible) {

    this.main.style.visibility = isVisible ? "visible" : "hidden";
  }

  async activatePreloaded() {


    if (this.currentSequence) {
      this.main.removeChild(this.currentSequence.iframe);
      this.currentSequence = undefined
    }

    this.currentSequence = this.preloadedSequence
    this.preloadedSequence = undefined
    console.log("activate sequence", this.currentSequence)

    this.dispatchEvent(new CustomEvent("sequencechanged", { detail: this.sequencesFiltered[this.currentSequence.sequenceId] }))

    if (this.currentSequence) {
      this.currentSequence.iframe.style = "z-index:99";
    }

    const nextSequenceId = selectNextSequenceId(
      this.currentSequence ? this.sequencesFiltered[this.currentSequence.sequenceId].end : undefined,
      this.sequencesFiltered
    );

    this.preload(nextSequenceId)
  }

  async preload(sequenceIdToLoad) {

    if (this.preloadedSequence) {
      throw "preload called while already preloading"
    }

    //console.log("preloading", sequenceIdToLoad)
    const iframe = await loadIframe(this.sequencesFiltered[sequenceIdToLoad].url, this.main)
    iframe.style = "z-index:-99";

    this.preloadedSequence = {
      sequenceId: sequenceIdToLoad,
      iframe: iframe,
    };
  }

  async setFilter(filter) {
    console.log("set filter", filter)

    this.currentFilter = filter
    this.sequencesFiltered = this.sequences.filter((seq) => this.currentFilter == undefined || seq.student === this.currentFilter)

    this.clear()
  }

  clear() {

    if (this.currentSequence) {
      if (this.currentSequence.iframe)
        this.main.removeChild(this.currentSequence.iframe);
      this.currentSequence = undefined
    }
    if (this.preloadedSequence) {
      if (this.preloadedSequence.iframe)
        this.main.removeChild(this.preloadedSequence.iframe);
      this.preloadedSequence = undefined
    }

  }

  async restart() {

    const sequenceId = this.currentFilter ? 0 : Math.floor(Math.random() * this.sequencesFiltered.length)
    await this.preload(sequenceId)

    this.activatePreloaded()

    this.show(true)
  }

  getCurrentSequenceId() {
    return this.currentSequence ? this.currentSequence.sequenceId : -1
  }
}


function selectNextSequenceId(endShape, urls) {
  const matchingSequences = urls
    .map((seq, index) => ({ seq, index })) // Map each sequence to an object with the sequence and its index
    .filter(({ seq }) => {
      // Filter based on the endShape and, if currentStudent is provided, also filter by student name
      return (
        seq.begin === endShape
      );
    });

  if (matchingSequences.length > 0) {
    const randomIndex = Math.floor(Math.random() * matchingSequences.length);
    return matchingSequences[randomIndex].index; // Return the index of the selected sequence
  }

  return 0; // Return 0 if no matching sequence is found
}

/**
 * This tells the sequence runner (which has the sketch loaded as an iframe) that this sketch is finished. The next sketch will be activated.
 */
export function sendSequenceNextSignal() {
  console.log("sketch finished, starting the next one.");
  window.parent.postMessage("finished", "*");
}

export async function loadSequenceMetadata(urls) {
  let sequenceData = await Promise.all(
    urls.map(async (url) => {
      const infoUrl = url + "/info.json";
      try {
        const response = await fetch(infoUrl);
        const data = await response.json();
        return Object.assign(
          {},
          {
            url: url,
          },
          data
        );
      } catch (e) { }
    })
  );
  sequenceData = sequenceData.filter((o) => o !== undefined);

  return sequenceData;
}

