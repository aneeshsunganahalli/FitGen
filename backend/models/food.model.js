import mongoose from 'mongoose';

const foodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodName: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const FoodLog = mongoose.model('FoodLog', foodLogSchema);
export default FoodLog; 