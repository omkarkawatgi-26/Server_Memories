import PostMessage from '../models/postMessage.js';
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
    try {
        //it will take time to fetch the data so make it await function
        const postMessages = await PostMessage.find();

        //console.log(postMessages);

        //if everything works fine then return json file of data
        res.status(200).json(postMessages);

    }
    catch (error) {
        console.log("Can't post error in post'");
        res.status(404).json({ error });
    }
}

export const createPost = async (req, res) => {

    const { title, message, selectedFile, creator, tags } = req.body;

    const newPost = new PostMessage({ title, message, selectedFile, creator, tags });

    try {
        await newPost.save();
        console.log("saved !")
        res.status(201).json(newPost);
    }
    catch (err) {
        console.log(err);
        res.status(409).json({ err });
    }

}

export const updatePost = async (req, res) => {
    //second id is just renameing it
    const { id: _id } = req.params;

    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });

    res.json(updatedPost);

}

export const deletePost = async (req, res) => {
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");
    const post = req.body;

    await PostMessage.findByIdAndRemove(_id);

    res.json({ message: 'post deleted successfully' });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");

    const post = await PostMessage.findById(id);

    const count = post.likeCount + 1;


    const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: count }, { new: true });

    res.json(updatedPost);

}

