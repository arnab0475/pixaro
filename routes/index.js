var express = require('express');
var router = express.Router();
const userModel=require("./users")
const postModel=require("./post")
const commentModel=require("./comment")
const localStrategy=require("passport-local");
const passport = require('passport');
const upload=require("./multer");
passport.use(new localStrategy(userModel.authenticate()))
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', {error:req.flash("error")});
});
router.get('/feed', isLoggedIn, async function(req, res, next) {
  try {
    // Fetch all posts from all users, populate user info and sort by creation date (newest first)
    const posts = await postModel.find({})
      .populate('user', 'username fullname')
      .sort({ createdAt: -1 });
    
    // Get current user info for authorization checks
    const currentUser = await userModel.findOne({username: req.session.passport.user});
    
    res.render('feed', { posts, currentUser });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Error loading feed');
  }
});
router.post('/upload',isLoggedIn,upload.single("file"),async function(req,res,next){
  if(!req.file){
    return res.status(400).send({message:"Please select a file"});
  }
  const user=await userModel.findOne({username:req.session.passport.user})
  const postdata=await postModel.create({
    image:req.file.filename,
    imageText:req.body.filecaption,
    user:user._id
  })
  user.posts.push(postdata._id)
  await user.save()
  res.redirect("/profile")
})

router.post('/upload-profile-picture',isLoggedIn,upload.single("profilePicture"),async function(req,res,next){
  try {
    if(!req.file){
      return res.status(400).json({message:"Please select a profile picture"});
    }
    
    const user = await userModel.findOne({username:req.session.passport.user})
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    
    // Update user's profile picture
    user.dp = req.file.filename;
    await user.save();
    
    res.redirect("/profile");
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({message:"Error uploading profile picture"});
  }
})

router.delete('/delete-post/:postId', isLoggedIn, async function(req, res, next) {
  try {
    const postId = req.params.postId;
    const currentUser = await userModel.findOne({username: req.session.passport.user});
    
    if (!currentUser) {
      return res.status(404).json({message: "User not found"});
    }
    
    // Find the post and populate user info
    const post = await postModel.findById(postId).populate('user');
    
    if (!post) {
      return res.status(404).json({message: "Post not found"});
    }
    
    // Check if the current user is the creator of the post
    if (post.user._id.toString() !== currentUser._id.toString()) {
      return res.status(403).json({message: "You can only delete your own posts"});
    }
    
    // Remove post from user's posts array
    currentUser.posts.pull(postId);
    await currentUser.save();
    
    // Delete the post
    await postModel.findByIdAndDelete(postId);
    
    res.json({message: "Post deleted successfully"});
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({message: "Error deleting post"});
  }
})

// Like/Unlike post routes
router.post('/like-post/:postId', isLoggedIn, async function(req, res, next) {
  try {
    const postId = req.params.postId;
    const currentUser = await userModel.findOne({username: req.session.passport.user});
    
    if (!currentUser) {
      return res.status(404).json({message: "User not found"});
    }
    
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({message: "Post not found"});
    }
    
    // Check if user already liked the post
    const userLikeIndex = post.likes.indexOf(currentUser._id);
    
    if (userLikeIndex === -1) {
      // User hasn't liked the post, so add like
      post.likes.push(currentUser._id);
      await post.save();
      res.json({
        message: "Post liked successfully",
        liked: true,
        likeCount: post.likes.length
      });
    } else {
      // User already liked the post, so remove like (unlike)
      post.likes.splice(userLikeIndex, 1);
      await post.save();
      res.json({
        message: "Post unliked successfully",
        liked: false,
        likeCount: post.likes.length
      });
    }
  } catch (error) {
    console.error('Error liking/unliking post:', error);
    res.status(500).json({message: "Error processing like"});
  }
})

// Comment routes
router.post('/add-comment/:postId', isLoggedIn, async function(req, res, next) {
  try {
    const postId = req.params.postId;
    const { commentText } = req.body;
    const currentUser = await userModel.findOne({username: req.session.passport.user});
    
    if (!currentUser) {
      return res.status(404).json({message: "User not found"});
    }
    
    if (!commentText || commentText.trim().length === 0) {
      return res.status(400).json({message: "Comment text is required"});
    }
    
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({message: "Post not found"});
    }
    
    // Create new comment
    const newComment = await commentModel.create({
      text: commentText.trim(),
      user: currentUser._id,
      post: postId
    });
    
    // Add comment to post's comments array
    post.comments.push(newComment._id);
    await post.save();
    
    // Populate user info for response
    await newComment.populate('user', 'username fullname');
    
    res.json({
      message: "Comment added successfully",
      comment: newComment,
      commentCount: post.comments.length
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({message: "Error adding comment"});
  }
})

router.get('/get-comments/:postId', isLoggedIn, async function(req, res, next) {
  try {
    const postId = req.params.postId;
    
    const comments = await commentModel.find({post: postId})
      .populate('user', 'username fullname')
      .sort({createdAt: -1});
    
    res.json({
      comments: comments,
      commentCount: comments.length
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({message: "Error fetching comments"});
  }
})

router.delete('/delete-comment/:commentId', isLoggedIn, async function(req, res, next) {
  try {
    const commentId = req.params.commentId;
    const currentUser = await userModel.findOne({username: req.session.passport.user});
    
    if (!currentUser) {
      return res.status(404).json({message: "User not found"});
    }
    
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({message: "Comment not found"});
    }
    
    // Check if the current user is the creator of the comment
    if (comment.user.toString() !== currentUser._id.toString()) {
      return res.status(403).json({message: "You can only delete your own comments"});
    }
    
    // Remove comment from post's comments array
    const post = await postModel.findById(comment.post);
    if (post) {
      post.comments.pull(commentId);
      await post.save();
    }
    
    // Delete the comment
    await commentModel.findByIdAndDelete(commentId);
    
    res.json({
      message: "Comment deleted successfully",
      commentCount: post ? post.comments.length : 0
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({message: "Error deleting comment"});
  }
})

// Follow/Unfollow routes
router.post('/follow-user/:userId', isLoggedIn, async function(req, res, next) {
  try {
    const targetUserId = req.params.userId;
    const currentUser = await userModel.findOne({username: req.session.passport.user});
    
    if (!currentUser) {
      return res.status(404).json({message: "User not found"});
    }
    
    // Can't follow yourself
    if (currentUser._id.toString() === targetUserId) {
      return res.status(400).json({message: "You cannot follow yourself"});
    }
    
    const targetUser = await userModel.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({message: "Target user not found"});
    }
    
    // Check if already following
    const isFollowing = currentUser.following.includes(targetUserId);
    
    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUser._id);
      
      await currentUser.save();
      await targetUser.save();
      
      res.json({
        message: "User unfollowed successfully",
        isFollowing: false,
        followersCount: targetUser.followers.length,
        followingCount: currentUser.following.length
      });
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUser._id);
      
      await currentUser.save();
      await targetUser.save();
      
      res.json({
        message: "User followed successfully",
        isFollowing: true,
        followersCount: targetUser.followers.length,
        followingCount: currentUser.following.length
      });
    }
  } catch (error) {
    console.error('Error following/unfollowing user:', error);
    res.status(500).json({message: "Error processing follow request"});
  }
})

router.get('/user/:userId', isLoggedIn, async function(req, res, next) {
  try {
    const userId = req.params.userId;
    const currentUser = await userModel.findOne({username: req.session.passport.user});
    
    const targetUser = await userModel.findById(userId)
      .populate('posts')
      .select('-password');
    
    if (!targetUser) {
      return res.status(404).send('User not found');
    }
    
    // Check if current user is following this user
    const isFollowing = currentUser.following.includes(userId);
    
    res.render('user-profile', { 
      targetUser, 
      currentUser, 
      isFollowing,
      isOwnProfile: currentUser._id.toString() === userId
    });
  } catch (error) {
    console.error('Error loading user profile:', error);
    res.status(500).send('Error loading user profile');
  }
})

router.get("/profile",isLoggedIn,async function(req,res,next){
  const user=await userModel.findOne({
    username:req.session.passport.user
  }).populate("posts")
  //console.log(user)
  res.render("profile",{user})
})
router.post("/register",function(req,res){
  const { username, fullname, email } = req.body;
  const userData = new userModel({ username, fullname, email });
  userModel.register(userData,req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})
router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true
}),function(req,res){
  
})
router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
} 


module.exports = router;
