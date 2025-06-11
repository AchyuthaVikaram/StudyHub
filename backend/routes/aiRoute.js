const express = require("express");
const {
	autoCategorizeNote,
	suggestRelatedTopics,
	summarizeNote,
} = require("../services/geminiService");

const { createClient } = require('@supabase/supabase-js');

const router = express.Router();
const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post("/process", async (req, res) => {
	// POST /api/ai/process
	try {
		const { noteId } = req.body;

		if (!noteId) return res.status(400).json({ error: "Missing noteId." });

		// ✅ Fetch note from Supabase
		const { data: note, error } = await supabase
			.from("notes")
			.select("title, description, subject, tags")
			.eq("id", noteId)
			.single();

		if (error || !note) {
			console.error("Error fetching note:", error);
			return res.status(404).json({ error: "Note not found." });
		}

		const content = `
Title: ${note.title}
Subject: ${note.subject}
Tags: ${(note.tags || []).join(", ")}
Description: ${note.description}
`;
		if (!content)
			return res.status(400).json({ error: "Missing note content." });

		const [summary, relatedTopics, category] = await Promise.all([
			summarizeNote(content),
			suggestRelatedTopics(content),
			autoCategorizeNote(content),
		]);

		res.json({ summary, relatedTopics, category });
	} catch (error) {
		console.log(error);
		console.error("AI processing failed:", error);
		res.status(500).json({ error: "AI processing failed." });
	}
});

module.exports = router;
