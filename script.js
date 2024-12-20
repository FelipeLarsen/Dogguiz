const RANDOM_IMG_ENDPOINT = "https://dog.ceo/api/breeds/image/random";

const BREEDS = ["affenpinscher", "african", "airedale", "akita", "appenzeller", "shepherd australian", "basenji", "beagle", "bluetick", "borzoi", "bouvier", "boxer", "brabancon", "briard", "norwegian buhund", "boston bulldog", "english bulldog", "french bulldog", "staffordshire bullterrier", "australian cattledog", "chihuahua", "chow", "clumber", "cockapoo", "border collie", "coonhound", "cardigan corgi", "cotondetulear", "dachshund", "dalmatian", "great dane", "scottish deerhound", "dhole", "dingo", "doberman", "norwegian elkhound", "entlebucher", "eskimo", "lapphund finnish", "bichon frise", "germanshepherd", "italian greyhound", "groenendael", "havanese", "afghan hound", "basset hound", "blood hound", "english hound", "ibizan hound", "plott hound", "walker hound", "husky", "keeshond", "kelpie", "komondor", "kuvasz", "labradoodle", "labrador", "leonberg", "lhasa", "malamute", "malinois", "maltese", "bull mastiff", "english mastiff", "tibetan mastiff", "mexicanhairless", "mix", "bernese mountain", "swiss mountain", "newfoundland", "otterhound", "caucasian ovcharka", "papillon", "pekinese", "pembroke", "miniature pinscher", "pitbull", "german pointer", "germanlonghair pointer", "pomeranian", "medium poodle", "miniature poodle", "standard poodle", "toy poodle", "pug", "puggle", "pyrenees", "redbone", "chesapeake retriever", "curly retriever", "flatcoated retriever", "golden retriever", "rhodesian ridgeback", "rottweiler", "saluki", "samoyed", "schipperke", "giant schnauzer", "miniature schnauzer", "english setter", "gordon setter", "irish setter", "sharpei", "english sheepdog", "shetland sheepdog", "shiba", "shihtzu", "blenheim spaniel", "brittany spaniel", "cocker spaniel", "irish spaniel", "japanese spaniel", "sussex spaniel", "welsh spaniel", "english springer", "stbernard", "american terrier", "australian terrier", "bedlington terrier", "border terrier", "cairn terrier", "dandie terrier", "fox terrier", "irish terrier", "kerryblue terrier", "lakeland terrier", "norfolk terrier", "norwich terrier", "patterdale terrier", "russell terrier", "scottish terrier", "sealyham terrier", "silky terrier", "tibetan terrier", "toy terrier", "welsh terrier", "westhighland terrier", "wheaten terrier", "yorkshire terrier", "tervuren", "vizsla", "spanish waterdog", "weimaraner", "whippet", "irish wolfhound"];

function getRandomElement(array) {
    const i = Math.floor(Math.random() * array.length);
    return array[i];
}

function shuffleArray(array) {
    return array.sort((a, b) => Math.random() - 0.5);
}

function getMultipleChoices(n, correctAnswer, array) {
    const choices = [correctAnswer];
    while (choices.length < n) {
        let candidate = getRandomElement(array);
        if (choices.indexOf(candidate) < 0) {
            choices.push(candidate);
        }
    }
    return shuffleArray(choices);
}

function getBreedFromURL(url) {
    const [, path] = url.split("/breeds/");
    const [breedID] = path.split("/");
    const [breed, subtype] = breedID.split("-");
    return [subtype, breed].join(" ");
}

async function fetchMessage(url) {
    const response = await fetch(url);
    const { message } = await response.json();
    return message;
}

function renderButtons(choicesArray, correctAnswer) {
    function buttonHandler(e) {
        const buttons = document.querySelectorAll("#options button");
        buttons.forEach(button => {
            button.disabled = true;
        });

        if (e.target.value === correctAnswer) {
            e.target.classList.add("correct");
        } else {
            e.target.classList.add("incorrect");
            document.querySelector(`button[value="${correctAnswer}"]`).classList.add("correct");
        }

        setTimeout(async () => {
            const [newImageUrl, newCorrectAnswer, newChoices] = await loadQuizData();
            renderQuiz(newImageUrl, newCorrectAnswer, newChoices);
        }, 2000);
    }

    const options = document.getElementById("options");
    options.replaceChildren();

    choicesArray.map(choice => {
        let button = document.createElement("button");
        button.value = button.name = button.textContent = choice;
        button.addEventListener("click", buttonHandler);
        options.appendChild(button);
    });
}

function renderQuiz(imgUrl, correctAnswer, choices) {
    const image = document.createElement("img");
    image.setAttribute("src", imgUrl);
    const frame = document.getElementById("image-frame");

    image.addEventListener("load", () => {
        frame.replaceChildren(image);
        renderButtons(choices, correctAnswer);
    })
}

async function loadQuizData() {
    document.getElementById("image-frame").textContent = "Wait...";

    const doggoImgUrl = await fetchMessage(RANDOM_IMG_ENDPOINT);
    const correctBreed = getBreedFromURL(doggoImgUrl);
    const breedChoices = getMultipleChoices(3, correctBreed, BREEDS);

    return [doggoImgUrl, correctBreed, breedChoices];
}

const [imageUrl, correctAnswer, choices] = await loadQuizData();
renderQuiz(imageUrl, correctAnswer, choices);
