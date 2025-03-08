const monngoose = require('mongoose');

const PostSchema = new monngoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 500,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    },
},
{timestamps: true}
);

module.exports = monngoose.model("Post", PostSchema);
