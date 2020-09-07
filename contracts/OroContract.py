import smartpy as sp


class PlayerFantasyPointsOracle(sp.Contract):
    def __init__(self, admin):
        self.init(playerPoints=sp.map(tkey=sp.TNat, tvalue=sp.TRecord(
            points=sp.TNat, rank=sp.TNat)), keysset=sp.set([admin]), owner=admin)

    @sp.entry_point
    def feedData(self, params):
        sp.verify(self.data.keysset.contains(
            sp.sender), message="Only Contract Owner can feed Data.")
        sp.for player in params.array:
            self.data.playerPoints[player.player_id] = sp.record(
                points=player.points, rank=player.rank)

    @sp.entry_point
    def addDataContributor(self, params):
        sp.if sp.sender == self.data.owner:
            self.data.keysset.add(params.contributor)

    @sp.entry_point
    def getDataFromOrO(self, params):
        contract = sp.contract(sp.TMap(k=sp.TNat, v=sp.TRecord(points=sp.TNat, rank=sp.TNat)),
                               sp.sender, entry_point="receiveDataFromOrO").open_some()
        sp.transfer(self.data.playerPoints, sp.mutez(0), contract)


@sp.add_test(name="FantasyPoints")
def test():
    scenario = sp.test_scenario()
    oracle = PlayerFantasyPointsOracle(
        sp.address('tz1dJVWP5nAd2dfNQhpDQdGefQoED7aRy8qn'))
    scenario += oracle
    scenario += oracle.feedData(array=[sp.record(player_id=0, points=369, rank=1), sp.record(player_id=1, points=284, rank=2),
                                       sp.record(player_id=2, points=260, rank=3)]).run(sender=sp.address('tz1beX9ZDev6SVVW9yJwNYA89362ZpWuDwou'))
    scenario += oracle.getDataFromOrO().run(sender=sp.address("KT1-AAA"),
                                            amount=sp.mutez(5000))
    scenario += oracle.getDataFromOrO().run(sender=sp.address("KT1-BBB"),
                                            amount=sp.mutez(4000))
