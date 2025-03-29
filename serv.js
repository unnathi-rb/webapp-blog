const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const Post = require("./models/post");

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs"); // Assuming you're using EJS for templates
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(methodOverride("_method"));
app.use(express.static("public")); // Serve static files like CSS, JS

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/blogDB")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// Home Route - Display all posts
app.get("/", async (req, res) => {
    try {
        const posts = await Post.find();
        res.render("index", { posts });
    } catch (err) {
        res.status(500).send("Error fetching posts");
    }
});

// New Post Form
app.get("/new", (req, res) => {
    res.render("new");
});

// Create Post
app.post("/posts", async (req, res) => {
    try {
        await Post.create({ title: req.body.title, content: req.body.content });
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error creating post");
    }
});

// Edit Post Form
app.get("/posts/:id/edit", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render("edit", { post });
    } catch (err) {
        res.status(500).send("Error fetching post for editing");
    }
});

// Update Post
app.put("/posts/:id", async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, { title: req.body.title, content: req.body.content });
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error updating post");
    }
});

// Delete Post
app.delete("/posts/:id", async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Error deleting post");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


