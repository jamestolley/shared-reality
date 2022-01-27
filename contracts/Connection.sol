// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Connection is Ownable {
    enum ConnectionType {
        Reason,
        Objection,
        Part
    }

    address public parent;
    address public child;
    ConnectionType public connection_type;

    // Emitted when the stored values change
    event ConnectionCreated(
        address _parent,
        address _child,
        ConnectionType _connection_type
    );

    event ConnectionUpdated(
        address _parent,
        address _child,
        ConnectionType _connection_type
    );

    //event ConnectionParentAdded(
    //    uint256 i,
    //    address parent,
    //    ConnectionType _type
    //);

    // Stores a new value in the contract
    constructor(
        address _parent,
        address _child,
        ConnectionType _connection_type
    ) {
        require(_parent != _child, "An idea cannot be its own parent or child");

        parent = _parent;
        child = _child;
        connection_type = _connection_type;

        emit ConnectionCreated(_parent, _child, _connection_type);
    }

    function setParent(address _parent) public onlyOwner {
        require(
            address(this) != child,
            "An idea cannot be a parent or child of itself"
        );

        parent = _parent;
        emit ConnectionUpdated(parent, child, connection_type);
    }

    function setChild(address _child) public onlyOwner {
        require(
            address(this) != parent,
            "An idea cannot be a parent or child of itself"
        );

        child = _child;
        emit ConnectionUpdated(parent, child, connection_type);
    }

    function setConnectionType(ConnectionType _connection_type)
        public
        onlyOwner
    {
        connection_type = _connection_type;
        emit ConnectionUpdated(parent, child, connection_type);
    }
}
