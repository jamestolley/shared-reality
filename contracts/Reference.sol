// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Reference is Ownable {
    enum Perspective {
        Pro,
        Con,
        Mixed,
        Neutral,
        Other
    }

    address public idea;
    string public snippet;
    Perspective public perspective;
    string public url;
    address public claimant;
    address public reporter;
    address public publisher;
    uint256 public date_asserted;
    string public notes;

    // Emitted when the stored values change
    event ReferenceCreated(
        address idea,
        string snippet,
        string url,
        address claimant,
        address reporter,
        address publisher,
        uint256 date_asserted,
        string notes
    );
    event ReferenceUpdated(
        address idea,
        string snippet,
        string url,
        address claimant,
        address reporter,
        address publisher,
        uint256 date_asserted,
        string notes
    );

    // Stores a new value in the contract
    constructor(
        address _idea,
        string memory _snippet,
        string memory _url,
        address _claimant,
        address _reporter,
        address _publisher,
        uint256 _date_asserted,
        string memory _notes
    ) {
        idea = _idea;
        snippet = _snippet;
        url = _url;
        claimant = _claimant;
        reporter = _reporter;
        publisher = _publisher;
        date_asserted = _date_asserted;
        notes = _notes;

        emit ReferenceCreated(
            idea,
            snippet,
            url,
            claimant,
            reporter,
            publisher,
            date_asserted,
            notes
        );
    }

    function setIdea(address _idea) public onlyOwner {
        idea = _idea;
        emit ReferenceUpdated(
            idea,
            snippet,
            url,
            claimant,
            reporter,
            publisher,
            date_asserted,
            notes
        );
    }

    function setUrl(string memory _url) public onlyOwner {
        url = _url;
        emit ReferenceUpdated(
            idea,
            snippet,
            url,
            claimant,
            reporter,
            publisher,
            date_asserted,
            notes
        );
    }

    function setSnippet(string memory _snippet) public onlyOwner {
        snippet = _snippet;
        emit ReferenceUpdated(
            idea,
            snippet,
            url,
            claimant,
            reporter,
            publisher,
            date_asserted,
            notes
        );
    }

    function setClaimant(address _claimant) public onlyOwner {
        claimant = _claimant;
        emit ReferenceUpdated(
            idea,
            snippet,
            url,
            claimant,
            reporter,
            publisher,
            date_asserted,
            notes
        );
    }

    function setReporter(address _reporter) public onlyOwner {
        reporter = _reporter;
        emit ReferenceUpdated(
            idea,
            snippet,
            url,
            claimant,
            reporter,
            publisher,
            date_asserted,
            notes
        );
    }

    function setPublisher(address _publisher) public onlyOwner {
        publisher = _publisher;
        emit ReferenceUpdated(
            idea,
            snippet,
            url,
            claimant,
            reporter,
            publisher,
            date_asserted,
            notes
        );
    }

    function setDateAsserted(uint256 _date_asserted) public onlyOwner {
        date_asserted = _date_asserted;
        emit ReferenceUpdated(
            idea,
            snippet,
            url,
            claimant,
            reporter,
            publisher,
            date_asserted,
            notes
        );
    }

    function setNotes(string memory _notes) public onlyOwner {
        notes = _notes;
        emit ReferenceUpdated(
            idea,
            snippet,
            url,
            claimant,
            reporter,
            publisher,
            date_asserted,
            notes
        );
    }
}
