import smartpy as sp


class MarketPlace(sp.contract):
    @sp.entry_point
    def sellToken(self, params):
        sp.verify(self.data.tokens.contains(
            params.token_id), message="Invalid Token ID.")
        sp.verify(self.data.ledger[sp.sender].tokens.contains(
            params.token_id), message="Token Not Owned.")
        sp.verify(~self.data.tokens_on_sale.contains(
            params.token_id), message="Token is Already on Sale.")
        sp.verify(params.price != sp.mutez(0),
                  message="Please Enter a valid price.")
        self.data.tokens_on_sale[params.token_id] = sp.record(
            owner=sp.sender, price=params.price)

    @sp.entry_point
    def buyToken(self, params):
        sp.verify(self.data.tokens.contains(
            params.token_id), message="Invalid Token ID.")
        sp.verify(self.data.tokens_on_sale.contains(
            params.token_id), message="Token is not on Sale.")
        tokenPrice = self.data.tokens_on_sale[params.token_id].price
        tokenOwner = self.data.tokens_on_sale[params.token_id].owner
        sp.verify(tokenOwner != sp.sender,
                  message="Owner cannot buy already owned token.")
        sp.verify(tokenPrice <= sp.amount,
                  message="Pay proper amount for the token.")
        sp.send(tokenOwner, tokenPrice)
        self.data.ledger[tokenOwner].tokens.remove(params.token_id)
        del self.data.tokens_on_sale[params.token_id]
        sp.if self.data.ledger.contains(sp.sender):
            self.data.ledger[sp.sender].tokens.add(params.token_id)
        sp.else:
            self.data.ledger[sp.sender] = Ledger_value.make(1)
            self.data.ledger[sp.sender].tokens.add(params.token_id)

    @sp.entry_point
    def unlistToken(self, params):
        sp.verify(self.data.tokens.contains(
            params.token_id), message="Invalid Token ID.")
        sp.verify(self.data.tokens_on_sale.contains(
            params.token_id), message="Token is not on Sale.")
        tokenOwner = self.data.tokens_on_sale[params.token_id].owner
        sp.verify(sp.sender == tokenOwner,
                  message="Only Token Owner can unlist the token from marketplace.")
        del self.data.tokens_on_sale[params.token_id]