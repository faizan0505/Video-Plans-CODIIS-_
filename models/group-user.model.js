const mongoose = require("mongoose");

const groupUserSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true
    },
    users: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true
        },
        isAdmin: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  {
    timeStamps: true
  }
);

const GROUP_USER_MODEL = mongoose.model("group-users", groupUserSchema);

module.exports = GROUP_USER_MODEL;
