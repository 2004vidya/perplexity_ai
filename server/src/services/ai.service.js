import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage ,AIMessage} from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});
export async function generateResponse(messages) {
  const response = await geminiModel.invoke(messages.map((msg) => {
    if (msg.role === "user") {
      return new HumanMessage(msg.content);
    } else if (msg.role === "ai") {
      return new AIMessage(msg.content);
    } else {
      return new SystemMessage(msg.content);
    }
  }));

  return response.text;
}

export async function generateTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for the chat conversations.
      User will provide you with first message of chat conversation and you will generate a title for that conversation in less than 2-4 words. The title should be clear,relevant and engaging giving user a quick understanding of the conversation.
      `),
      new HumanMessage(`
        Generate a title for a chat conversation based on following first message: "${message}"`)
  ]);
  return response.text;
}
