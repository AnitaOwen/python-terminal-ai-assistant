# TODO: Import the necessary modules
# Define strategic prompts such as system instructions, few shot examples, and topic keywords
# Define functions to declare any plant assistant functions

import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Write a story about a magic backpack.")
print(response.text)



def main():
    print("\nWelcome to your cooking companion! How can I help you?")
    prompt = input(f"Type your question here or type 'quit' to exit: ")


    # TODO Add terminal input prompts for user
    # TODO: Invoke the functions declared above for the plant assistant
    pass #remember to remove this pass statement

if __name__ == "__main__":
    main()