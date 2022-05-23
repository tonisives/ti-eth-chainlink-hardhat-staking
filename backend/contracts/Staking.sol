// stake: Lock tokens into our smart contract
// withdraw: unlock tokens and pull out of the contract
// claimReward: users get their reward toknes
// Whats a good reward mechanism?

// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error Staking__TransferFailed();
error Staking__NotEnoughBalance();
error Staking__NeedsMoreThanZero();

contract Staking {
  // s = storage - expensive to read and write
  IERC20 public s_stakingToken;
  IERC20 public s_rewardToken;

  mapping(address => uint256) public s_balances;
  // a mapping of how much rewards each address currently has.
  mapping(address => uint256) public s_rewards;
  // helper mapping to calculate how much rewards user has
  mapping(address => uint256) public s_userRewardPerTokenPaid;

  uint256 public s_totalSupply;
  uint256 public s_rewardPerTokenStored;
  uint256 public s_lastUpdateTime;

  uint256 public constant REWARD_RATE = 100;

  // all functions update the rewards for a user.
  // If someone else stakes, then next rewards are reduced for all other users
  modifier updateReward(address user) {
    // how much reward per token
    // last timestamp
    // 12-1, user earned X tokens

    s_rewardPerTokenStored = rewardPerToken();
    s_lastUpdateTime = block.timestamp;
    s_rewards[user] = earned(user);
    s_userRewardPerTokenPaid[user] = s_rewardPerTokenStored;
    _;
  }

  modifier moreThanZero(uint256 amount) {
    if (amount == 0) {
      revert Staking__NeedsMoreThanZero();
    }
    _;
  }

  constructor(address stakingToken, address rewardToken) {
    s_stakingToken = IERC20(stakingToken);
    s_rewardToken = IERC20(rewardToken);
  }

  // how much reward tokens the user currently has. 
  function earned(address user) public view returns (uint256) {
    uint256 currentBalance = s_balances[user];
    // updated in claimReward
    uint256 amountPaid = s_userRewardPerTokenPaid[user];
    uint256 currentRewardPerToken = rewardPerToken();
    uint256 pastRewards = s_rewards[user];
    uint256 _earned = ((currentBalance * (currentRewardPerToken - amountPaid)) / 1e18) +
      pastRewards;

    return _earned;
  }

  // based on how long it has been during this most recent snapshot
  function rewardPerToken() public view returns (uint256) {
    if (s_totalSupply == 0) {
      return s_rewardPerTokenStored;
    }

    // get seconds passed, multiply by reward rate/second. divide it by total supply
    // that is the reward per token currently
    return
      s_rewardPerTokenStored +
      (((block.timestamp - s_lastUpdateTime) * REWARD_RATE * 1e18) / s_totalSupply);
  }

  // we only allow single kind of token.
  //  if used any token, then would need to convert tokens using Chainlink feeds
  // approve function is in the frontend, where user can call the ERC20 contract, to allow this contract to use those  ERC tokens
  function stake(uint256 amount) external updateReward(msg.sender) moreThanZero(amount) {
    // keep track of how much user has staked
    // how much we have total
    // transfer the tokens to this contract
    s_balances[msg.sender] += amount;
    s_totalSupply += amount;
    // emit event

    // get tokens from the user
    bool success = s_stakingToken.transferFrom(msg.sender, address(this), amount);
    // custom errors are more gas efficient. With "Failed" we store the "Failed" string on contract
    // require(success, "Failed")
    if (!success) {
      // using an error code is more gas effient
      // revert will revert the transferred funds, and balance changes. all of the code above
      revert Staking__TransferFailed();
    }
  }

  function withdraw(uint256 amount) external updateReward(msg.sender) moreThanZero(amount) {
    if (s_balances[msg.sender] < amount) {
      revert Staking__NotEnoughBalance();
    }

    s_balances[msg.sender] -= amount;
    s_totalSupply -= amount;

    // transfer tokens from this contract
    bool success = s_stakingToken.transfer(msg.sender, amount);

    if (!success) {
      revert Staking__TransferFailed();
    }
  }

  function claimReward() external updateReward(msg.sender) {
    uint256 reward = s_rewards[msg.sender];
    bool success = s_rewardToken.transfer(msg.sender, reward);
    if (!success) {
      revert Staking__TransferFailed();
    }

    // how much reward do we have for the
    // contract emits X tokens/second
    // disperses them to all token stakers, proprtionally to their staked amount
    //
  }

  function getStaked(address account) public view returns (uint256) {
    return s_balances[account];
  }
}
