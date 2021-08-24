const StarNotary = artifacts.require("StarNotary");

contract('StarNotary', (accounts) => {

    it('can Create a Star', () => {
        let instance;
        const tokenId = 1;
        const expectedStarInfo = 'Awesome Star!';

        return StarNotary.deployed()
            .then(inst => instance = inst)
            .then(_ => instance.createStar(expectedStarInfo, tokenId, {from: accounts[0]}))
            .then(_ => instance.tokenIdToStarInfo.call(tokenId))
            .then(starInfo => assert.equal(starInfo, expectedStarInfo))
    });
    
    it('lets starOwner put up their star for sale', () => {
        let instance;
        let starOwner = accounts[1];
        let starId = 2;
        let starPrice = web3.utils.toWei(".01", "ether");

        return StarNotary.deployed()
            .then(inst => instance = inst)
            .then(_ => instance.createStar('awesome star', starId, {from: starOwner}))
            .then(_ => instance.putStarUpForSale(starId, starPrice, {from: starOwner}))
            .then(_ => instance.starsForSale.call(starId))
            .then(starInfo => assert.equal(starInfo, starPrice))
    });

    it('lets starOwner get the funds after the sale', async() => {
        const starOwner = accounts[1];
        const starBuyer = accounts[2];
        const starId = 3;
        const starPrice = web3.utils.toWei(".01", "ether");
        const starOffer = web3.utils.toWei(".05", "ether");

        let instance;
        let balanceOfOwnerBeforeTransaction;
        let balanceOfOwnerAfterTransaction;

        return StarNotary.deployed()
            .then(inst => instance = inst)
            .then(_ => instance.createStar('awesome star', starId, {from: starOwner}))
            .then(_ => instance.putStarUpForSale(starId, starPrice, {from: starOwner}))
            .then(_ => web3.eth.getBalance(starOwner))
            .then(balance => balanceOfOwnerBeforeTransaction = balance)
            .then(_ => instance.buyStar(starId, {from: starBuyer, value: starOffer}))
            .then(_ => web3.eth.getBalance(starOwner))
            .then(balance => balanceOfOwnerAfterTransaction = balance)
            .then(_ => assert.equal(Number(balanceOfOwnerAfterTransaction), Number(balanceOfOwnerBeforeTransaction) + Number(starPrice)))
            .then(_ => instance.starsForSale.call(starId))
            .then(starInfo => assert.equal(starInfo, 0)); // Apparently there's no null
    });
    
    it('lets user2 buy a star, if it is put up for sale', async() => {
        let instance = await StarNotary.deployed();
        let user1 = accounts[1];
        let user2 = accounts[2];
        let starId = 4;
        let starPrice = web3.utils.toWei(".01", "ether");
        let balance = web3.utils.toWei(".05", "ether");
        await instance.createStar('awesome star', starId, {from: user1});
        await instance.putStarUpForSale(starId, starPrice, {from: user1});
        let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
        await instance.buyStar(starId, {from: user2, value: balance});
        assert.equal(await instance.ownerOf.call(starId), user2);
    });
    
    it('lets user2 buy a star and decreases its balance in ether', async() => {
        let instance = await StarNotary.deployed();
        let user1 = accounts[1];
        let user2 = accounts[2];
        let starId = 5;
        let starPrice = web3.utils.toWei(".01", "ether");
        let balance = web3.utils.toWei(".05", "ether");
        await instance.createStar('awesome star', starId, {from: user1});
        await instance.putStarUpForSale(starId, starPrice, {from: user1});
        let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
        const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
        await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
        const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
        let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
        assert.equal(value, starPrice);
      });

    

    // Implement Task 2 Add supporting unit tests

    it('can add the star name and star symbol properly', () => {
        let instance;
        return StarNotary.deployed()
            .then(inst => instance = inst)
            .then(_ => instance.name())
            .then(name => assert.equal(name, "Star Notary"))
            .then(_ => instance.symbol())
            .then(symbol => assert.equal(symbol, "STR"))
    });

    it('lets 2 users exchange stars', () => {
        let instance;
        const owner1 = accounts[1];        
        const star1 = 6;
        const owner2 = accounts[2];
        const star2 = 7;
        
        return StarNotary.deployed()
            .then(inst => instance = inst)
            .then(_ => instance.createStar('Star one', star1, {from: owner1}))
            .then(_ => instance.createStar('Star two', star2, {from: owner2}))
            .then(_ => instance.exchangeStars(star1, star2, { from: owner1 }))
            .then(_ => instance.ownerOf(star2))
            .then(ownerOfStar2 => assert.equal(owner1, ownerOfStar2))
            .then(_ => instance.ownerOf(star1))
            .then(ownerOfStar1 => assert.equal(owner2, ownerOfStar1))

    });

    it("can't transfer a star I don't own", () => {
        let instance;
        const owner1 = accounts[1];        
        const star1 = 8;
        const owner2 = accounts[2];
        
        return StarNotary.deployed()
            .then(inst => instance = inst)
            .then(_ => instance.createStar('Star one', star1, {from: owner1}))
            .then(_ => instance.transferStar(owner2, star1, { from: owner2 }))
            .catch(error => assert.include(error.message, 'transfer caller is not owner nor approved', 'test failed from unexpected error'))
    });

    it('lets a user transfer a star', () => {
        let instance;
        const owner = accounts[1];        
        const star = 9;
        const recipient = accounts[2];
        
        return StarNotary.deployed()
            .then(inst => instance = inst)
            .then(_ => instance.createStar('Star one', star, {from: owner}))
            .then(_ => instance.transferStar(recipient, star, { from: owner }))
            .then(_ => instance.ownerOf(star))
            .then(ownerOfStar => assert.equal(recipient, ownerOfStar))
    });

    it('lookUptokenIdToStarInfo test', () => {
        let instance;
        const owner = accounts[1];        
        const star = 10;
        const starName = 'Star one';
        
        return StarNotary.deployed()
            .then(inst => instance = inst)
            .then(_ => instance.createStar(starName, star, {from: owner}))
            .then(_ => instance.lookUptokenIdToStarInfo(star))
            .then(starInfo => assert.equal(starName, starInfo))
    });
});