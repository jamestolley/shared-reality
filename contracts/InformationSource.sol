// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract InformationSource is Ownable {
    string public name;
    string public url;
    string public description;
    address public addr;

    // Emitted when the stored values change
    event InformationSourceCreated(
        string name,
        string url,
        string description,
        address addr
    );
    event InformationSourceUpdated(
        string name,
        string url,
        string description,
        address addr
    );

    // Stores a new value in the contract
    constructor(
        string memory _name,
        string memory _url,
        string memory _description,
        address _addr
    ) {
        require(
            (keccak256(abi.encodePacked((_name))) !=
                keccak256(abi.encodePacked(("")))),
            "The name cannot be empty"
        );
        require(
            (keccak256(abi.encodePacked((_description))) !=
                keccak256(abi.encodePacked(("")))),
            "A description must have text"
        );

        name = _name;
        url = _url;
        description = _description;
        addr = _addr;
        emit InformationSourceCreated(name, url, description, addr);
    }

    function setName(string memory _name) public onlyOwner {
        require(
            (keccak256(abi.encodePacked((_name))) !=
                keccak256(abi.encodePacked(("")))),
            "The name cannot be empty"
        );

        name = _name;
        emit InformationSourceUpdated(name, url, description, addr);
    }

    function setUrl(string memory _url) public onlyOwner {
        url = _url;
        emit InformationSourceUpdated(name, url, description, addr);
    }

    function setDescription(string memory _description) public onlyOwner {
        require(
            (keccak256(abi.encodePacked((_description))) !=
                keccak256(abi.encodePacked(("")))),
            "A description must have text"
        );

        description = _description;
        emit InformationSourceUpdated(name, url, description, addr);
    }

    function setAddress(address _addr) public onlyOwner {
        addr = _addr;
        emit InformationSourceUpdated(name, url, description, addr);
    }
}
