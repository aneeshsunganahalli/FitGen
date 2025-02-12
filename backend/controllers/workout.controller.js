import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import Workout from "../models/workout.model.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize the OpenAI chat model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",  // Use "gpt-3.5-turbo" for a cheaper option
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const parser = new JsonOutputFunctionsParser();

// Define the structured prompt template
const prompt = PromptTemplate.fromTemplate(`
Create a personalized workout plan with the following details:
Goal: {goal}
Fitness Level: {fitnessLevel}
Available Equipment: {availableEquipment}

Please provide a detailed workout plan that:
1. Matches the user's fitness level
2. Uses only the available equipment
3. Helps achieve their specific goal
4. Includes appropriate sets, reps, and duration for each exercise
`);

/**
 * Generates a workout plan based on user inputs
 * @param {string} goal - User's fitness goal
 * @param {string} fitnessLevel - User's current fitness level
 * @param {string[]} availableEquipment - Array of available equipment
 * @returns {Promise<Object>} Workout plan in JSON format
 */
export const generateWorkout = async (req, res) => {
  try {
    const { goal, fitnessLevel, availableEquipment } = req.body;
    
    if (!goal || !fitnessLevel || !availableEquipment) {
      return res.status(400).json({ 
        error: "Missing required fields",
        details: "Goal, fitness level, and available equipment are required" 
      });
    }

    // Verify user is authenticated
    if (!req.user?.id) {
      return res.status(401).json({
        error: "Unauthorized",
        details: "User must be logged in to create workouts"
      });
    }

    const chain = prompt.pipe(model.bind({
      functions: [{
        name: "output_workout",
        description: "Generate a structured workout plan",
        parameters: {
          type: "object",
          properties: {
            exercises: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Name of the exercise" },
                  sets: { type: "number", description: "Number of sets" },
                  reps: { type: "number", description: "Number of reps per set" },
                  duration: { type: "string", description: "Duration of the exercise" }
                },
                required: ["name", "sets", "reps", "duration"]
              }
            }
          },
          required: ["exercises"]
        }
      }],
      function_call: { name: "output_workout" }
    })).pipe(parser);

    console.log('Generating workout with params:', { goal, fitnessLevel, availableEquipment });

    const response = await chain.invoke({
      goal,
      fitnessLevel,
      availableEquipment: Array.isArray(availableEquipment) 
        ? availableEquipment.join(", ")
        : availableEquipment
    });

    console.log('AI Response:', response);

    // Create new workout document with authenticated user's ID
    const workout = new Workout({
      userId: req.user.id,  // Use the authenticated user's ID
      goal,
      fitnessLevel,
      availableEquipment: Array.isArray(availableEquipment) 
        ? availableEquipment.join(", ")
        : availableEquipment,
      exercises: response.exercises
    });

    // Save to database
    await workout.save();

    res.json(workout);
  } catch (error) {
    console.error('Workout generation error:', error);
    res.status(500).json({ 
      error: "Failed to generate workout plan", 
      details: error.message 
    });
  }
};