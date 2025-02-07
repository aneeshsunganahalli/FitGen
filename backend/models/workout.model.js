import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goal: { type: String, required: true },
  fitnessLevel: { type: String, required: true }, 
  availableEquipment: { type: String, required: true }, 
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
      duration: String, 
    }
  ],
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Workout", WorkoutSchema);
