// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Idea is Ownable {
    string public text;

    // Emitted when the stored values change
    event IdeaCreated(string text);
    event IdeaUpdated(string text);

    // Stores a new value in the contract
    constructor(string memory _text) {
        text = _text;
        emit IdeaCreated(text);
    }

    function setText(string memory _text) public onlyOwner {
        require(
            (keccak256(abi.encodePacked((_text))) !=
                keccak256(abi.encodePacked(("")))),
            "An idea must have text"
        );

        text = _text;
        emit IdeaUpdated(text);
    }
}
