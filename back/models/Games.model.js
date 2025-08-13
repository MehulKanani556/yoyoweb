const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    cover_image: {
      url: { type: String },
      public_id: { type: String },
    },
    video: {
      url: { type: String },
      public_id: { type: String },
    },
    images: [
      {
        url: { type: String },
        public_id: { type: String }
      }
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    instructions: [{
      type: String,
    }],
    // Add platform availability
    platforms: {
      windows: {
        available: { type: Boolean, default: false },
        price: { type: Number },
        download_link: { type: String },
        size: { type: String },
        system_requirements: {
          os: { type: String },
          processor: { type: String },
          memory: { type: String },
          graphics: { type: String },
          storage: { type: String },
        },
        public_id: { type: String },
      },
      ios: {
        available: { type: Boolean, default: false },
        price: { type: Number },
        download_link: { type: String },
        size: { type: String },
        system_requirements: {
          ios_version: { type: String },
          device_compatibility: { type: String },
        },
        public_id: { type: String },
      },
      android: {
        available: { type: Boolean, default: false },
        price: { type: Number },
        download_link: { type: String },
        size: { type: String },
        system_requirements: {
          android_version: { type: String },
          device_compatibility: { type: String },
        },
        public_id: { type: String },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("game", gameSchema);