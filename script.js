const quiz = document.getElementById("quiz");
const submitBtn = document.getElementById("submit-btn");
const restartBtn = document.getElementById("restart-btn");
const result = document.getElementById("result");

const API_URL = "https://opentdb.com/api.php?amount=10&type=multiple";

let questions = [];
async function fetchQuestions() {
    quiz.innerHTML = "<p>Loading questions...</p>";
    result.innerHTML = "";
    restartBtn.style.display = "none";
    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch questions");
        }

        const data = await response.json();

        if (data.response_code !== 0) {
            throw new Error("Questions could not be fetched");
        }

        questions = data.results;

        displayQuestions();

    } catch (error) {

        quiz.innerHTML = `
            <p class="error-message">
                Failed to load questions. Please try again.
            </p>
        `;

        console.log(error);
    }
}

function displayQuestions() {
    quiz.innerHTML = "";

    questions.forEach((question, index) => {

        const questionCard = document.createElement("div");
        questionCard.classList.add("question-card");

        const questionHeading = document.createElement("h3");
        questionHeading.textContent =
            `${index + 1}. ${decodeHTML(question.question)}`;

        questionCard.appendChild(questionHeading);

        const options = [
            question.correct_answer,
            ...question.incorrect_answers
        ]

        options.sort(() => Math.random() - 0.5);

        options.forEach((option) => {

            const label = document.createElement("label");
            label.classList.add("option");
            const radio = document.createElement("input");

            radio.type = "radio";
            radio.name = `question-${index}`;
            radio.value = option;

            label.appendChild(radio);

            label.appendChild(
                document.createTextNode(" " + decodeHTML(option))
            );

            questionCard.appendChild(label);
        });

        quiz.appendChild(questionCard);
    });
}

submitBtn.addEventListener("click", function () {

    let score = 0;

    questions.forEach((question, index) => {

        const selectedOption = document.querySelector(
            `input[name="question-${index}"]:checked`
        );

        const allOptions = document.querySelectorAll(
            `input[name="question-${index}"]`
        );

        if (selectedOption) {
            if (
                selectedOption.value ===
                question.correct_answer
            ) {
                score++;
                selectedOption.parentElement.classList.add("correct");
            } else {
                selectedOption.parentElement.classList.add("incorrect");
                allOptions.forEach((option) => {
                    if (
                        option.value ===
                        question.correct_answer
                    ) {

                        option.parentElement.classList.add("correct");
                    }
                });
            }
        } else {
            allOptions.forEach((option) => {
                if (
                    option.value ===
                    question.correct_answer
                ) {

                    option.parentElement.classList.add("correct");
                }
            });
        }
    });

    result.innerHTML =
        `Your Score: ${score}/${questions.length}`;
    restartBtn.style.display = "block";
});
restartBtn.addEventListener("click", function () {

    fetchQuestions();

});

function decodeHTML(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
}
fetchQuestions();