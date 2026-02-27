const { ethers } = require('ethers');
const PapagedonABI = require('../contracts/artifacts/contracts/PapagedonNFT.sol/PapagedonNFT.json').abi;

/**
 * Service to interact with the Papagedon NFT Smart Contract on Avalanche.
 */
class ContractService {
    constructor(providerUrl, contractAddress) {
        this.provider = new ethers.JsonRpcProvider(providerUrl);
        this.contractAddress = contractAddress;
        this.contract = new ethers.Contract(contractAddress, PapagedonABI, this.provider);
    }

    /**
     * Checks if a user has access to a specific immersive experience.
     */
    async checkAccess(userAddress, tokenId) {
        try {
            const hasAccess = await this.contract.hasAccess(userAddress, tokenId);
            return hasAccess;
        } catch (error) {
            console.error("Blockchain Access Error:", error);
            return false;
        }
    }

    /**
     * Get Royalty Info for a token (EIP-2981)
     */
    async getRoyaltyInfo(tokenId, salePrice) {
        try {
            const [receiver, royaltyAmount] = await this.contract.royaltyInfo(tokenId, salePrice);
            return { receiver, royaltyAmount };
        } catch (error) {
            console.error("Royalty Retrieval Error:", error);
            return null;
        }
    }
}

module.exports = ContractService;
