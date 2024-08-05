//SPDX-License-Identifier:MIT
error AlreadyAnUser();
error InvalidAccess();
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
contract ICSToken is ERC20,ERC20Burnable{
    address payable owner;
    constructor(uint256 initialSupply)ERC20("ICSToken","ICS"){
        owner=payable(msg.sender);
        _mint(msg.sender,initialSupply*(10**decimals()));
    }
    function mint(address account,uint value)public{
      _mint(account,value);
    }
     function destroy() public onlyOwner {
        selfdestruct(owner);
    }
     modifier onlyOwner {
        require(msg.sender == owner, "only the owner can call this function");
        _;
    }
} 
contract Social{
    address  immutable  owner;
    ICSToken public icstoken;
    constructor(address ot){
       icstoken=ICSToken(ot);
       owner=(msg.sender);
       icstoken.mint(address(this),300000);
       icstoken.approve(address(this),300000);
       icstoken.allowance(msg.sender,address(this));
    }
    struct Post{
        uint256 pid;
        address  creator;
        string image_hash;
        string title;
        string description;
        string videos;
        uint256 likes;
        uint256 shares;
        string tags;
        
    }
    struct User{
        uint256 uid;
        address  userid;
        string name;
        string bio;
        string image_hash;
        string caption;
        uint256 dailylikes;
        uint256 dailyshares;
        uint256 [] dailylikestamp;
         uint256 [] dailysharestamp;
        uint256 [] pid;
        address[] followers;
        address[] following;
        Post[] content;
        uint256 token;
    }
    mapping(address=>bool) public isAUser;
    mapping(address=>bool)private gotInitial;
    mapping(address=>User)public userCheck;
    mapping(uint256=>Post)public posts;
    mapping(address=>mapping(uint256=>bool))private likeUpdate;
   
    mapping(uint256=>User) public users;
    Post[]postArray;
    User[]userArray;
    
    uint256 totalUserCount=0;
    uint256 registerCount=0;
    uint256 pidCount=0;
    function register(string memory _name,string memory _bio,string memory _image_hash,string memory _caption)external{
     if(isAUser[msg.sender]==true)revert AlreadyAnUser();
     totalUserCount++;
    User storage user=users[totalUserCount];
    user.uid=totalUserCount;
    user.userid=msg.sender;
    user.name=_name;
    user.bio=_bio;
    user.image_hash=_image_hash;
    user.caption=_caption;
    userCheck[msg.sender]=user;
    isAUser[msg.sender]=true;
    userArray.push(user);
    sendInitial();
    
    }
   
  //on creation of post 2 tokens will be given,if greater then no token
    function createPost(string memory _title,string memory _description,string
    memory _imageHash,string memory _videoHash,string memory _tags )external{
        require(isAUser[msg.sender]==true,"only users can post");
        pidCount++;
         Post storage post=posts[pidCount];
         post.pid=pidCount;
         post.creator=(msg.sender);
         post.image_hash=_imageHash;
         post.title=_title;
         post.description=_description;
         post.videos=_videoHash;
         post.tags=_tags;
         userCheck[msg.sender].content.push(post);
         postArray.push(post);
         icstoken.transferFrom(address(this),msg.sender,2);
         userCheck[msg.sender].token=icstoken.balanceOf(msg.sender);
        
        
          
    }
     function getBalance(address a) public view returns (uint256) {
        return icstoken.balanceOf(a);
    }
   
  function sendInitial()internal{
        registerCount++;
                icstoken.transferFrom(address(this),msg.sender,5);
                userCheck[msg.sender].token=icstoken.balanceOf(msg.sender);
                gotInitial[msg.sender]=true; 
       
    }
    function giveLike(uint256 _pid)external{
        require(_pid<=pidCount,"invalid pid");
        require(isAUser[msg.sender]==true,"should be user");
        Post storage post=posts[_pid];
        if(post.creator!=msg.sender){
        if(likeUpdate[msg.sender][_pid]==false){
        post.likes+=1;
        likeUpdate[msg.sender][_pid]=true;
        userCheck[msg.sender].dailylikes+=1;
        users[userCheck[msg.sender].uid].dailylikes=userCheck[msg.sender].dailylikes;
        userCheck[msg.sender].dailylikestamp.push(block.timestamp);
        }
        else{
             post.likes-=1;
        likeUpdate[msg.sender][_pid]=false;
         userCheck[msg.sender].dailylikes-=1;
        users[userCheck[msg.sender].uid].dailylikes=userCheck[msg.sender].dailylikes;
        
        }
        handleLike();
        }
    }
    function handleLike()internal{
            if(userCheck[msg.sender].dailylikes==20){
            if(userCheck[msg.sender].dailylikestamp.length==20){
                uint256 diff=userCheck[msg.sender].dailylikestamp[19]-userCheck[msg.sender].dailylikestamp[0];
                if(diff<=24 hours){
                     userCheck[msg.sender].dailylikes=0;
                    icstoken.transferFrom(address(this),msg.sender,2);
                    userCheck[msg.sender].token=icstoken.balanceOf(msg.sender);
                   
                }
            }
            else if(userCheck[msg.sender].dailylikestamp.length>=20){
                uint256 diff=userCheck[msg.sender].dailylikestamp[userCheck[msg.sender].dailylikestamp.length-1]-userCheck[msg.sender].dailylikestamp[userCheck[msg.sender].dailylikestamp.length-20];
                uint256 diff1=userCheck[msg.sender].dailylikestamp[userCheck[msg.sender].dailylikestamp.length-20]-userCheck[msg.sender].dailylikestamp[userCheck[msg.sender].dailylikestamp.length-21];
                if(diff<=24 hours && diff1>24 hours){
                     userCheck[msg.sender].dailylikes=0;
                    icstoken.transferFrom(address(this),msg.sender,2);
                    userCheck[msg.sender].token=icstoken.balanceOf(msg.sender);
                   
                }
            }

        }
        else{
            uint256 diff=userCheck[msg.sender].dailylikestamp[userCheck[msg.sender].dailylikestamp.length-1]-userCheck[msg.sender].dailylikestamp[0];
            if(diff>24 hours){
                userCheck[msg.sender].dailylikes=0;
            }
        }
    }
   
   //comment
   //share post-10 shares 1 token
     function share(uint256 _pid)external{
        require(_pid<=pidCount,"invalid pid");
        require(isAUser[msg.sender]==true,"should be user");
        Post storage post=posts[_pid];
        if(post.creator!=msg.sender){
        post.shares+=1;
       
        userCheck[msg.sender].dailyshares+=1;
        users[userCheck[msg.sender].uid].dailyshares=userCheck[msg.sender].dailyshares;
        userCheck[msg.sender].dailysharestamp.push(block.timestamp);
        userCheck[msg.sender].content.push(post);
        users[userCheck[msg.sender].uid].content.push(post);
        handleShare();
        }

    }
    function handleShare()internal{
            if(userCheck[msg.sender].dailyshares==10){
            if(userCheck[msg.sender].dailysharestamp.length==10){
                uint256 diff=userCheck[msg.sender].dailysharestamp[9]-userCheck[msg.sender].dailysharestamp[0];
                if(diff<=24 hours){
                     userCheck[msg.sender].dailyshares=0;
                    icstoken.transferFrom(address(this),msg.sender,1);
                    userCheck[msg.sender].token=icstoken.balanceOf(msg.sender);
                   
                }
            }
            else if(userCheck[msg.sender].dailysharestamp.length>=10){
                uint256 diff=userCheck[msg.sender].dailysharestamp[userCheck[msg.sender].dailysharestamp.length-1]-userCheck[msg.sender].dailysharestamp[userCheck[msg.sender].dailysharestamp.length-10];
                uint256 diff1=userCheck[msg.sender].dailysharestamp[userCheck[msg.sender].dailysharestamp.length-10]-userCheck[msg.sender].dailysharestamp[userCheck[msg.sender].dailysharestamp.length-11];
                if(diff<=24 hours && diff1>24 hours){
                    userCheck[msg.sender].dailyshares=0;
                    icstoken.transferFrom(address(this),msg.sender,2);
                    userCheck[msg.sender].token=icstoken.balanceOf(msg.sender);
                    
                }
            }

        }
        else{
            uint256 diff=userCheck[msg.sender].dailysharestamp[userCheck[msg.sender].dailysharestamp.length-1]-userCheck[msg.sender].dailysharestamp[0];
            if(diff>24 hours){
                userCheck[msg.sender].dailyshares=0;
            }
        }
    }
  
   //send money to creator
   function sendMoneyToPostCreator(uint256 _p,uint256 _amount)external{
    require(_p<=pidCount,"Invalid pid");
    require(isAUser[msg.sender]==true,"should be user");
    Post storage post=posts[_p];
    require(_amount<=icstoken.balanceOf(msg.sender),"not possible");
    icstoken.transferFrom(msg.sender,post.creator,_amount);
    userCheck[msg.sender].token=icstoken.balanceOf(msg.sender);
    userCheck[post.creator].token=icstoken.balanceOf(post.creator);


   }
   function follow(address _user)external{
     require(isAUser[msg.sender]==true,"should be user");
    userCheck[_user].followers.push(msg.sender);
    followingUpdate(_user);

   }
   function followingUpdate(address _user)internal{
    userCheck[msg.sender].following.push(_user);
   }
   //display posts by creator
   function viewCreatorPost(address _creator)external view returns (Post [] memory){
     User storage user=userCheck[_creator];
     return user.content;
   }
   //display posts
   function viewAllPosts()external view returns(Post[]memory){
    return postArray;
   }
   function viewPostByPid(uint256 _pid)external view returns(Post memory){
     require(_pid<=pidCount,"Invalid pid");
     Post storage post=posts[_pid];
     return post;
   }
   //display follower
    function getFollowers(address _creator)external view returns(address[]memory){
      User storage user=userCheck[_creator];
      return user.followers;
    }
   //display following
   function getFollowing(address _creator)external view returns(address[] memory){
    User storage user=userCheck[_creator];
      return user.following;
   }
   //unfollow
   function unfollow(address _follower)external{
     require(isAUser[msg.sender]==true,"should be user");
    User storage user=userCheck[msg.sender];
    bool x=false;
    for(uint i=0;i<user.following.length;i++){
        if(user.following[i]==_follower){
               address t=user.following[i];
               user.following[i]=user.following[user.following.length-1];
               user.following[user.following.length-1]=t;
               x=true;
               break;
        }
    }
        
        if(x==true){
            user.following.pop();
           unfollowHandle(_follower,msg.sender);
    }
   }
   function unfollowHandle(address _follower,address x)internal{
     User storage user1=userCheck[_follower];
        for(uint i=0;i<user1.followers.length;i++){
        if(user1.followers[i]==x){
               address t=user1.followers[i];
               user1.followers[i]=user1.followers[user1.followers.length-1];
               user1.followers[user1.followers.length-1]=t;
               
               break;
        }
        user1.followers.pop();
        }

   }
   //get all users
   function getUserById(address _user)external view returns(User memory){
    User storage user=userCheck[_user];
    return user;
   }

   //get user by id
   function getAllUsers()external view returns(User[]memory){
    return userArray;
   }
}

