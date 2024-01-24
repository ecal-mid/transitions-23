
export function initMenu(sequencePlayer) {

    const menu = document.getElementById("menu");

    document.querySelectorAll("[data-toggle-menu]").forEach(el => el.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    }))

    // on li with class student click filter the sequence
    menu.addEventListener("click", (e) => {
        if (e.target.classList.contains("student")) {

            menu.classList.toggle("hidden");
            const filter = e.target.getAttribute("student-name")

            sequencePlayer.setFilter(filter === "random" ? undefined : filter)
            sequencePlayer.restart()

            showFilter()
        }

    });

    function showFilter() {

        // if current student highlight the li
        document
            .querySelectorAll(".student")
            .forEach((link) =>
                link.classList.toggle(
                    "selected",
                    link.getAttribute("student-name") === sequencePlayer.currentFilter ||
                    (link.getAttribute("student-name") === "random" && sequencePlayer.currentFilter === undefined)
                )
            );
    }



    // Fill menu
    const studentNames = sequencePlayer.sequences
        .map((item) => item.student)
        .filter((value, index, self) => self.indexOf(value) === index);

    const liElements = studentNames.map(
        (name) => `<li class="student link" student-name="${name}">${name}</li>`
    );
    const ulInnerHTML = liElements.join("");

    // get div with id inside menu div
    const studentList = document.getElementById("studentList");
    studentList.innerHTML = `<ul><li class="student link selected" student-name="random">Random</li>${ulInnerHTML}</ul>`;


    showFilter()

}


let transition;
export function initTransitionUI(sequencePlayer) {


    const index = document.getElementById("index");
    const studentName = document.getElementById("studentName");
    sequencePlayer.addEventListener("sequencechanged", (e) => {

        if (sequencePlayer.currentFilter === undefined) {
            studentName.innerHTML = e.detail.student;
            studentName.style.opacity = "1";
        } else {
            studentName.innerHTML = "";
            studentName.style.opacity = "0";
        }

        index.innerHTML = `<div class="link">${sequencePlayer.getCurrentSequenceId() + 1}/${sequencePlayer.sequencesFiltered.length
            }</div>`;

        //set timeout to fade out studentName
        clearTimeout(transition);

        transition = setTimeout(() => {
            studentName.style.opacity = "0";
        }, 3000);
    })



}