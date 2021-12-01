pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract RagingSantas is IERC721, Ownable, AccessControl {
    using SafeMath for uint256;
    using Address for address;

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Provenance hash proving random distribution
    string public provenanceHash;

    uint256 private nonce;

    bool public mintActive;
    bool public claimActive;
    uint256 private constant maxPerTx = 10;
    uint256 private constant maxPerWallet = 30;
    uint256 private constant maxTries = 20;
    uint256 public maxSupply;
    uint256 public mintPrice;
    uint256 public numberMinted;
    uint256 public numberReserved; // For Giveaways

    struct Gift {
      address nftAddress;
      uint256 tokenId;
      address gifter;
      address giftee;
      address gifteeDelegator;
    }

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping from address to specific tokens Owned
    mapping(address => uint256[]) public _tokensOwned;

    // Mapping from token ID to gifted gift
    mapping(uint256 => Gift) private _giftsGiven;

    // Mapping from token ID (to make a claim) to token ID tied to claimed gift
    mapping(uint256 => uint256) private _tokenIdOfClaimedGift;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // The Gift Pool
    uint256[] public giftsLeftByTokenId;

    constructor(uint256 supply, uint256 reserved)
    {
        mintActive = false;
        claimActive = false;
        numberReserved = reserved;
        mintPrice = 0.03 ether;
        maxSupply = supply;
        nonce = 42;
    }
    
    function activateMint() public onlyOwner {
        mintActive = true;
    }

    function activateClaim() public onlyOwner {
        claimActive = true;
    }

    function numGiftsLeft() public view virtual returns (uint256) {
        return giftsLeftByTokenId.length;
    }
    
    function mint(uint256 qty, address[] memory nftAddresses, uint256[] memory nftTokenIds) external payable {
        // Validate Mint
        require(mintActive, "Mint: Minting is not open yet!");
        require((qty + numberReserved + numberMinted) <= maxSupply, "Mint: Minting has sold out!");
        require(qty <= maxPerTx, "Mint: Max tokens per transaction exceeded");
        require((_tokensOwned[_msgSender()].length + qty) <= maxPerWallet, "Mint: Max tokens per wallet exceeded");
        require(msg.value >= qty * mintPrice, "Mint: Insufficient Funds For This Transaction");

        // Validate Gifts
        require(nftAddresses.length == qty, "Mint: Invalid gift parameters");
        require(nftTokenIds.length == qty, "Mint: Invalid gift parameters");

        uint256 firstMintTokenId = numberMinted; //Store the starting value of the mint batch

        // Do the Thing
        for(uint256 i = 0; i < qty; i++) {
            _addGiftToPool(firstMintTokenId + i, _msgSender(), nftAddresses[i], nftTokenIds[i]);
            _safeMint(_msgSender(), firstMintTokenId + i);
            numberMinted++;
        }
    }

    function _addGiftToPool(
      uint256 tokenId,
      address from,
      address nftAddress,
      uint256 nftTokenId
    ) internal virtual {
      // Do the Transfer. Will fail if this contract is not approved
      IERC721(nftAddress).transferFrom(from, address(this), nftTokenId);

      // Write it down
      _giftsGiven[tokenId] = Gift(nftAddress, tokenId, from, address(0), address(0));
      giftsLeftByTokenId.push(tokenId);
    }

    function claimGifts(uint256[] memory tokenIds) external {
      console.log('senderHere', _msgSender());
      this.claimGifts(tokenIds, _msgSender());
    }

    function claimGifts(uint256[] memory tokenIds, address gifteeAddress) external {
      console.log('senderOverHere', _msgSender());
      console.log('txOrigin', tx.origin);
      console.log('gifteeAddress', gifteeAddress);
      // Can Claim At All
      require(claimActive, "Claim: Claiming Period has not started yet!");

      // Iterate through RagingSanta token Ids
      for(uint256 i = 0; i < tokenIds.length; i++) {
        uint256 tokenId = tokenIds[i];

        console.log('tokenId', tokenId);
        console.log('owner', _owners[tokenId]);
        console.log('sender', _msgSender());
        bool wasDelegated = tx.origin != gifteeAddress;
        console.log('wasDelegated', wasDelegated);
        // Does Sender own these tokens?
        require(_owners[tokenId] == tx.origin, "Claim: Tx Origin is not the owner of this token.");

        // Have these tokens been claimed yet?
        require(_tokenIdOfClaimedGift[tokenId] == 0, "Claim: Gift has already been claimed");

        uint256 rn = uint256(
          keccak256(
            abi.encodePacked(blockhash(block.number - 1), giftsLeftByTokenId.length, tokenId, nonce)
          )
        );

        uint256 giftIndexToTry = rn % giftsLeftByTokenId.length;
        Gift memory giftToClaim = _giftsGiven[giftsLeftByTokenId[giftIndexToTry]];
        uint8 tries = 0;

        // If theres no external giftee
        if (!wasDelegated) {

          // Check to make sure it's not your own gift
          while (giftToClaim.gifter == gifteeAddress && tries < maxTries) {
            console.log('giftIndexToTry', giftIndexToTry);
            console.log('Should give out gift', giftToClaim.nftAddress);
            console.log('tokenId', giftToClaim.tokenId);
            console.log('gifter Addy', giftToClaim.gifter);
            console.log('who is giftee', gifteeAddress);

            giftIndexToTry = (giftIndexToTry + 1) % giftsLeftByTokenId.length;
            giftToClaim = _giftsGiven[giftsLeftByTokenId[giftIndexToTry]];
            nonce++;
            tries++;
          }

          require(giftToClaim.gifter != gifteeAddress, "Could not find a valid gift to claim!");
        }

        console.log('landed on gift from ', giftToClaim.gifter);

        // Do the Transfer
        nonce++;
        IERC721(giftToClaim.nftAddress).transferFrom(address(this), gifteeAddress, giftToClaim.tokenId);

        // Remove gift from giftsLeft
        giftsLeftByTokenId[giftIndexToTry] = giftsLeftByTokenId[giftsLeftByTokenId.length - 1];
        giftsLeftByTokenId.pop();
        _giftsGiven[giftToClaim.tokenId].giftee = gifteeAddress;

        _tokenIdOfClaimedGift[tokenId] = giftToClaim.tokenId;

        if (wasDelegated) {
          _giftsGiven[giftToClaim.tokenId].gifteeDelegator = tx.origin;
        }
      }
    }

     /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _tokensOwned[owner].length;
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }

     /**
     * @dev See {IERC721-balanceOf}.
     */
    function tokensOwned(address owner) public view virtual returns (uint[] memory) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        return _tokensOwned[owner];
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) public virtual override {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        require(
            msg.sender == owner || isApprovedForAll(owner, msg.sender),
            "ERC721: approve caller is not owner nor approved for all"
        );

        _approve(to, tokenId);
    }


    /**
     * @dev Approve `to` to operate on `tokenId`
     *
     * Emits a {Approval} event.
     */
    function _approve(address to, uint256 tokenId) internal virtual {
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }



    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");

        return _tokenApprovals[tokenId];
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        require(operator != msg.sender, "ERC721: approve to caller");

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }
    
    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    /**
     * @dev Safely mints `tokenId` and transfers it to `to`.
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeMint(address to, uint256 tokenId) internal virtual {
        _safeMint(to, tokenId, "");
    }

    /**
     * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
     */
    function _safeMint(
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal virtual {
        _mint(to, tokenId);
        require(
            _checkOnERC721Received(address(0), to, tokenId, _data),
            "ERC721: transfer to non ERC721Receiver implementer"
        );
    }

    /**
     * @dev Mints `tokenId` and transfers it to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");
        require(!_exists(tokenId), "ERC721: token already minted");

        _beforeTokenTransfer(address(0), to, tokenId);

        _tokensOwned[to].push(tokenId);
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }
    
    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {}

    /**
     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
     * The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes optional data to send along with the call
     * @return bool whether the call correctly returned the expected magic value
     */
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) private returns (bool) {
        if (to.isContract()) {
            try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, _data) returns (bytes4 retval) {
                return retval == IERC721Receiver(to).onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    /**
     * @dev Transfers `tokenId` from `from` to `to`.
     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     *
     * Emits a {Transfer} event.
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        require(ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");

        _beforeTokenTransfer(from, to, tokenId);

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        // Remove tokenId from _tokensOwned[from]
        for(uint8 i = 0; i < _tokensOwned[from].length; i++) {
            if (_tokensOwned[from][i] == tokenId) {
              _tokensOwned[from][i] = _tokensOwned[from][_tokensOwned[from].length - 1];
              _tokensOwned[from].pop();
              break;
            }
        }

        // Add tokenId to _tokensOwned[to]
        _tokensOwned[to].push(tokenId);
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * `_data` is additional data, it has no specified format and it is sent in call to `to`.
     *
     * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
     * implement alternative mechanisms to perform token transfer, such as signature-based.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal virtual {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }


    /**
     * @dev Returns whether `spender` is allowed to manage `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }
}
