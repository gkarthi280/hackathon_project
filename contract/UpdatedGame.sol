    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;

    import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

    contract UpdatedGame {
        address public owner;
        IERC20 public usdcToken;
        
        struct Player {
            address playerAddress;
            uint256 betAmount;
        }

        Player[] public players;
        mapping(address => uint256) public bets;
        uint256 public totalBets;


        constructor(address _usdcTokenAddress){
            owner = msg.sender;
            usdcToken = IERC20(_usdcTokenAddress);
        }

        modifier onlyOwner() {
            require(msg.sender == owner, "Only owner can call this function");
            _;
        }

        // Join game function with specified bet amount
        function joinGame(uint256 _amount) external {
            require(_amount > 0, "Bet amount must be greater than zero");
            require(usdcToken.balanceOf(msg.sender) >= _amount, "Insufficient USDC balance");

        
            require(usdcToken.transferFrom(msg.sender, address(this), _amount), "USDC transfer failed");

            players.push(Player(msg.sender, _amount));
            bets[msg.sender] = _amount;
            totalBets += _amount;

        }

        // Return original bets to a list of qualified players
        function returnBets(address[] calldata _players) external onlyOwner {
            for (uint256 i = 0; i < _players.length; i++) {
                address player = _players[i];
                uint256 betAmount = bets[player];
                require(betAmount > 0, "Player has no bet");

                require(usdcToken.transfer(player, betAmount), "Failed to return bet");

                totalBets -= betAmount;

            
            }
        }

        // Payout to winners
        function payoutWinners(address[] calldata _winners) external onlyOwner {
            require(_winners.length > 0, "No winners provided");

            uint256 losersPool = totalBets;
            uint256 deployerShare = (losersPool * 5) / 100;
            uint256 winnersPool = losersPool - deployerShare;
            uint256 payoutPerWinner = winnersPool / _winners.length;

            // Transfer 5% of the total pool to the deployer's contract address
            require(usdcToken.transfer(owner, deployerShare), "Deployer payout failed");

            // Distribute remaining 95% evenly among winners
            for (uint256 i = 0; i < _winners.length; i++) {
                require(usdcToken.transfer(_winners[i], payoutPerWinner), "Winner payout failed");
            }

            // Reset state after payout
            totalBets = 0;
            for (uint256 i = 0; i < players.length; i++) {
                delete bets[players[i].playerAddress];
            }
            delete players;


        }


        // Get winners from selected players
        function getWinners(address[] memory _selectedPlayers) external view onlyOwner returns (address[] memory) {
            uint256 totalSelected = _selectedPlayers.length;
            uint256 totalPlayers = players.length;
            uint256 maxWinners;

            // If totalPlayers >= 10, select a maximum of 5 winners from the selected players
            if (totalPlayers >= 10) {
                maxWinners = totalSelected > 5 ? 5 : totalSelected;
            } 
            // Else, select at maximum half of the totalPlayers
            else {
                maxWinners = totalSelected > totalPlayers / 2 ? totalPlayers / 2 : totalSelected;
            }

            // Create a new array to store the winners
            address[] memory winners = new address[](maxWinners);

            // Populate the winners array
            uint256 nonce = 0;
            for (uint256 i = 0; i < maxWinners; i++) {
                uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, nonce))) % totalSelected;
                nonce ++;
                winners[i] = _selectedPlayers[randomIndex];
            }

            return winners;

        
        }

    }
