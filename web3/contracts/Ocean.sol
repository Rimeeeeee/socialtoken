//SPDX-License-Identifier:MIT
error AlreadyAnUser();
error InvalidAccess();
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ICSToken is ERC20, ERC20Burnable {
    address payable owner;

    constructor(uint256 initialSupply) ERC20("ICSToken", "ICS") {
        owner = payable(msg.sender);
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }

    function mint(address account, uint value) public {
        _mint(account, value * (10 ** decimals()));
    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only the owner can call this function");
        _;
    }
}

contract Social {
    address immutable owner;
    ICSToken public icstoken;

    constructor(address ot) {
        icstoken = ICSToken(ot);
        owner = (msg.sender);
        icstoken.mint(address(this), 30000000 * (10 ** icstoken.decimals()));
        icstoken.approve(address(this), 300000 * (10 ** icstoken.decimals()));
        icstoken.allowance(msg.sender, address(this));
    }

    struct Post {
        uint256 pid;
        address creator;
        string image_hash;
        string title;
        string description;
        string videos;
        uint256 likes;
        uint256 shares;
        string tags;
    }
    struct User {
        uint256 uid;
        address userid;
        string name;
        string bio;
        string image_hash;
        string caption;
        uint256 dailylikes;
        uint256 dailyshares;
        uint256 dailycheckin;
        uint256[] dailycheckins;
        uint256[] dailylikestamp;
        uint256[] dailysharestamp;
        uint256[] pid;
        address[] followers;
        address[] following;
        Post[] content;
        uint256 token;
    }
    mapping(address => bool) public isAUser;
    mapping(address => bool) private gotInitial;
    mapping(address => User) public userCheck;
    mapping(uint256 => Post) public posts;
    mapping(address => mapping(uint256 => bool)) private likeUpdate;

    mapping(uint256 => User) public users;
    Post[] postArray;
    User[] userArray;

    uint256 totalUserCount = 0;
    uint256 registerCount = 0;
    uint256 pidCount = 0;

    function register(
        string memory _name,
        string memory _bio,
        string memory _image_hash,
        string memory _caption
    ) external {
        if (isAUser[msg.sender] == true) revert AlreadyAnUser();
        totalUserCount++;
        User storage user = users[totalUserCount];
        user.uid = totalUserCount;
        user.userid = msg.sender;
        user.name = _name;
        user.bio = _bio;
        user.image_hash = _image_hash;
        user.caption = _caption;
        userCheck[msg.sender] = user;
        isAUser[msg.sender] = true;
        userArray.push(user);
        sendInitial();
    }

    //on creation of post 2 tokens will be given,if greater then no token
    function createPost(
        string memory _title,
        string memory _description,
        string memory _imageHash,
        string memory _videoHash,
        string memory _tags
    ) external {
        require(isAUser[msg.sender] == true, "only users can post");
        pidCount++;
        Post storage post = posts[pidCount];
        post.pid = pidCount;
        post.creator = (msg.sender);
        post.image_hash = _imageHash;
        post.title = _title;
        post.description = _description;
        post.videos = _videoHash;
        post.tags = _tags;
        userCheck[msg.sender].content.push(post);
        postArray.push(post);
        icstoken.transferFrom(
            address(this),
            msg.sender,
            2 * (10 ** icstoken.decimals())
        );
        userCheck[msg.sender].token = icstoken.balanceOf(msg.sender);
    }

    function getBalance(address a) public view returns (uint256) {
        return icstoken.balanceOf(a);
    }

    function sendInitial() internal {
        registerCount++;
        icstoken.transferFrom(
            address(this),
            msg.sender,
            5 * (10 ** icstoken.decimals())
        );
        userCheck[msg.sender].token = icstoken.balanceOf(msg.sender);
        gotInitial[msg.sender] = true;
    }

    function giveLike(uint256 _pid) external {
        require(_pid <= pidCount, "invalid pid");
        require(isAUser[msg.sender] == true, "should be user");
        Post storage post = posts[_pid];
        if (post.creator != msg.sender) {
            if (likeUpdate[msg.sender][_pid] == false) {
                post.likes += 1;
                likeUpdate[msg.sender][_pid] = true;
                userCheck[msg.sender].dailylikes += 1;
                users[userCheck[msg.sender].uid].dailylikes = userCheck[
                    msg.sender
                ].dailylikes;
                userCheck[msg.sender].dailylikestamp.push(block.timestamp);
            } else {
                post.likes -= 1;
                likeUpdate[msg.sender][_pid] = false;
                userCheck[msg.sender].dailylikes -= 1;
                users[userCheck[msg.sender].uid].dailylikes = userCheck[
                    msg.sender
                ].dailylikes;
            }
            handleLike();
        }
    }

    function handleLike() internal {
        if (userCheck[msg.sender].dailylikes == 20) {
            if (userCheck[msg.sender].dailylikestamp.length == 20) {
                uint256 diff = userCheck[msg.sender].dailylikestamp[19] -
                    userCheck[msg.sender].dailylikestamp[0];
                if (diff <= 24 hours) {
                    userCheck[msg.sender].dailylikes = 0;
                    icstoken.transferFrom(
                        address(this),
                        msg.sender,
                        2 * (10 ** icstoken.decimals())
                    );
                    userCheck[msg.sender].token = icstoken.balanceOf(
                        msg.sender
                    );
                }
            } else if (userCheck[msg.sender].dailylikestamp.length >= 20) {
                uint256 diff = userCheck[msg.sender].dailylikestamp[
                    userCheck[msg.sender].dailylikestamp.length - 1
                ] -
                    userCheck[msg.sender].dailylikestamp[
                        userCheck[msg.sender].dailylikestamp.length - 20
                    ];
                uint256 diff1 = userCheck[msg.sender].dailylikestamp[
                    userCheck[msg.sender].dailylikestamp.length - 20
                ] -
                    userCheck[msg.sender].dailylikestamp[
                        userCheck[msg.sender].dailylikestamp.length - 21
                    ];
                if (diff <= 24 hours && diff1 > 24 hours) {
                    userCheck[msg.sender].dailylikes = 0;
                    icstoken.transferFrom(
                        address(this),
                        msg.sender,
                        2 * (10 ** icstoken.decimals())
                    );
                    userCheck[msg.sender].token = icstoken.balanceOf(
                        msg.sender
                    );
                }
            }
        } else {
            uint256 diff = userCheck[msg.sender].dailylikestamp[
                userCheck[msg.sender].dailylikestamp.length - 1
            ] - userCheck[msg.sender].dailylikestamp[0];
            if (diff > 24 hours) {
                userCheck[msg.sender].dailylikes = 0;
            }
        }
    }

    //comment
    //share post-10 shares 1 token
    function share(uint256 _pid) external {
        require(_pid <= pidCount, "invalid pid");
        require(isAUser[msg.sender] == true, "should be user");
        Post storage post = posts[_pid];
        if (post.creator != msg.sender) {
            post.shares += 1;

            userCheck[msg.sender].dailyshares += 1;
            users[userCheck[msg.sender].uid].dailyshares = userCheck[msg.sender]
                .dailyshares;
            userCheck[msg.sender].dailysharestamp.push(block.timestamp);
            userCheck[msg.sender].content.push(post);
            users[userCheck[msg.sender].uid].content.push(post);
            handleShare();
        }
    }

    function handleShare() internal {
        if (userCheck[msg.sender].dailyshares == 10) {
            if (userCheck[msg.sender].dailysharestamp.length == 10) {
                uint256 diff = userCheck[msg.sender].dailysharestamp[9] -
                    userCheck[msg.sender].dailysharestamp[0];
                if (diff <= 24 hours) {
                    userCheck[msg.sender].dailyshares = 0;
                    icstoken.transferFrom(
                        address(this),
                        msg.sender,
                        1 * (10 ** icstoken.decimals())
                    );
                    userCheck[msg.sender].token = icstoken.balanceOf(
                        msg.sender
                    );
                }
            } else if (userCheck[msg.sender].dailysharestamp.length >= 10) {
                uint256 diff = userCheck[msg.sender].dailysharestamp[
                    userCheck[msg.sender].dailysharestamp.length - 1
                ] -
                    userCheck[msg.sender].dailysharestamp[
                        userCheck[msg.sender].dailysharestamp.length - 10
                    ];
                uint256 diff1 = userCheck[msg.sender].dailysharestamp[
                    userCheck[msg.sender].dailysharestamp.length - 10
                ] -
                    userCheck[msg.sender].dailysharestamp[
                        userCheck[msg.sender].dailysharestamp.length - 11
                    ];
                if (diff <= 24 hours && diff1 > 24 hours) {
                    userCheck[msg.sender].dailyshares = 0;
                    icstoken.transferFrom(
                        address(this),
                        msg.sender,
                        2 * (10 ** icstoken.decimals())
                    );
                    userCheck[msg.sender].token = icstoken.balanceOf(
                        msg.sender
                    );
                }
            }
        } else {
            uint256 diff = userCheck[msg.sender].dailysharestamp[
                userCheck[msg.sender].dailysharestamp.length - 1
            ] - userCheck[msg.sender].dailysharestamp[0];
            if (diff > 24 hours) {
                userCheck[msg.sender].dailyshares = 0;
            }
        }
    }

    //send money to creator
    function sendMoneyToPostCreator(uint256 _p, uint256 _amount) external {
        require(_p <= pidCount, "Invalid pid");
        require(isAUser[msg.sender] == true, "should be user");
        Post storage post = posts[_p];
        require(_amount <= icstoken.balanceOf(msg.sender), "not possible");
        icstoken.transferFrom(
            msg.sender,
            post.creator,
            _amount * (10 ** icstoken.decimals())
        );
        userCheck[msg.sender].token = icstoken.balanceOf(msg.sender);
        userCheck[post.creator].token = icstoken.balanceOf(post.creator);
    }

    function follow(address _user) external {
        require(isAUser[msg.sender] == true, "should be user");
        userCheck[_user].followers.push(msg.sender);
        followingUpdate(_user);
    }

    function followingUpdate(address _user) internal {
        userCheck[msg.sender].following.push(_user);
    }

    //display posts by creator
    function viewCreatorPost(
        address _creator
    ) external view returns (Post[] memory) {
        User storage user = userCheck[_creator];
        return user.content;
    }

    //display posts
    function viewAllPosts() external view returns (Post[] memory) {
        return postArray;
    }

    function viewPostByPid(uint256 _pid) external view returns (Post memory) {
        require(_pid <= pidCount, "Invalid pid");
        Post storage post = posts[_pid];
        return post;
    }

    //display follower
    function getFollowers(
        address _creator
    ) external view returns (address[] memory) {
        User storage user = userCheck[_creator];
        return user.followers;
    }

    //display following
    function getFollowing(
        address _creator
    ) external view returns (address[] memory) {
        User storage user = userCheck[_creator];
        return user.following;
    }

    //unfollow
    function unfollow(address _follower) external {
        require(isAUser[msg.sender] == true, "should be user");
        User storage user = userCheck[msg.sender];
        bool x = false;
        for (uint i = 0; i < user.following.length; i++) {
            if (user.following[i] == _follower) {
                address t = user.following[i];
                user.following[i] = user.following[user.following.length - 1];
                user.following[user.following.length - 1] = t;
                x = true;
                break;
            }
        }

        if (x == true) {
            user.following.pop();
            unfollowHandle(_follower, msg.sender);
        }
    }

    function unfollowHandle(address _follower, address x) internal {
        User storage user1 = userCheck[_follower];
        for (uint i = 0; i < user1.followers.length; i++) {
            if (user1.followers[i] == x) {
                address t = user1.followers[i];
                user1.followers[i] = user1.followers[
                    user1.followers.length - 1
                ];
                user1.followers[user1.followers.length - 1] = t;

                break;
            }
            user1.followers.pop();
        }
    }

    //get all users
    function getUserById(address _user) external view returns (User memory) {
        User storage user = userCheck[_user];
        return user;
    }

    //get user by id
    function getAllUsers() external view returns (User[] memory) {
        return userArray;
    }

    function dailyCheckinHandler() external {
        require(isAUser[msg.sender] == true, "should be user");
        User storage user = userCheck[msg.sender];
        if (user.dailycheckins.length == 0) {
            user.dailycheckin = 1;
            user.dailycheckins.push(block.timestamp);
            icstoken.transferFrom(
                address(this),
                msg.sender,
                5 * (10 ** icstoken.decimals())
            );
            userCheck[msg.sender].token = icstoken.balanceOf(msg.sender);
        } else if (user.dailycheckins.length > 0) {
            if (
                (block.timestamp -
                    user.dailycheckins[user.dailycheckins.length - 1]) >=
                24 hours
            ) {
                user.dailycheckin += 1;
                user.dailycheckins.push(block.timestamp);
                icstoken.transferFrom(
                    address(this),
                    msg.sender,
                    5 * (10 ** icstoken.decimals())
                );
                userCheck[msg.sender].token = icstoken.balanceOf(msg.sender);
            }
        }
    }
}
error NotEqualToPlatformFee();
error PlatformFeeTransferFailed();
error TransferFailed();
error NotEnoughTokens();

contract NFTMarketplace is ERC721URIStorage {
    ICSToken public icsToken;
    address private immutable i_owner;
    uint256 tokenId = 0;
    uint256 totalItemsSold = 0;
    uint256 platformFee = 30 * (10 ** 18);

    struct NFT {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    NFT[] public allListedNFTs;
    mapping(address => NFT[]) public NFTListedByAddress;
    mapping(address => NFT[]) public NFTOwnedByAddress;
    mapping(uint256 => NFT) public idToNFT;

    // events
    event TokenListedEvent(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    constructor(address ics) ERC721("SocialNFTMarket", "ICSNFT") {
        icsToken = ICSToken(ics);
        i_owner = payable(msg.sender);
    }

    function createToken(
        string memory tokenURI,
        uint256 price,
        uint256 tokenValue
    ) public {
        if (tokenValue * (10 ** icsToken.decimals()) < platformFee)
            revert NotEqualToPlatformFee();
        // make approve in the frontend
        if (!pay(i_owner, platformFee)) revert PlatformFeeTransferFailed();

        tokenId++;
        uint256 newTokenId = tokenId;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        NFT memory newNFT = NFT(
            newTokenId,
            payable(address(this)),
            payable(msg.sender),
            price * (10 ** icsToken.decimals()),
            true
        );

        idToNFT[newTokenId] = newNFT;
        allListedNFTs.push(newNFT);
        NFTListedByAddress[msg.sender].push(newNFT);
        // NFTOwnedByAddress[address(this)].push(newNFT);

        _transfer(msg.sender, address(this), newTokenId);

        emit TokenListedEvent(
            newTokenId,
            address(this),
            msg.sender,
            price,
            true
        );
    }

    function changePlatformFee(uint256 fee) public onlyOwner {
        platformFee = fee * (10 ** 18);
    }

    function getPlatformFee() public view returns (uint256) {
        return platformFee;
    }

    function getNFTListedByAddress(
        address a
    ) public view returns (NFT[] memory) {
        return NFTListedByAddress[a];
    }

    function getNFTOwnedByAddress(
        address a
    ) public view returns (NFT[] memory) {
        return NFTOwnedByAddress[a];
    }

    function sellNFT(uint256 _tokenId, uint256 tokenValue) public payable {
        uint256 price = idToNFT[_tokenId].price;
        address seller = idToNFT[_tokenId].seller;
        if (tokenValue * (10 ** icsToken.decimals()) != price)
            revert NotEnoughTokens();

        // pay and approve as needed with the frontend
        bool success = pay(seller, tokenValue);
        if (!success) revert TransferFailed();

        // Actually transfer the token to the new owner
        _transfer(address(this), msg.sender, _tokenId);

        // approve the marketplace to sell NFTs on your behalf
        approve(address(this), _tokenId);

        idToNFT[_tokenId].currentlyListed = false;
        idToNFT[_tokenId].seller = payable(msg.sender);

        // Update the NFT mappings
        removeNFTFromOwner(seller, _tokenId);
        addNFTToOwner(msg.sender, idToNFT[_tokenId]);

        totalItemsSold++;
    }

    // Internal functions to update the mappings
    function addNFTToOwner(address owner, NFT memory nft) internal {
        NFTOwnedByAddress[owner].push(nft);
    }

    function removeNFTFromOwner(address owner, uint256 _tokenId) internal {
        NFT[] storage ownedNFTs = NFTOwnedByAddress[owner];
        for (uint256 i = 0; i < ownedNFTs.length; i++) {
            if (ownedNFTs[i].tokenId == _tokenId) {
                ownedNFTs[i] = ownedNFTs[ownedNFTs.length - 1];
                ownedNFTs.pop();
                break;
            }
        }
    }

    // token payment but pay needs approval (msg.sender to address.this in the ICS itself) which will be done in the frontend
    function pay(address a, uint256 b) internal returns (bool) {
        icsToken.approve(address(this), b);
        icsToken.transferFrom(msg.sender, a, b);
        return true;
    }

    function payContract(uint256 b) internal {
        icsToken.approve(address(this), b);
        icsToken.transferFrom(msg.sender, address(this), b);
    }

    // same needs approval
    function payFromContract(address a, uint256 b) internal {
        icsToken.approve(address(this), b);
        icsToken.transferFrom(address(this), a, b);
    }

    modifier onlyOwner() {
        require(msg.sender == i_owner, "Only Owner can Access This");
        _;
    }
}
