const mongoose = require("mongoose");
const { ThrowError } = require("../utils/ErrorUtils.js");
const fs = require("fs");
const Game = require("../models/Games.model.js");

const { fileupload, deleteFile } = require("../helper/cloudinary.js");

// Create a new game
exports.createGame = function (req, res) {
  (async function () {
    try {
      const {
        title,
        description,
        category,
        size,
        instructions,
        tags,
        platforms, // platforms now contains price per platform
      } = req.body;

    //   console.log(req.body,req.files,"------------------------------");
      

      // Handle cover image upload
      let coverImageData = null;
      if (req.files && req.files.cover_image) {
        const coverFiledata = await fileupload(
          req.files.cover_image[0].path,
          "GameCoverImage"
        );
        if (!coverFiledata.message) {
          coverImageData = {
            url: coverFiledata.Location,
            public_id: coverFiledata.ETag.replace(/"/g, ""),
          };
          if (fs.existsSync(req.files.cover_image[0].path)) {
            fs.unlinkSync(req.files.cover_image[0].path);
          }
        } else {
          return ThrowError(res, 400, "Cover image upload failed");
        }
      }

      // Handle video upload
      let videoData = null;
      if (req.files && req.files.video) {
        const videoFiledata = await fileupload(
          req.files.video[0].path,
          "GameVideo"
        );
        if (!videoFiledata.message) {
          videoData = {
            url: videoFiledata.Location,
            public_id: videoFiledata.ETag.replace(/"/g, ""),
          };
          if (fs.existsSync(req.files.video[0].path)) {
            fs.unlinkSync(req.files.video[0].path);
          }
        } else {
          return ThrowError(res, 400, "Video upload failed");
        }
      }

      // Parse platforms data and handle platform file uploads
      let platformsData = {};
      if (platforms) {
        platformsData =
          typeof platforms === "string" ? JSON.parse(platforms) : platforms;
      }

      // For each platform, if a file is uploaded, upload it and set download_link (one-time, expiring)
      const platformNames = ["windows", "ios", "android"];
      for (const platform of platformNames) {
        if (
          req.files &&
          req.files[`${platform}_file`] // e.g. req.files.windows_file
        ) {
          // Upload the file to cloud and get a one-time download link
          const fileData = await fileupload(
            req.files[`${platform}_file`][0].path,
            `Game${platform.charAt(0).toUpperCase() + platform.slice(1)}File`
          );
          if (!fileData.message) {
            if (!platformsData[platform]) platformsData[platform] = {};
            platformsData[platform].download_link = fileData.Location;
            platformsData[platform].public_id = fileData.ETag.replace(/"/g, "");
            if (fs.existsSync(req.files[`${platform}_file`][0].path)) {
              fs.unlinkSync(req.files[`${platform}_file`][0].path);
            }
          } else {
            return ThrowError(res, 400, `${platform} file upload failed`);
          }
        }
      }

      let imagesData = [];
if (req.files && req.files.images) {
  for (const img of req.files.images) {
    const imgData = await fileupload(img.path, "GameImages");
    if (!imgData.message) {
      imagesData.push({
        url: imgData.Location,
        public_id: imgData.ETag.replace(/"/g, ""),
      });
      if (fs.existsSync(img.path)) {
        fs.unlinkSync(img.path);
      }
    } else {
      return ThrowError(res, 400, "One of the images upload failed");
    }
  }
}


      const game = new Game({
        title,
        description,
        cover_image: coverImageData,
        video: videoData,
        category,
        size,
        images: imagesData,
        instructions,
        platforms: platformsData, // <-- platforms now includes price per platform
        tags: tags ? JSON.parse(tags) : [],
      });

      const savedGame = await game.save();
      if (!savedGame) return ThrowError(res, 404, "Game not created");

      const populatedGame = await Game.findById(savedGame._id).populate(
        "category"
      );
      res.status(201).json(populatedGame);
    } catch (error) {
      // Clean up uploaded files if error occurs
      if (req.files) {
        Object.values(req.files).forEach((file) => {
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      return ThrowError(res, 500, error.message);
    }
  })();
};

// Update a game by ID
exports.updateGame = function (req, res) {
  (async function () {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        // Clean up uploaded files if invalid ID
        if (req.files) {
          Object.values(req.files).forEach((file) => {
            if (file.path && fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        }
        return ThrowError(res, 400, "Invalid game ID");
      }

      const game = await Game.findById(req.params.id);
      if (!game) {
        // Clean up uploaded files if game not found
        if (req.files) {
          Object.values(req.files).forEach((file) => {
            if (file.path && fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        }
        return ThrowError(res, 404, "Game not found");
      }

      // Handle cover image update
      if (req.files && req.files.cover_image) {
        if (game.cover_image && game.cover_image.public_id) {
          await deleteFile(game.cover_image.public_id);
        }

        const coverFiledata = await fileupload(
          req.files.cover_image[0].path,
          "GameCoverImage"
        );
        if (!coverFiledata.message) {
          game.cover_image = {
            url: coverFiledata.Location,
            public_id: coverFiledata.ETag.replace(/"/g, ""),
          };
          if (fs.existsSync(req.files.cover_image[0].path)) {
            fs.unlinkSync(req.files.cover_image[0].path);
          }
        }
      }

      // Handle video update
      if (req.files && req.files.video) {
        if (game.video && game.video.public_id) {
          await deleteFile(game.video.public_id);
        }

        const videoFiledata = await fileupload(
          req.files.video[0].path,
          "GameVideo"
        );
        if (!videoFiledata.message) {
          game.video = {
            url: videoFiledata.Location,
            public_id: videoFiledata.ETag.replace(/"/g, ""),
          };
          if (fs.existsSync(req.files.video[0].path)) {
            fs.unlinkSync(req.files.video[0].path);
          }
        }
      }

      // Update other fields
      game.title = req.body.title || game.title;
      game.description = req.body.description || game.description;
      game.category = req.body.category || game.category;
      game.size = req.body.size || game.size;
      game.instructions = req.body.instructions || game.instructions;
      game.isActive =
        req.body.isActive !== undefined ? req.body.isActive : game.isActive;

      // Update platforms and handle new platform file uploads
      let platformsData = {};
      if (req.body.platforms) {
        platformsData =
          typeof req.body.platforms === "string"
            ? JSON.parse(req.body.platforms)
            : req.body.platforms;
        game.platforms = { ...game.platforms, ...platformsData };
      }

      if (req.files && req.files.images) {
        for (const img of req.files.images) {
          const imgData = await fileupload(img.path, "GameImages");
          if (!imgData.message) {
            game.images.push({
              url: imgData.Location,
              public_id: imgData.ETag.replace(/"/g, ""),
            });
            if (fs.existsSync(img.path)) {
              fs.unlinkSync(img.path);
            }
          } else {
            return ThrowError(res, 400, "One of the images upload failed");
          }
        }
      }

      // For each platform, if a file is uploaded, upload it and set download_link (one-time, expiring)
      const platformNames = ["windows", "ios", "android"];
      for (const platform of platformNames) {
        if (req.files && req.files[`${platform}_file`]) {
          const fileData = await fileupload(
            req.files[`${platform}_file`][0].path,
            `Game${platform.charAt(0).toUpperCase() + platform.slice(1)}File`
          );
          if (!fileData.message) {
            if (!game.platforms[platform]) game.platforms[platform] = {};
            game.platforms[platform].download_link = fileData.Location;
            game.platforms[platform].public_id = fileData.ETag.replace(
              /"/g,
              ""
            );
            if (fs.existsSync(req.files[`${platform}_file`][0].path)) {
              fs.unlinkSync(req.files[`${platform}_file`][0].path);
            }
          } else {
            return ThrowError(res, 400, `${platform} file upload failed`);
          }
        }
      }

      if (req.body.tags) {
        game.tags = JSON.parse(req.body.tags);
      }

      await game.save();
      const updatedGame = await Game.findById(game._id).populate("category");

      return res.status(200).json({
        message: "Game updated successfully",
        data: updatedGame,
      });
    } catch (error) {
      // Clean up uploaded files if error occurs
      if (req.files) {
        Object.values(req.files).forEach((file) => {
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      return ThrowError(res, 500, error.message);
    }
  })();
};

// Get a single game by ID
exports.getGameById = function (req, res) {
  (async function () {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return ThrowError(res, 400, "Invalid game ID");
      }
      const game = await Game.findById(req.params.id).populate("category");
      if (!game) return ThrowError(res, 404, "Game not found");
      res.json(game);
    } catch (error) {
      return ThrowError(res, 500, error.message);
    }
  })();
};

// Get all games
exports.getAllGames = function (req, res) {
  (async function () {
    try {
      const games = await Game.find().populate("category");
      if (!games || games.length === 0)
        return ThrowError(res, 404, "No games found");
      res.json(games);
    } catch (error) {
      return ThrowError(res, 500, error.message);
    }
  })();
};

// Get games by platform
exports.getGamesByPlatform = function (req, res) {
  (async function () {
    try {
      const { platform } = req.params; // windows, ios, android

      if (!["windows", "ios", "android"].includes(platform)) {
        return ThrowError(
          res,
          400,
          "Invalid platform. Must be windows, ios, or android"
        );
      }

      const query = {};
      query[`platforms.${platform}.available`] = true;

      const games = await Game.find(query).populate("category");
      if (!games || games.length === 0) {
        return ThrowError(res, 404, `No games found for ${platform}`);
      }

      res.json(games);
    } catch (error) {
      return ThrowError(res, 500, error.message);
    }
  })();
};

// Delete a game by ID
exports.deleteGame = function (req, res) {
  (async function () {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return ThrowError(res, 400, "Invalid game ID");
      }

      const game = await Game.findById(req.params.id);
      if (!game) return ThrowError(res, 404, "Game not found");

      // Delete cover image from cloudinary
      if (game.cover_image && game.cover_image.public_id) {
        await deleteFile(game.cover_image.public_id);
      }

      // Delete video from cloudinary
      if (game.video && game.video.public_id) {
        await deleteFile(game.video.public_id);
      }

      const deletedGame = await Game.findByIdAndDelete(req.params.id);
      if (!deletedGame) return ThrowError(res, 404, "Game not found");

      res.status(200).json({
        success: true,
        message: "Game deleted successfully",
      });
    } catch (error) {
      return ThrowError(res, 500, error.message);
    }
  })();
};
