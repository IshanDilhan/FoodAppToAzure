import mongoose from "mongoose";
import Menu from "./menumodel.js"; // <-- Import as a variable!

const ReviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  menu: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Menu", 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  comment: { 
    type: String, 
    maxlength: 500 
  }
}, { timestamps: true });

// Prevent duplicate reviews
ReviewSchema.index({ user: 1, menu: 1 }, { unique: true });

// Update menu ratings after review save/update
ReviewSchema.post("save", async function(doc) {
  // Use this.constructor to refer to the Review model
  const stats = await this.constructor.aggregate([
    { $match: { menu: doc.menu } },
    { 
      $group: {
        _id: "$menu",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Menu.findByIdAndUpdate(doc.menu, {
      averageRating: stats[0].averageRating,
      totalReviews: stats[0].totalReviews
    });
  }
});

export default mongoose.model("Review", ReviewSchema);
