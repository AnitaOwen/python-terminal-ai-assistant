require("dotenv").config()
const readline = require('readline')

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    systemInstruction: "You are an AI cooking companion. Your role is to assist users with cooking-related questions and provide helpful, friendly, and concise responses. You can suggest recipes, explain cooking techniques, offer ingredient substitutions, and help with meal planning. Always be polite and encouraging, making users feel comfortable asking questions. If a question is not about food or cooking, kindly explain that you can only assist with cooking-related inquiries.", 
})

let chatHistory = [
    {
        role: "user",
        parts: [{ text: "Hello" }],
    },
    {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
    },
];

// async function startChat(userInput) {
//     const chat = model.startChat({
//         history: chatHistory,
//     })

//     // Send the user input and update the chat history
//     const result = await chat.sendMessageStream(userInput)
//     chatHistory.push({
//         role: "user",
//         parts: [{ text: userInput }],
//     });
//     for await (const chunk of result.stream) {
//         const chunkText = chunk.text();
//         process.stdout.write(chunkText);
//     }
// }

async function startChat(userInput) {
    const chat = model.startChat({
        history: chatHistory, // Use the maintained chat history
    });

    try {
        // Send the user input and update the chat history
        const result = await chat.sendMessageStream(userInput);
        chatHistory.push({
            role: "user",
            parts: [{ text: userInput }],
        });
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            process.stdout.write(chunkText);
        }
    } catch (error) {
        console.log("\n\nWhoops! Something went wrong. Please try asking something different.")

    }
}


// async function generateStory(input) {
//     // const result = await model.generateContent(input)
//     // console.log(result.response.text())
//     await startChat(input)
// }

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function processInput(){
    rl.question("\nType your question here or type 'quit' to exit: ", async (input) => {
        if (input.toLowerCase() === 'quit') {
            console.log("\nExiting...")
            rl.close()
        } else {
            console.log("\nGenerating...\n")
            await startChat(input)
            processInput()
        }
    });
}

async function main() {
    console.log("\nWelcome to your cooking companion! How can I help you?")

    await processInput()
}

main()