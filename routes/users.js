const router = require("express").Router();
const User = require("../models/User");

//CRUD

// ユーザー更新(Update)
router.put("/:id",async(req,res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,  //$set は 指定されたフィールドのみを更新するためのMongoDBの演算子
            });
            res.status(200).json("アカウントが更新されました");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("他のアカウントは更新できません");
    }
})

// ユーザー削除(Delete)
router.delete("/:id",async(req,res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("アカウントが削除されました"); 
        }catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(403).json("他のアカウントは削除できません");
    }
})

// ユーザー取得(Find)
router.get("/:id",async(req,res) =>{
        try{
            const user = await User.findById(req.params.id);
            const {password, updatedAt, ...other} = user._doc; //パスワードとその更新時間の取得を除外
            res.status(200).json(other); 
        }catch(err){
            return res.status(500).json(err);
        }
    }
)

// ユーザーフォロー(Update)
router.put("/:id/follow",async(req,res) =>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //フォローしていない場合
            if(!user.followers.includes(req.body.userId)){  
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{followings:req.params.id}});
                res.status(200).json("フォローしました");
            }else{
                res.status(403).json("既にフォローしています");
            }
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("自分自身をフォローできません");
    }
})

// ユーザーフォロー解除(Update)
router.put("/:id/unfollow",async(req,res) =>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //フォローしている場合
            if(user.followers.includes(req.body.userId)){  //ここと
                await user.updateOne({$pull:{followers:req.body.userId}}); //ここと
                await currentUser.updateOne({$pull:{followings:req.params.id}}); //ここを逆にした
                res.status(200).json("フォロー解除しました");
            }
        }catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(403).json("自分自身をフォロー解除できません");
    }
})




// router.get("/",(req, res) => {
//     res.send("user router");
// });

module.exports = router;