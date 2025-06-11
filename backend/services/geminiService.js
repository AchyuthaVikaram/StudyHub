const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log(process.env.GEMINI_API_KEY)

const summarizeNote = async (text) => {
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
	const prompt = `Summarize the following study notes in under 100 words:\n\n${text}`;
	const result = await model.generateContent(prompt);
	return result.response.text();
};

const suggestRelatedTopics = async (text) => {
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
	const prompt = `Given the content below, suggest 5 related topics students might be interested in:\n\n${text}`;
	const result = await model.generateContent(prompt);
	return result.response.text().split("\n").filter(Boolean);
};

const autoCategorizeNote = async (text) => {
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
	const prompt = `Categorize this note under one of the following: Mathematics, Physics, Chemistry, Biology, Computer Science, Engineering.\n\nContent:\n${text}`;
	const result = await model.generateContent(prompt);
	return result.response.text().trim();
};

module.exports = {
	summarizeNote,
	suggestRelatedTopics,
	autoCategorizeNote,
};
