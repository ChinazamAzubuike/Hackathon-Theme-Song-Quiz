
function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        return calculateResult();
    }

    const questionElement = document.getElementById("question");
    const answerDiv = document.getElementById("answer");

    // fade-out effect
    questionElement.style.opacity = "0";
    answerDiv.style.opacity = "0";

    setTimeout(() => {
        // Change the content
        const questionData = questions[currentQuestionIndex];
        questionElement.innerText = questionData.question;
        answerDiv.innerHTML = "";

        
        Object.keys(questionData.answers).forEach(answer => {
            let button = document.createElement("button");
            button.innerText = answer;
            button.classList.add("answer-button"); // Adding class for CSS styling
            button.onclick = () => storeAnswer(questionData.answers[answer]);
            answerDiv.appendChild(button);
        });

        //  fade-in effect
        questionElement.style.opacity = "1";
        answerDiv.style.opacity = "1";
    }, 300); // Delay before content change (300ms for smooth transition)
}



// quiz questions defined manually
const questions = [
    {
        question: "How do you feel when you wake up in the morning?",
        answers: {
            "Happy!": "happy",
            "Sad": "sad",
            "Annoyed": "angry",
            "Energetic": "unstoppable",
            "Tired": "tired",
            "Nothing": "mysterious",
            "Depends": "normal"
           
        }
    },

    {
        question: "Do you workout often?",
        answers: {
            "Yes, every day!": ["energetic"],
            "Most days a week.": ["energetic"],
            "Sometimes": ["normal"],
            "Not really": ["lazy"],
            "Never": ["tired", "lazy"]
        }
    },


    {
        question: "How do you travel to short distances most of the time?",
        answers: {
            "I usually walk/run everywhere I go!": ["energetic"],
            "I ride a bike.": ["energetic"],
            "I usually take a car/taxi/bus/motorbike": ["lazy"],
            "Others (e.g. skateboard, rollerskates, ": ["tired", "lazy"]
        }
    },



    {
        question: "Do you run out of breath easily?",
        answers: {
            "Yes, that sounds exactly like me!": ["tired", "lazy"],
            "Depends what I'm doing.": ["normal"],
            "Not really.": ["energetic"],
            "No, I've got great stamina!": ["energetic"]
        }
    },



    {
        question: "How do you feel when you have a minor mishap (e.g., drop something, spill liquid, stub your toe, etc)?",
        answers: {
            "I just laugh it off!": ["happy"],
            "Just brush it off and move on. It isn't that deep.": ["mysterious"],
            "Depends how major this minor mishap is": ["normal"],
            "Might annoy me for a very short while but then I'm over it.": ["normal"],
            "Angry!": ["angry"]
        }
    },






    {
        question: "How would you feel about getting ignored?",
        answers: {
            "It's whatever. Better luck next time!": ["happy", "unstoppable"],
            "Offended or sad.": ["sad"],
            "Really mad about that actually, yeah.": ["angry"],
            "I wouldn't care.": ["mysterious"],
            "Depends if it was intentional or not.": ["normal"]
        }
    },



    {
        question: "You want to achieve something, but to get there is a very long, difficult process. What would you do?",
        answers: {
            "Keep trying no matter what!": ["happy", "hopeful", "unstoppable"],
            "Can't be bothered.": ["lazy"],
            "Probably give up if it takes too long.": ["lazy"],
            "Depends how badly I want/need to achieve it.": ["normal"],
        }
    },



    {
        question: "How would you feel/react about getting accused for something you didn’t do?",
        answers: {
            "At least I know it wasn't me!": ["happy", "unstoppable"],
            "Sad and possibly cry.": ["sad"],
            "Angry.": ["angry"],
            "Try and defend myself.": ["normal"],
            "Wouldn't care/react and wait for the person to find out they were wrong.": ["mysterious"]
        }
    },
    




    {
        question: "How would you feel about telling someone something you’re interested in, but they don’t care?",
        answers: {
            "That's fine. I'd just tell someone else who would care": ["happy", "unstoppable"],
            "Sad": ["sad"],
            "Angry.": ["angry"],
            "Depends on how much I liked this thing/how the person shows their indifference.": ["normal"],
            "Unbothered": ["mysterious"]
        }
    },




    {
        question: "What's your idea of fun/free time?",
        answers: {
            "Activities that gets me on my feet (e.g., working out, hiking, etc"): ["energetic"],
            "Something fun but that doesn't make me out of breath (e.g., amusement park, art, etc.": ["normal"],
            "Gaming/Listening to music.": ["lazy"],
            "Studying/Reading.": ["normal"],
            "Sleep": ["lazy"]
        }
    }




];

let currentQuestionIndex = 0;
let userResponses = {};


function storeAnswer(category) {
    if (Array.isArray(category)) {
        category.forEach(c => {
            userResponses[c] = (userResponses[c] || 0) + 1;
        });
    } else {
        userResponses[category] = (userResponses[category] || 0) + 1;
    }
    
    currentQuestionIndex++; 
    setTimeout(loadQuestion, 500); 
}










const themeSongs = {
    "happy": ["Dua Lipa – Levitating", "Panic! At The Disco – High Hopes", "Pharrell Williams - Happy"],
    "sad": ["Billie Eilish – What Was I Made For?"],
    "angry": ["Imagine Dragons – Believer"],
    "tired": ["Jake Knox – Sleep"],
    "energetic": ["AJR – Burn The House Down", "Ayo and Teo – Lit Right Now", "Fun – We Are Young", "Nicki Minaj – Starships", "Sia - Chandelier"],
    "mysterious": ["Sub Urban – Cradles"],
    "unstoppable": ["Samsaya – Stereotype", "Galantis – No Money", "Macklemore & Ryan Lewis – Can’t Hold Us", "MAGIC! – Rude", "Panic! At The Disco – High Hopes", "Sia – Chandelier", "Sia – The Greatest", "Photronique – We On Top"],
    "normal": ["Harry Style – Watermelon Sugar"]
};



async function getSpotifyToken() {
    const clientId = "093b2f140d714222999da23063564ef5";
    const clientSecret = "2b285232802246a7ad068406c5a03bf2";

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
        },
        body: "grant_type=client_credentials"
    });

    const data = await response.json();
    return data.access_token;
}




async function fetchSpotifySong(emotion) {
    let accessToken = await getSpotifyToken();
    
    // Choose a random song from the selected emotion category
    let songs = themeSongs[emotion];
    let randomSong = songs[Math.floor(Math.random() * songs.length)];

    let response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(randomSong)}&type=track&limit=1`, {
        headers: { "Authorization": `Bearer ${accessToken}` }
    });

    let data = await response.json();
    let song = data.tracks.items[0];

    // Display song result
    document.getElementById("spotify-song").innerHTML = `
        <h3>Your Theme Song:</h3>
        <p><strong>${song.name}</strong> by ${song.artists[0].name}</p>
        <iframe src="https://open.spotify.com/embed/track/${song.id}" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    `;
}




// Theme descriptions
const themeDescriptions = {
    "happy": { 
        title: "Your theme is Happy! 😊",
        description: "You’re a fairly jolly person with high spirits and you don’t let small little things ruin your day."
    },
    "sad": {
        title: "Your theme is Sad! 😟",
        description: "The negatives easily affect you and can ruin your whole day, making you feel miserable most of the time. Cheer up!"
    },
    "angry": {
        title: "Your theme is Angry 😡",
        description: "You aren’t the type who likes to be messed with! Anyone or anything that tries to get on your nerves should probably be careful 😬"
    },
    "tired": {
        title: "Your theme is Tired/Lazy 😴",
        description: "You’re out of energy most of the time, or you don’t feel that motivated to do anything."
    },
    "energetic": {
        title: "Your theme is Energetic! 🤸",
        description: "You’re a bubbly person who is mostly full of energy and doesn’t like to stay still for too long. Moving makes you feel good and you have a good metabolism. That’s good!"
    },
    "mysterious": {
        title: "Your theme is Mysterious 🥸",
        description: "You’re the kind of person who is extremely hard to read. You barely have a reaction to anything, and you mostly keep to yourself."
    },
    "unstoppable": {
        title: "Your theme is Unstoppable 🏃💨",
        description: "You don’t allow any obstacles or negatives to get in your way. If you have a set goal, you will go for it head-on!"
    },
    "normal": {
        title: "Your theme is Normal 😐",
        description: "That means you have the regular shmegular reactions that most people have. Your mood/reactions solely depend on what is happening and to what extent it happened."
    }
};


// Scroll
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("start-btn").addEventListener("click", function () {
        document.getElementById("startup").style.display = "none";
        document.getElementById("quiz-container").style.display = "block";
        loadQuestion(); // Start quiz after button click
    });
});




function calculateResult() {
    let dominantEmotion = Object.keys(userResponses).reduce((a, b) => userResponses[a] > userResponses[b] ? a : b);

    // Hide quiz, show results
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";

    // Remove previous theme classes from body
    document.body.className = "";

    // Background classes for body
    const themeBackgrounds = {
        "happy": "happy-bg",
        "sad": "sad-bg",
        "angry": "angry-bg",
        "tired": "tired-bg",
        "energetic": "energetic-bg",
        "mysterious": "mysterious-bg",
        "unstoppable": "unstoppable-bg",
        "normal": "normal-bg"
    };

    //Background gradient
    document.body.classList.add(themeBackgrounds[dominantEmotion]);

   
    document.getElementById("theme-title").innerText = themeDescriptions[dominantEmotion].title;
    document.getElementById("theme-description").innerText = themeDescriptions[dominantEmotion].description;

    // Fetch and show song
    fetchSpotifySong(dominantEmotion);
}





