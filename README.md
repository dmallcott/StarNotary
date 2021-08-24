<h1>Hi</h1>

This is my submission for the StarNotary project. As per requested, here's the following information:

1) Your ERC-721 Token Name

    ```Star Notary```

2) Your ERC-721 Token Symbol

    ```STR```

3) Version of the Truffle and OpenZeppelin used

    ```
        Truffle > v5.4.6 
        Truffle (hdwallet-provider): ^1.5.0
        OpenZeppelin (Contracts) > ^4.3.0
    ```


## Something to consider

I'm using the _transfer method since _transferFrom now requires aproval or ownership before using. Ideally I would implement an approval flow before transfering tokens. But that would not be compatible with the project's requirements. Please do let me know if this isn't right.