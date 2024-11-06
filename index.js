require("dotenv").config()
const readline = require('readline')

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    // systemInstruction: "You are an AI cooking companion. Your role is to assist users with cooking-related questions and provide helpful, friendly, and concise responses. You can suggest recipes, explain cooking techniques, offer ingredient substitutions, and help with meal planning. Always be polite and encouraging, making users feel comfortable asking questions. If a question is not about food or cooking, kindly explain that you can only assist with cooking-related inquiries.", 
    systemInstruction: "You are my friendly cooking companion, here to help me through every step of preparing a delicious dish. Your role is to guide me through ingredients, measurements, techniques, and timing, answering any questions I have about cooking. Please stay in character as a cooking expert, offering advice only about cooking, kitchen tips, and culinary techniques. Your responses should be warm, encouraging, and detailed to help me understand every step clearly. Add in a little humour to make things more fun. Please avoid discussing topics unrelated to cooking.",
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let chatHistory = []

async function startChat(userInput) {
    const chat = model.startChat({
        // Use the maintained chat history
        history: chatHistory, 
    });

    try {
        // Send the user input and update the chat history
        const result = await chat.sendMessageStream(userInput);
        chatHistory.push({
            role: "user",
            parts: [{ text: userInput }],
        })
        for await (const chunk of result.stream) {
            const chunkText = await chunk.text()
            chatHistory.push({
                role: "model",
                parts: [{ text: chunkText}],
            })
            process.stdout.write(chunkText)
        }
    } catch (error) {
        console.log("\nWhoops! \nSomething went wrong. Please try asking me another question.")
        
    }
}

async function processInput(){
    rl.question("\nType your question here or type 'quit' to exit: ", async (input) => {
        if (input.toLowerCase() === 'quit') {
            console.log("\nExiting...\n")
            rl.close()
        } else {
            console.log("\nGenerating...\n")
            await startChat(input)
            processInput()
        }
    })
}

async function main() {
    console.log("\nHi there! I’m your cooking companion, ready to help you create something delicious. What’s on the menu today?")
    await processInput()
}

main()