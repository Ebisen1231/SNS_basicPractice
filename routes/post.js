const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//投稿を作成
router.post("/",async(req,res) =>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
});

//投稿を更新
router.put("/:id",async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(200).json("投稿が更新されました");
        }else{
            res.status(403).json("他のユーザーの投稿は更新できません");
        }
    }catch(err){
        res.status(500).json(err);
    }
});

//投稿を削除
router.delete("/:id",async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne(); //データベースからドキュメント（スキーマ全体）を削除する。
            res.status(200).json("投稿が削除されました");
        }else{
            res.status(403).json("他のユーザーの投稿は削除できません");
        }
    }catch(err){
        res.status(500).json(err);
    }
});

//投稿を取得
router.get("/:id",async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
});

//投稿にいいね
router.put("/:id/like",async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("いいねしました");
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("いいねを取り消しました");
        }
    }catch(err){
        res.status(500).json(err);
    }
});

//タイムライン取得
router.get("/timeline/all",async(req,res) =>{
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId:currentUser._id}); //自分の投稿を取得
        const friendPosts = await Promise.all( 
            currentUser.followings.map((friendId) =>{
                return Post.find({userId:friendId});
            })
        );
        return res.status(200).json(userPosts.concat(...friendPosts)); ///...はスプレッド演算子
        }catch(err){
            res.status(500).json(err);
        }
    }
);








// router.get("/",(req, res) => {
//     res.send("post router");
// });

module.exports = router;