const {
  createGroup,
  findGroupById,
  findGroupsByUserId,
  findAllGroups,
  addGroupMember,
  getGroupMembers,
  removeGroupMember,
  isGroupMember,
  isGroupLeader,
} = require("../models/groupModel");
const { findUserByEmail } = require("../models/userModel");

const createGroupController = async (req, res) => {
  const { name, course_id } = req.body;

  try {
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ error: "Group name must be at least 3 characters" });
    }

    if (!course_id) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    const group = await createGroup({
      name: name.trim(),
      creator_id: req.user.id,
      course_id: parseInt(course_id),
    });

    res.status(201).json({
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    console.error("Create group error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMyGroups = async (req, res) => {
  try {
    const groups = await findGroupsByUserId(req.user.id);
    res.json(groups);
  } catch (error) {
    console.error("Get groups error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getGroupDetails = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await findGroupById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const members = await getGroupMembers(groupId);

    res.json({
      group,
      members,
    });
  } catch (error) {
    console.error("Get group details error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addMember = async (req, res) => {
  const { groupId } = req.params;
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const isLeader = await isGroupLeader(groupId, req.user.id);

    if (!isLeader) {
      return res
        .status(403)
        .json({ error: "Only group leaders can add members" });
    }

    const newMember = await findUserByEmail(email.toLowerCase().trim());

    if (!newMember || newMember.role !== "student") {
      return res.status(404).json({ error: "Student not found" });
    }

    const alreadyMember = await isGroupMember(groupId, newMember.id);

    if (alreadyMember) {
      return res.status(409).json({ error: "User already in group" });
    }

    await addGroupMember(groupId, newMember.id, "member");

    res.status(201).json({
      message: "Member added successfully",
      member: {
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
      },
    });
  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeMember = async (req, res) => {
  const { groupId, memberId } = req.params;

  try {
    const isLeader = await isGroupLeader(groupId, req.user.id);

    if (!isLeader) {
      return res
        .status(403)
        .json({ error: "Only group leaders can remove members" });
    }

    if (parseInt(memberId) === req.user.id) {
      return res.status(400).json({ error: "Cannot remove group leader" });
    }

    const removed = await removeGroupMember(groupId, memberId);

    if (!removed) {
      return res.status(404).json({ error: "Member not found in group" });
    }

    res.json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllGroupsController = async (req, res) => {
  try {
    const groups = await findAllGroups();
    res.json(groups);
  } catch (error) {
    console.error("Get all groups error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createGroupController,
  getMyGroups,
  getGroupDetails,
  addMember,
  removeMember,
  getAllGroupsController,
};
