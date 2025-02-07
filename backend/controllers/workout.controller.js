import Workout from "../models/workout.model.js"
import axios from 'axios'

const OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate";

export const generateWorkout = async (req, res) => {
  const { userId, goal, fitnessLevel, availableEquipment } = req.body;
  
  // Make the prompt more explicit about requiring JSON format
  const prompt = `
  Create a workout plan formatted as valid JSON with the following structure:
  {
    "exercises": [
      {
        "name": "exercise name",
        "sets": number,
        "reps": number,
        "duration": "duration in minutes"
      }
    ]
  }

  Use these details to create the plan:
  - Goal: ${goal}
  - Fitness Level: ${fitnessLevel}
  - Available Equipment: ${availableEquipment}

  Return ONLY the JSON, no additional text.
  `;

  try {
    const response = await axios.post(OLLAMA_API_URL, {
      model: "mistral",
      prompt,
      stream: false
    });

    // Debug logging
    console.log('Raw Ollama response:', response.data);

    // Ollama returns data in { response: "..." } format
    const aiResponse = response.data.response;
    console.log('AI response text:', aiResponse);

    let workoutData;
    try {
      // Try to find JSON in the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
      workoutData = JSON.parse(jsonStr);
      console.log('Parsed workout data:', workoutData);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      console.error("Failed to parse response:", aiResponse);
      return res.status(500).json({ 
        error: "Invalid AI response format",
        details: "AI response could not be parsed as JSON",
        response: aiResponse
      });
    }

    if (!workoutData || !workoutData.exercises) {
      return res.status(500).json({ 
        error: "Invalid workout data structure",
        details: "Response missing required 'exercises' field",
        data: workoutData
      });
    }

    const newWorkout = new Workout({
      userId,
      goal,
      fitnessLevel,
      availableEquipment,
      exercises: workoutData.exercises
    });

    await newWorkout.save();
    res.json({ message: "Workout saved!", workout: newWorkout });

  } catch (error) {
    console.error("Ollama API Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "AI generation failed",
      details: error.message,
      response: error.response?.data
    });
  }
}