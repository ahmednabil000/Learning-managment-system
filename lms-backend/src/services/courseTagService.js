const { CourseTag } = require("../models");

exports.createTag = async ({ name, description }) => {
  const tag = await CourseTag.create({ name, description });
  return tag;
};

exports.updateTag = async ({ id, name, description }) => {
  const tag = await CourseTag.findById(id);

  if (!tag) {
    throw new Error("Tag not found");
  }

  tag.name = name;
  tag.description = description;

  await tag.save();
  return tag;
};

exports.deleteTag = async (id) => {
  const tag = await CourseTag.findById(id);

  if (!tag) {
    throw new Error("Tag not found");
  }

  await tag.remove();
  return tag;
};

exports.getTagById = async (id) => {
  const tag = await CourseTag.findById(id);
  return tag;
};

exports.getAllTags = async (page = 1, pageCount = 10, search = "") => {
  const skip = (page - 1) * pageCount;

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const tags = await CourseTag.find(query).skip(skip).limit(pageCount);

  const totalItems = await CourseTag.countDocuments(query);
  const totalPages = Math.ceil(totalItems / pageCount);

  return { tags, totalItems, totalPages };
};
