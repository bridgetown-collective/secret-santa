pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

abstract contract Functional {
  function toString(uint256 value) internal pure returns (string memory) {
    if (value == 0) {
      return "0";
    }
    uint256 temp = value;
    uint256 digits;
    while (temp != 0) {
      digits++;
      temp /= 10;
    }
    bytes memory buffer = new bytes(digits);
    while (value != 0) {
      digits -= 1;
      buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
      value /= 10;
    }
    return string(buffer);
  }
}

contract RagingSantas is IERC721, Ownable, Functional, AccessControl {
    using SafeMath for uint256;
    using Address for address;

    // Provenance hash proving random distribution
    string public provHashMint;
    string public provHashMatch;
    bool public mintActive;
    bool public claimActive;

    uint256 public matchSeed;
    uint256 public totalGifts;

    uint256 public maxSupply;
    uint256 public mintPrice;
    uint256 public numberMinted;
    uint256 public numberClaimed;

    string private _baseURI;

    struct Gift {
      uint256 gifterTokenId;
      uint256 gifteeTokenId;
      uint256 nftTokenId;
      address nftAddress;
      address gifter;
      address giftee;
      address gifteeDelegator;
      bool hasClaimed;
    }

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping from address to specific tokens Owned
    mapping(address => uint256[]) private _tokensOwned;

    // Mapping from token ID to gifted gift
    mapping(uint256 => Gift) private _giftsByTID;

    // Mapping from token ID (to make a claim) to token ID tied to claimed gift
    mapping(uint256 => uint256) private _giftRefsToClaim;

    // The Gift Pool
    uint256[] public giftPoolTokens;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    constructor(uint256 supply)
    {
        mintActive = false;
        claimActive = false;
        mintPrice = 0.03 ether;
        maxSupply = supply;
    }
    
    function activateMint() external onlyOwner {
        mintActive = true;
    }

    function activateClaim(uint256 seed) external onlyOwner {
        totalGifts = giftPoolTokens.length;
        require(totalGifts > 1);

        claimActive = true;
        matchSeed = seed;
        mintActive = false;

        uint256 mLength = totalGifts - 1;
        for (uint256 i = 0; i < mLength; i++) {
          uint256 n = uint256(keccak256(abi.encodePacked(i + seed))) % (totalGifts);
          (giftPoolTokens[i], giftPoolTokens[n]) = (giftPoolTokens[n], giftPoolTokens[i]);
        }

        for (uint256 i = 0; i < mLength; i++) {
          _giftsByTID[giftPoolTokens[i]].gifteeTokenId = giftPoolTokens[i + 1];
          _giftRefsToClaim[giftPoolTokens[i + 1]] = giftPoolTokens[i];
        }
        _giftsByTID[giftPoolTokens[mLength]].gifteeTokenId = giftPoolTokens[0];
        _giftRefsToClaim[giftPoolTokens[0]] = giftPoolTokens[mLength];
    }

    function numGiftsLeft() external view virtual returns (uint256) {
        return giftPoolTokens.length;
    }

    function setBaseURI(string memory newURI) external onlyOwner {
        _baseURI = newURI;
    }

    function setProvHashMint(string memory newHash) external onlyOwner {
        provHashMint = newHash;
    }
    
    function setProvHashMatch(string memory newHash) external onlyOwner {
        provHashMatch = newHash;
    }

    function tokenURI(uint256 tokenId) external view returns (string memory){
        require(_exists(tokenId), "Nonexistent token");
        return string(abi.encodePacked(_baseURI, toString(tokenId), ".json"));
    }

    function contractURI() external view returns (string memory) {
        return string(abi.encodePacked(_baseURI,"contract.json"));
    }

    function mint(uint256 qty, address[] memory nftAddresses, uint256[] memory nftTokenIds) external payable {
        // Validate Mint
        require(mintActive, "Minting Inactive");
        require((qty + numberMinted) <= maxSupply, "Mint Sold Out");
        require(qty <= 10, "Exceeded Max Per Txn");
        require((_tokensOwned[_msgSender()].length + qty) <= 30, "Exceed Max Per Wallet");
        require(msg.value >= qty * mintPrice, "Insufficient Funds");

        // Validate Gifts
        require(nftAddresses.length == qty, "Invalid gift");
        require(nftTokenIds.length == qty, "Invalid gift");

        uint256 firstMintTokenId = numberMinted;

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
      _giftsByTID[tokenId] = Gift(
        tokenId,
        0,
        nftTokenId,
        nftAddress,
        from,
        address(0),
        address(0),
        false
      );

      giftPoolTokens.push(tokenId);
    }

    function getGiftByGifterToken(uint256 tId) external view virtual returns (Gift memory) {
        require(_owners[tId] != address(0), "Nonexistent Token");
        return _giftsByTID[tId];
    }

    function getGiftByGifteeToken(uint256 tId) external view virtual returns (Gift memory) {
        require(_owners[tId] != address(0), "Nonexistent Token");
        uint256 tIdClaim = _giftRefsToClaim[tId];
        return _giftsByTID[tIdClaim];
    }

    function claimGifts(uint256[] memory tokenIds) external {
      console.log('senderHere', _msgSender());
      this.claimGifts(tokenIds, _msgSender());
    }

    function claimGifts(uint256[] memory tokenIds, address gifteeAddress) external {
      // Can Claim At All
      require(claimActive, "Claiming Inactive");
      bool wasDelegated = tx.origin != gifteeAddress;

      // Iterate through RagingSanta token Ids
      for(uint256 i = 0; i < tokenIds.length; i++) {
        uint256 tId = tokenIds[i];

        // Does Sender own these tokens?
        require(_owners[tId] == tx.origin, "Not Owner");

        uint256 tIdClaim = _giftRefsToClaim[tId];
        Gift memory giftToClaim = _giftsByTID[tIdClaim];

        // Have these tokens been claimed yet?
        require(!giftToClaim.hasClaimed, "Gift Claimed");

        // For Testing / Remove before deploying
        require(giftToClaim.gifteeTokenId == tId, "Wrong Giftee");

        // Do the Transfer
        IERC721(giftToClaim.nftAddress).transferFrom(address(this), gifteeAddress, giftToClaim.nftTokenId);

        // Update the gift object
        _giftsByTID[tIdClaim].hasClaimed = true;
        _giftsByTID[tIdClaim].giftee = gifteeAddress;
        if (wasDelegated) {
          _giftsByTID[tIdClaim].gifteeDelegator = tx.origin;
        }
      }
      numberClaimed += tokenIds.length;
    }

     /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "Zero Address");
        return _tokensOwned[owner].length;
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "NonToken");
        return owner;
    }

     /**
     * @dev See {IERC721-balanceOf}.
     */
    function tokensOwned(address owner) public view virtual returns (uint[] memory) {
        require(owner != address(0), "Zero Address");
        return _tokensOwned[owner];
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
            "NonERC721Receiver"
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
        require(to != address(0), "Zero Address");
        require(!_exists(tokenId), "Already Minted");

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
     * - When `to` is zero, ``from``s `tokenId` will be burned.
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
                    revert("NonERC721Receiver");
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
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(msg.sender, tokenId), "NonApproved");

        _transfer(from, to, tokenId);
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
        require(ownerOf(tokenId) == from, "NotOwner");
        require(to != address(0), "ZeroAddress");

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
        require(_isApprovedOrOwner(msg.sender, tokenId), "NotApproved");
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
        require(_checkOnERC721Received(from, to, tokenId, _data), "NonERC721Receiver");
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) public virtual override {
        address owner = ownerOf(tokenId);
        require(to != owner, "Owner");

        require(
            msg.sender == owner || isApprovedForAll(owner, msg.sender),
            "NotApproved"
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
        require(_exists(tokenId), "NonToken");

        return _tokenApprovals[tokenId];
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        require(operator != msg.sender, "SelfApproval");

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
     * @dev Returns whether `spender` is allowed to manage `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), "NonToken");
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    receive() external payable {}

    fallback() external payable {}
}
