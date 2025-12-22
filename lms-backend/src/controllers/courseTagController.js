const Joi = require("joi");
const courseTagService = require("../services/courseTagService");
const paginationValidator = require("../validations/paginationValidator");
const {
  courseTagSchema,
} = require("../validations/courses/courseTagValidator");

exports.createTag = async (req, res) => {
  try {
    const { error, value } = courseTagSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const tag = await courseTagService.createTag(value);
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTag = async (req, res) => {
  try {
    const { error, value } = courseTagSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const tag = await courseTagService.updateTag({
      id: req.params.id,
      ...value,
    });
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const tag = await courseTagService.deleteTag(req.params.id);
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTagById = async (req, res) => {
  try {
    const tag = await courseTagService.getTagById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const { error, value } = paginationValidator.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { page, pageCount, search } = value;

    const { tags, totalItems, totalPages } = await courseTagService.getAllTags(
      page,
      pageCount,
      search
    );

    res.status(200).json({
      tags,
      page,
      pageCount,
      totalItems,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
