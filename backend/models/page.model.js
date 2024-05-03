import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    attachments: {
        type: Array,
    },
    date: {
        type: Date,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
}, {timestamps: true});

const Page = mongoose.model('Page', pageSchema);

export default Page;