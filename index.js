require("dotenv").config()
const readline = require('readline');

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "You are an AI cooking compnanion, you are concise and to the point.";

async function generateStory(input) {
    const result = await model.generateContent(prompt + input);
    console.log(result.response.text());
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function processInput(){
    rl.question("Type your question here or type 'quit' to exit: ", async (input) => {
        if (input.toLowerCase() === 'quit') {
            console.log("Exiting...");
            rl.close();
        } else {
            await generateStory(input)
            processInput()
        }
    });
}

async function main() {
    console.log("Welcome to your cooking companion! How can I help you?");
    
    await processInput()
}

main()