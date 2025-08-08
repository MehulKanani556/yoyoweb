const mongoose = require('mongoose');
const { ThrowError } = require('../utils/ErrorUtils.js');
const fs = require("fs");
const Category = require('../models/Category.model.js');

const {fileupload, deleteFile,} = require('../helper/cloudinary.js');

// Create a new category
exports.createCategory = function(req, res) {
    (async function() {
        try {
            const categoryName = req.body.categoryName;
            const category_description = req.body.category_description;
            const category_image = req.file ? req.file.path : undefined;

            const filedata = await fileupload(req.file.path, "CategoryImage")
            console.log(filedata)
            
            if(!filedata.message){
                const category = new Category({
                    categoryName: categoryName,
                    category_image:{
                        url:filedata.Location,
                        public_id:filedata.ETag.replace(/"/g, '')
                    },
                    category_description: category_description
                });

                if (req.file?.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
    
                const savedCategory = await category.save();
                if (!savedCategory) return ThrowError(res, 404, 'Category not created');
                res.status(201).json(savedCategory);
            }else{
                return ThrowError(res, 404, 'Category not created')
            }
            
        } catch (error) {
            return ThrowError(res, 500, error.message)
        }
    })();
};

// Get a single category by ID
exports.getCategoryById = function(req, res) {
    (async function() {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return ThrowError(res, 400, 'Invalid category ID');
            }
            const category = await Category.findById(req.params.id);
            if (!category) return ThrowError(res, 404, 'Category not found');
            res.json(category);
        } catch (error) {
            return ThrowError(res, 500, error.message)
        }
    })();
};

// Get all categories
exports.getAllCategories = function(req, res) {
    (async function() {
        try {
            const categories = await Category.find();
            if (!categories || categories.length === 0) return ThrowError(res, 404, 'No categories found');
            res.json(categories);
        } catch (error) {
            return ThrowError(res, 500, error.message)
        }
    })();
};

// Update a category by ID
exports.updateCategory = function(req, res) {
    (async function() {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                if (req.file?.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return ThrowError(res, 400, 'Invalid category ID');
            }
            
            const category = await Category.findById(req.params.id);
            if (!category) {
                if (req.file?.path && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return ThrowError(res, 404, 'Category not found');
            }

            // If a new image is uploaded, delete the old one
            if (req.file?.path) {
              await  deleteFile(category.category_image.public_id)

              const filedata = await fileupload(req.file.path, "CategoryImage")
                // if (category.category_image && fs.existsSync(category.category_image)) {
                //     fs.unlinkSync(category.category_image);
                // }
                // category.category_image = req.file.path;
                if(!filedata.message){
                    category.category_image.url = filedata.Location
                    category.category_image.public_id = filedata.ETag.replace(/"/g, '')

                    if (req.file?.path && fs.existsSync(req.file.path)) {
                        fs.unlinkSync(req.file.path);
                    }
                }
            }

            // Update other fields
            category.categoryName = req.body.categoryName || category.categoryName;
            category.category_description = req.body.category_description || category.category_description;

            await category.save();

            return res.status(200).json({
                message: "Category updated successfully",
                data: category
            });

        } catch (error) {
            if (req.file?.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return ThrowError(res, 500, error.message);
        }
    })();
};

// Delete a category by ID
exports.deleteCategory = function(req, res) {
    (async function() {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return ThrowError(res, 400, 'Invalid category ID');
            }
            const category = await Category.findById(req.params.id);

            if(category){
                await  deleteFile(category.category_image.public_id)
            }

            const deletedCategory = await Category.findByIdAndDelete(req.params.id);
            if (!deletedCategory) return ThrowError(res, 404, 'Category not found');
            res.status(200).json({success: true, message: 'Category deleted' });
        } catch (error) {
            return ThrowError(res, 500, error.message)
        }
    })();
}; 