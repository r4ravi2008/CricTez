
import smartpy as sp


class FA2_config:
    def __init__(self,
                 debug_mode=False,
                 single_asset=False,
                 non_fungible=True,
                 add_mutez_transfer=False,
                 readable=True,
                 force_layouts=True,
                 support_operator=True,
                 assume_consecutive_token_ids=False,
                 add_permissions_descriptor=False,
                 lazy_entry_points=False,
                 lazy_entry_points_multiple=False
                 ):

        if debug_mode:
            self.my_map = sp.map
        else:
            self.my_map = sp.big_map
        # The option `debug_mode` makes the code generation use
        # regular maps instead of big-maps, hence it makes inspection
        # of the state of the contract easier.

        self.single_asset = single_asset
        # This makes the contract save some gas and storage by
        # working only for the token-id `0`.

        self.non_fungible = non_fungible
        # Enforce the non-fungibility of the tokens, i.e. the fact
        # that total supply has to be 1.

        self.readable = readable
        # The `readable` option is a legacy setting that we keep around
        # only for benchmarking purposes.
        #
        # User-accounts are kept in a big-map:
        # `(user-address * token-id) -> ownership-info`.
        #
        # For the Babylon protocol, one had to use `readable = False`
        # in order to use `PACK` on the keys of the big-map.

        self.force_layouts = force_layouts
        # The specification requires all interface-fronting records
        # and variants to be *right-combs;* we keep
        # this parameter to be able to compare performance & code-size.

        self.support_operator = support_operator
        # The operator entry-points always have to be there, but there is
        # definitely a use-case for having them completely empty (saving
        # storage and gas when `support_operator` is `False).

        self.assume_consecutive_token_ids = assume_consecutive_token_ids
        # For a previous version of the TZIP specification, it was
        # necessary to keep track of the set of all tokens in the contract.
        #
        # The set of tokens is for now still available; this parameter
        # guides how to implement it:
        # If `true` we don't need a real set of token ids, just to know how
        # many there are.

        self.add_mutez_transfer = add_mutez_transfer
        # Add an entry point for the administrator to transfer tez potentially
        # in the contract's balance.

        self.add_permissions_descriptor = add_permissions_descriptor
        # Add the `permissions_descriptor` entry-point; it is an
        # optional part of the specification and
        # costs gas and storage so we keep the option of not adding it.
        #
        # Note that if `support_operator` is `False`, the
        # permissions-descriptor becomes technically required.

        self.lazy_entry_points = lazy_entry_points
        self.lazy_entry_points_multiple = lazy_entry_points_multiple
        #
        # Those are “compilation” options of SmartPy into Michelson.
        #
        if lazy_entry_points and lazy_entry_points_multiple:
            raise Exception(
                "Cannot provide lazy_entry_points and lazy_entry_points_multiple")

        name = "FA2"
        if debug_mode:
            name += "-debug"
        if single_asset:
            name += "-single_asset"
        if non_fungible:
            name += "-nft"
        if add_mutez_transfer:
            name += "-mutez"
        if not readable:
            name += "-no_readable"
        if not force_layouts:
            name += "-no_layout"
        if not support_operator:
            name += "-no_ops"
        if not assume_consecutive_token_ids:
            name += "-no_toknat"
        if add_permissions_descriptor:
            name += "-perm_desc"
        if lazy_entry_points:
            name += "-lep"
        if lazy_entry_points_multiple:
            name += "-lepm"
        self.name = name


# Auxiliary Classes and Values
##
# The definitions below implement SmartML-types and functions for various
# important types.
##
token_id_type = sp.TNat
player_id_type = sp.TNat


class Error_message:
    def __init__(self, config):
        self.config = config
        self.prefix = "FA2_"

    def make(self, s): return (self.prefix + s)
    def token_undefined(self): return self.make("TOKEN_UNDEFINED")
    def insufficient_balance(self): return self.make("INSUFFICIENT_BALANCE")
    def not_operator(self): return self.make("NOT_OPERATOR")
    def not_owner(self): return self.make("NOT_OWNER")
    def operators_unsupported(self): return self.make("OPERATORS_UNSUPPORTED")

# The current type for a batched transfer in the specification is as
# follows:
##
# ```ocaml
# type transfer = {
##   from_ : address;
# txs: {
##     to_ : address;
##     token_id : token_id;
##     amount : nat;
# } list
# } list
# ```
##
# This class provides helpers to create and force the type of such elements.
# It uses the `FA2_config` to decide whether to set the right-comb layouts.


class Batch_transfer:
    def __init__(self, config):
        self.config = config

    def get_transfer_type(self):
        tx_type = sp.TRecord(to_=sp.TAddress,
                             token_id=token_id_type)
        if self.config.force_layouts:
            tx_type = tx_type.layout(
                ("to_", "token_id")
            )
        transfer_type = sp.TRecord(from_=sp.TAddress,
                                   txs=sp.TList(tx_type)).layout(
            ("from_", "txs"))
        return transfer_type

    def get_type(self):
        return sp.TList(self.get_transfer_type())

    def item(self, from_, txs):
        v = sp.record(from_=from_, txs=txs)
        return sp.set_type_expr(v, self.get_transfer_type())
##
# `Operator_param` defines type types for the `%update_operators` entry-point.


class Operator_param:
    def __init__(self, config):
        self.config = config

    def get_type(self):
        t = sp.TRecord(
            owner=sp.TAddress,
            operator=sp.TAddress)
        if self.config.force_layouts:
            t = t.layout(("owner", "operator"))
        return t

    def make(self, owner, operator):
        r = sp.record(owner=owner,
                      operator=operator)
        return sp.set_type_expr(r, self.get_type())

# The class `Ledger_key` defines the key type for the main ledger (big-)map:
##
# - In *“Babylon mode”* we also have to call `sp.pack`.
# - In *“single-asset mode”* we can just use the user's address.


class Ledger_key:
    def __init__(self, config):
        self.config = config

    def make(self, user, token):
        user = sp.set_type_expr(user, sp.TAddress)
        # token = sp.set_type_expr(token, token_id_type)
        if self.config.single_asset:
            result = user
        else:
            result = user
        if self.config.readable:
            return result
        else:
            return sp.pack(result)

# For now a value in the ledger is just the user's balance. Previous
# versions of the specification required more information; potential
# extensions may require other fields.


class Ledger_value:
    def get_type():
        return sp.TRecord(tokens=sp.TSet(t=sp.TNat))

    def make(token):
        return sp.record(tokens=sp.set([token]))

# The link between operators and the addresses they operate is kept
# in a *lazy set* of `(owner × operator)` values.
##
# A lazy set is a big-map whose keys are the elements of the set and
# values are all `Unit`.


class Operator_set:
    def __init__(self, config):
        self.config = config

    def inner_type(self):
        return sp.TRecord(owner=sp.TAddress,
                          operator=sp.TAddress).layout(("owner", "operator"))

    def key_type(self):
        if self.config.readable:
            return self.inner_type()
        else:
            return sp.TBytes

    def make(self):
        return self.config.my_map(tkey=self.key_type(), tvalue=sp.TUnit)

    def make_key(self, owner, operator):
        metakey = sp.record(owner=owner, operator=operator)
        metakey = sp.set_type_expr(metakey, self.inner_type())
        if self.config.readable:
            return metakey
        else:
            return sp.pack(metakey)

    def add(self, set, owner, operator):
        set[self.make_key(owner, operator)] = sp.unit

    def remove(self, set, owner, operator):
        del set[self.make_key(owner, operator)]

    def is_member(self, set, owner, operator):
        return set.contains(self.make_key(owner, operator))


class Token_meta_data:
    def __init__(self, config):
        self.config = config

    def get_type(self):
        t = sp.TRecord(
            token_id=token_id_type,
            card_score=sp.TNat,
            inMatch=sp.TBool,
            player_id=sp.TNat,
            extras=sp.TMap(sp.TString, sp.TString)
        )
        if self.config.force_layouts:
            t = t.layout(("token_id",
                          ("card_score",
                           ("inMatch",
                            ("player_id", "extras")))))
        return t

    def set_type_and_layout(self, expr):
        sp.set_type(expr, self.get_type())

    def request_type(self):
        return token_id_type


class Player_meta_data:
    def __init__(self, config):
        self.config = config

    def get_type(self):
        t = sp.TRecord(
            player_id=player_id_type,

            name=sp.TString,
            extras=sp.TMap(sp.TString, sp.TString)
        )
        if self.config.force_layouts:
            t = t.layout(("player_id", ("name")))
        return t

    def set_type_and_layout(self, expr):
        sp.set_type(expr, self.get_type())

    def request_type(self):
        return player_id_type


class Player_id_set:
    def __init__(self, config):
        self.config = config

    def empty(self):
        if self.config.assume_consecutive_token_ids:
            # The "set" is its cardinal.
            return sp.nat(0)
        else:
            return sp.set(t=player_id_type)

    def add(self, metaset, v):
        if self.config.assume_consecutive_token_ids:
            metaset.set(sp.max(metaset, v + 1))
        else:
            metaset.add(v)

    def contains(self, metaset, v):
        if self.config.assume_consecutive_token_ids:
            return (v < metaset)
        else:
            metaset.contains(v)


class Permissions_descriptor:
    def __init__(self, config):
        self.config = config

    def get_type(self):
        operator_transfer_policy = sp.TVariant(
            no_transfer=sp.TUnit,
            owner_transfer=sp.TUnit,
            owner_or_operator_transfer=sp.TUnit)
        if self.config.force_layouts:
            operator_transfer_policy = operator_transfer_policy.layout(
                ("no_transfer",
                 ("owner_transfer",
                  "owner_or_operator_transfer")))
        owner_transfer_policy = sp.TVariant(
            owner_no_hook=sp.TUnit,
            optional_owner_hook=sp.TUnit,
            required_owner_hook=sp.TUnit)
        if self.config.force_layouts:
            owner_transfer_policy = owner_transfer_policy.layout(
                ("owner_no_hook",
                 ("optional_owner_hook",
                  "required_owner_hook")))
        custom_permission_policy = sp.TRecord(
            tag=sp.TString,
            config_api=sp.TOption(sp.TAddress))
        main = sp.TRecord(
            operator=operator_transfer_policy,
            receiver=owner_transfer_policy,
            sender=owner_transfer_policy,
            custom=sp.TOption(custom_permission_policy))
        if self.config.force_layouts:
            main = main.layout(("operator",
                                ("receiver",
                                 ("sender", "custom"))))
        return main

    def set_type_and_layout(self, expr):
        sp.set_type(expr, self.get_type())

    def make(self):
        def uv(s):
            return sp.variant(s, sp.unit)
        operator = ("owner_or_operator_transfer"
                    if self.config.support_operator
                    else "owner_transfer")
        v = sp.record(
            operator=uv(operator),
            receiver=uv("owner_no_hook"),
            sender=uv("owner_no_hook"),
            custom=sp.none
        )
        v = sp.set_type_expr(v, self.get_type())
        return v

# The set of all tokens is represented by a `nat` if we assume that token-ids
# are consecutive, or by an actual `(set nat)` if not.
##
# - Knowing the set of tokens is useful for throwing accurate error messages.
# - Previous versions of the specification required this set for functional
# behavior (operators worked per-token).


class Token_id_set:
    def __init__(self, config):
        self.config = config

    def empty(self):
        if self.config.assume_consecutive_token_ids:
            # The "set" is its cardinal.
            return sp.nat(0)
        else:
            return sp.set(t=token_id_type)

    def add(self, metaset, v):
        if self.config.assume_consecutive_token_ids:
            metaset.set(sp.max(metaset, v + 1))
        else:
            metaset.add(v)

    def contains(self, metaset, v):
        if self.config.assume_consecutive_token_ids:
            return (v < metaset)
        else:
            metaset.contains(v)

##
# Implementation of the Contract
##
# `mutez_transfer` is an optional entry-point, hence we define it “outside” the
# class:


def mutez_transfer(contract, params):
    sp.verify(sp.sender == contract.data.administrator)
    sp.set_type(params.destination, sp.TAddress)
    sp.set_type(params.amount, sp.TMutez)
    sp.send(params.destination, params.amount)
##
# The `FA2` class build a contract according to an `FA2_config` and an
# administrator address.
##
# - We see the use of
# [`sp.entry_point`](https://www.smartpy.io/dev/reference.html#_entry_points)
# as a function instead of using annotations in order to allow
# optional entry points.
# - The storage field `metadata_string` is a placeholder, the build
# system replaces the field annotation with a specific version-string, such
# as `"version_20200602_tzip_b916f32"`: the version of FA2-smartpy and
# the git commit in the TZIP [repository](https://gitlab.com/tzip/tzip) that
# the contract should obey.


class FA2(sp.Contract):
    def __init__(self, config, admin):
        self.config = config
        self.error_message = Error_message(self.config)
        self.operator_set = Operator_set(self.config)
        self.operator_param = Operator_param(self.config)
        self.token_id_set = Token_id_set(self.config)
        self.ledger_key = Ledger_key(self.config)
        self.token_meta_data = Token_meta_data(self.config)
        self.permissions_descriptor_ = Permissions_descriptor(self.config)
        self.batch_transfer = Batch_transfer(self.config)
        self.player_meta_data = Player_meta_data(self.config)
        self.player_id_set = Player_id_set(self.config)

        if self.config.add_mutez_transfer:
            self.transfer_mutez = sp.entry_point(mutez_transfer)
        if self.config.add_permissions_descriptor:
            def permissions_descriptor(self, params):
                sp.set_type(params, sp.TContract(
                    self.permissions_descriptor_.get_type()))
                v = self.permissions_descriptor_.make()
                sp.transfer(v, sp.mutez(0), params)
            self.permissions_descriptor = sp.entry_point(
                permissions_descriptor)
        if config.lazy_entry_points:
            self.add_flag("lazy_entry_points")
        if config.lazy_entry_points_multiple:
            self.add_flag("lazy_entry_points_multiple")
        self.exception_optimization_level = "DefaultLine"
        self.init(
            paused=False,
            ledger=self.config.my_map(tvalue=Ledger_value.get_type()),
            tokens=self.config.my_map(tvalue=self.token_meta_data.get_type()),
            operators=self.operator_set.make(),
            administrator=admin,
            all_tokens=self.token_id_set.empty(),
            players=self.config.my_map(
                tkey=sp.TNat, tvalue=self.player_meta_data.get_type()),
            tokens_on_sale=sp.big_map(tkey=sp.TNat, tvalue=sp.TRecord(
                owner=sp.TAddress, price=sp.TMutez)),
            selected_tokens=sp.map(
                tkey=sp.TAddress, tvalue=sp.TRecord(tokens=sp.TSet(sp.TNat))),
            matches=sp.map(tkey=sp.TNat, tvalue=sp.TRecord(
                teamA=sp.TString, teamB=sp.TString, active=sp.TBool, finished=sp.TBool, date=sp.TString, compete=sp.TBool)),
            playerPoints=sp.map(tkey=sp.TNat, tvalue=sp.TRecord(
                points=sp.TNat, rank=sp.TNat)),
            keysset=sp.set([admin]),
        )

    @sp.entry_point
    def feedData(self, params):
        sp.verify(self.data.keysset.contains(
            sp.sender), message="Only Contract Owner can feed Data.")
        sp.for player in params.array:
            self.data.playerPoints[player.player_id] = sp.record(
                points=player.points, rank=player.rank)

    @sp.entry_point
    def addDataContributor(self, params):
        sp.if sp.sender == self.data.administrator:
            self.data.keysset.add(params.contributor)

    @sp.entry_point
    def set_pause(self, params):
        sp.verify(sp.sender == self.data.administrator)
        self.data.paused = params

    @sp.entry_point
    def set_administrator(self, params):
        sp.verify(sp.sender == self.data.administrator)
        self.data.administrator = params

    @sp.entry_point
    def mint(self, params):
        sp.verify(sp.sender == self.data.administrator)
        # We don't check for pauseness because we're the admin.
        if self.config.single_asset:
            sp.verify(params.token_id == 0, "single-asset: token-id <> 0")
        if self.config.non_fungible:
            # sp.verify(params.amount == 1, "NFT-asset: amount <> 1")
            sp.verify(~ self.token_id_set.contains(self.data.all_tokens,
                                                   params.token_id),
                      "NFT-asset: cannot mint twice same token")
        sp.verify(self.data.players.contains(
            params.player_id), "Invalid Player ID")
        user = self.ledger_key.make(params.address, params.token_id)
        self.token_id_set.add(self.data.all_tokens, params.token_id)
        sp.if self.data.ledger.contains(user):
            self.data.ledger[user].tokens.add(params.token_id)
        sp.else:
            self.data.ledger[user] = Ledger_value.make(params.token_id)
        sp.if self.data.tokens.contains(params.token_id):
            pass
        sp.else:
            self.data.tokens[params.token_id] = sp.record(
                token_id=params.token_id,
                player_id=params.player_id,
                card_score=100,
                extras=sp.map(),
                inMatch=False
            )

    @sp.entry_point
    def transfer(self, params):
        sp.verify(~self.data.paused)
        sp.set_type(params, self.batch_transfer.get_type())
        sp.for transfer in params:
            current_from = transfer.from_
            if self.config.support_operator:
                sp.verify(
                    (sp.sender == self.data.administrator) |
                    (current_from == sp.sender) |
                    self.operator_set.is_member(self.data.operators,
                                                current_from,
                                                sp.sender),
                    message=self.error_message.not_operator())
            else:
                sp.verify(
                    (sp.sender == self.data.administrator) |
                    (current_from == sp.sender),
                    message=self.error_message.not_owner())
            sp.for tx in transfer.txs:
                #sp.verify(tx.amount > 0, message = "TRANSFER_OF_ZERO")
                if self.config.single_asset:
                    sp.verify(tx.token_id == 0, "single-asset: token-id <> 0")
                sp.verify(self.data.tokens.contains(tx.token_id),
                          message=self.error_message.token_undefined())
                # If amount is 0 we do nothing now:
                from_user = self.ledger_key.make(current_from, tx.token_id)
                sp.verify(
                    self.data.ledger[from_user].tokens.contains(tx.token_id),
                    message=self.error_message.insufficient_balance())
                to_user = self.ledger_key.make(tx.to_, tx.token_id)
                # self.data.ledger[from_user].balance = sp.as_nat(
                #     self.data.ledger[from_user].balance - tx.amount)
                self.data.ledger[from_user].tokens.remove(tx.token_id)
                sp.if self.data.ledger.contains(to_user):
                    self.data.ledger[to_user].tokens.add(tx.token_id)
                sp.else:
                    self.data.ledger[to_user] = Ledger_value.make(1)
                    self.data.ledger[to_user].tokens.add(tx.token_id)

    @sp.entry_point
    def token_metadata_registry(self, params):
        sp.verify(~self.data.paused)
        sp.set_type(params, sp.TContract(sp.TAddress))
        sp.transfer(sp.to_address(sp.self), sp.mutez(0), params)

    @sp.entry_point
    def token_metadata(self, params):
        sp.verify(~self.data.paused)
        sp.set_type(params,
                    sp.TRecord(
                        token_ids=sp.TList(sp.TNat),
                        handler=sp.TLambda(
                            sp.TList(self.token_meta_data.get_type()),
                            sp.TUnit)
                    ).layout(("token_ids", "handler")))

        def f_on_request(req):
            self.token_meta_data.set_type_and_layout(self.data.tokens[req])
            sp.result(self.data.tokens[req])
        sp.compute(params.handler(params.token_ids.map(f_on_request)))

    @sp.entry_point
    def update_operators(self, params):
        sp.set_type(params, sp.TList(
            sp.TVariant(
                add_operator=self.operator_param.get_type(),
                remove_operator=self.operator_param.get_type())))
        if self.config.support_operator:
            sp.for update in params:
                with update.match_cases() as arg:
                    with arg.match("add_operator") as upd:
                        sp.verify((upd.owner == sp.sender) |
                                  (sp.sender == self.data.administrator))
                        self.operator_set.add(self.data.operators,
                                              upd.owner,
                                              upd.operator)
                    with arg.match("remove_operator") as upd:
                        sp.verify((upd.owner == sp.sender) |
                                  (sp.sender == self.data.administrator))
                        self.operator_set.remove(self.data.operators,
                                                 upd.owner,
                                                 upd.operator)
        else:
            sp.failwith(self.error_message.operators_unsupported())

    # Add Players
    @sp.entry_point
    def addPlayer(self, params):
        sp.verify(sp.sender == self.data.administrator)
        # We don't check for pauseness because we're the admin.
        sp.if self.data.players.contains(params.player_id):
            pass
        sp.else:
            self.data.players[params.player_id] = sp.record(
                player_id=params.player_id,
                name=params.name,
                extras=sp.map()
            )

    @sp.entry_point
    def sellToken(self, params):
        sp.verify(self.data.tokens.contains(
            params.token_id), message="Invalid Token ID.")
        sp.verify(self.data.ledger[sp.sender].tokens.contains(
            params.token_id), message="Token Not Owned.")
        sp.verify(self.data.tokens[params.token_id].inMatch == False,
                  message="Cannot Sell a Active Token. Please wait until match finishes.")
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
            self.data.ledger[sp.sender] = Ledger_value.make(params.token_id)

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

    @sp.entry_point
    def addMatch(self, params):
        sp.verify(sp.sender == self.data.administrator,
                  message="Only Admin Can Start/End a Match.")
        sp.verify(~self.data.matches.contains(params.match_id),
                  message="Match Already Exists.")
        self.data.matches[params.match_id] = sp.record(
            teamA=params.teamA, teamB=params.teamB, active=False, date=params.date, finished=False, compete=False)

    @sp.entry_point
    def activateMatch(self, params):
        sp.verify(sp.sender == self.data.administrator,
                  message="Only Admin Can Start/End a Match.")
        sp.verify(self.data.matches.contains(params.match_id),
                  message="Match Does not exist.")
        sp.verify(self.data.matches[params.match_id].active ==
                  False, message="Match is already Active")
        sp.verify(self.data.matches[params.match_id].finished ==
                  False, message="Match is finished.")
        sp.for match in self.data.matches.values():
            sp.if match.active == True:
                sp.failwith("Two Matches Cannot be Active at the same time")
        self.data.matches[params.match_id].active = True
        self.data.matches[params.match_id].compete = True

    @sp.entry_point
    def endCompete(self, params):
        sp.verify(sp.sender == self.data.administrator,
                  message="Only Admin Can Start/End a Match.")
        sp.verify(self.data.matches.contains(params.match_id),
                  message="Match Does not exist.")
        sp.verify(self.data.matches[params.match_id].active ==
                  True, message="Match is not active")
        sp.verify(self.data.matches[params.match_id].finished ==
                  False, message="Match is finished.")
        self.data.matches[params.match_id].compete = False

    @sp.entry_point
    def endMatch(self, params):
        # Call Oro Contratct which will return player-id -> points
        sp.verify(sp.sender == self.data.administrator,
                  message="Only Admin Can Start/End a Match.")
        sp.verify(self.data.matches.contains(params.match_id),
                  message="Match does not exists.")
        sp.verify(self.data.matches[params.match_id].active ==
                  True, message="Match is Not Active.")
        sp.verify(self.data.matches[params.match_id].compete ==
                  False, message="Compete not Ended.")
        sp.for item in self.data.selected_tokens.items():
            sp.for token_id in item.value.tokens.elements():
                card = self.data.tokens[token_id]
                player_id = card.player_id
                sp.if self.data.playerPoints.contains(player_id):
                    points = self.data.playerPoints[player_id].points
                card.inMatch = False
                card.card_score += (points * (card.card_score / 100))
            del self.data.selected_tokens[item.key]
        self.data.matches[params.match_id].active = False
        self.data.matches[params.match_id].finished = True

    @sp.entry_point
    def selectTeam(self, params):
        sp.verify(self.data.matches[params.match_id].compete == True,
                  message="Compete not Yet Started.")
        sp.verify(self.data.matches[params.match_id].active == True,
                  message="Match either does not exists or is inacitve.")
        sp.verify(sp.len(params.tokens) == 5,
                  message="Only Five Tokens are Allowed.")
        sp.verify(~self.data.selected_tokens.contains(sp.sender),
                  message="You have already staked Cards for the match.")
        self.data.selected_tokens[sp.sender] = sp.record(tokens=sp.set())
        sp.for token_id in params.tokens:
            token_id = sp.set_type_expr(token_id, sp.TNat)
            sp.verify(self.data.ledger[sp.sender].tokens.contains(
                token_id), message="You can only select owned tokens.")
            sp.verify(~self.data.tokens_on_sale.contains(
                token_id), message="Cannot Play with a token on Sale. Unlist the token to continue.")
            self.data.tokens[token_id].inMatch = True
            self.data.selected_tokens[sp.sender].tokens.add(token_id)


# Tests
##
# Auxiliary Consumer Contract
##
# This contract is used by the tests to be on the receiver side of
# callback-based entry-points.
# It stores facts about the results in order to use `scenario.verify(...)`
# (cf.
# [documentation](https://www.smartpy.io/dev/reference.html#_in_a_test_scenario_)).
class View_consumer(sp.Contract):
    def __init__(self, contract):
        self.contract = contract
        self.init(last_sum=0,
                  last_acc="",
                  operator_support=not contract.config.support_operator)

    @sp.entry_point
    def receive_balances(self, params):
        sp.set_type(params, Balance_of.response_type())
        self.data.last_sum = 0
        sp.for resp in params:
            self.data.last_sum += resp.balance

    @sp.entry_point
    def receive_metadata_registry(self, params):
        sp.verify(sp.sender == params)

    @sp.entry_point
    def receive_metadata(self, params):
        self.data.last_acc = ""
        sp.for resp in params:
            self.contract.token_meta_data.set_type_and_layout(resp)
            self.data.last_acc += resp.symbol

    @sp.entry_point
    def receive_permissions_descriptor(self, params):
        self.contract.permissions_descriptor_.set_type_and_layout(params)
        sp.if params.operator.is_variant("owner_or_operator_transfer"):
            self.data.operator_support = True
        sp.else:
            self.data.operator_support = False


def add_test(config, is_default=True):
    @sp.add_test(name=config.name, is_default=is_default)
    def test():
        scenario = sp.test_scenario()
        scenario.h1("CricTez - FA2-NFT, MarketPlace & FantasyLeague")
        scenario.table_of_contents()
        # sp.test_account generates ED25519 key-pairs deterministically:

        admin = sp.test_account("Administrator")
        alice = sp.test_account("Alice")
        bob = sp.test_account("Robert")
        u1 = sp.test_account("U1")
        u2 = sp.test_account("U2")
        u3 = sp.test_account("U3")
        u4 = sp.test_account("U4")
        u5 = sp.test_account("U5")
        # Let's display the accounts:

        scenario.h2("Accounts")
        scenario.show([admin, alice, bob, u1, u2, u3, u4, u5])
        c1 = FA2(config, admin.address)
        scenario += c1

        scenario.h2("Player Tokens")
        scenario.h4("Add Player")
        scenario.p("The administrator adds Virat Kohli")
        scenario += c1.addPlayer(address=admin.address,
                                 amount=1,
                                 player_id=0,
                                 name='Virat Kohli',
                                 ).run(sender=admin)
        scenario.p("The administrator adds MS Dhoni")
        scenario += c1.addPlayer(address=admin.address,
                                 amount=1,
                                 player_id=1,
                                 name='MS Dhoni',
                                 ).run(sender=admin)
        scenario.p("The administrator adds Rohit Sharma")
        scenario += c1.addPlayer(address=admin.address,
                                 amount=1,
                                 player_id=2,
                                 name='Rohit Sharma',
                                 ).run(sender=admin)
        scenario.p("The administrator adds NEW Player")
        scenario += c1.addPlayer(address=admin.address,
                                 amount=1,
                                 player_id=23335,
                                 name='Shubham Kukreja',
                                 ).run(sender=admin)
        scenario.h4("Mint Tokens")
        scenario.p("The administrator mints Virat Kohli's token to User1.")
        scenario += c1.mint(address=u1.address,
                            amount=1,
                            player_id=0,
                            token_id=0
                            ).run(sender=admin)
        scenario.p("The administrator mints MS Dhoni's token to User1.")
        scenario += c1.mint(address=u1.address,
                            amount=1,
                            player_id=1,
                            token_id=1
                            ).run(sender=admin)
        scenario.p("The administrator mints Virat Kohli's token to User1.")
        scenario += c1.mint(address=u1.address,
                            amount=1,
                            player_id=2,
                            token_id=2
                            ).run(sender=admin)
        scenario.p("The administrator mints Virat Kohli's token to User2.")
        scenario += c1.mint(address=u2.address,
                            amount=1,
                            player_id=0,
                            token_id=3
                            ).run(sender=admin)
        scenario.p("The administrator mints Virat Kohli's token to User2.")
        scenario += c1.mint(address=u2.address,
                            amount=1,
                            player_id=0,
                            token_id=4
                            ).run(sender=admin)

        scenario.h4("Transfer Tokens")
        scenario.p("User1 Transfers Token 1 to User2.")
        scenario += c1.transfer(
            [
                c1.batch_transfer.item(from_=u1.address,
                                       txs=[
                                           sp.record(to_=u2.address,
                                                     token_id=1)
                                       ])
            ]).run(sender=u1)
        scenario.p("User1 Transfers Token 3 (not owned by 1) to User3. Must Fail")
        scenario += c1.transfer(
            [
                c1.batch_transfer.item(from_=u1.address,
                                       txs=[
                                           sp.record(to_=u2.address,
                                                     token_id=3)
                                       ])
            ]).run(sender=u1, valid=False)
        scenario.p("User2 Transfers Token 1 to User3.")
        scenario += c1.transfer(
            [
                c1.batch_transfer.item(from_=u2.address,
                                       txs=[
                                           sp.record(to_=u3.address,
                                                     token_id=1)
                                       ])
            ]).run(sender=u2)
        scenario.p("User1 Transfers Token 0 & 2 to User3.")
        scenario += c1.transfer(
            [
                c1.batch_transfer.item(from_=u1.address,
                                       txs=[
                                           sp.record(to_=u3.address,
                                                     token_id=0),
                                           sp.record(to_=u3.address,
                                                     token_id=2)
                                       ])
            ]).run(sender=u1)

        scenario.h2("MaketPlace")
        scenario.h4("Sell Tokens")
        scenario.p("User 3 Puts Token-0 for sale.")
        scenario += c1.sellToken(token_id=1, price=sp.mutez(1)).run(sender=u3)
        scenario.p("User 2 Puts Token-3 for sale.")
        scenario += c1.sellToken(token_id=3, price=sp.mutez(1)).run(sender=u2)
        scenario.p(
            "User 3 Puts Token-0 for sale, which is already on sale. Must Fail.")
        scenario += c1.sellToken(token_id=0, price=sp.mutez(1)
                                 ).run(sender=u3, valid=False)
        scenario.p(
            "User 2 Puts Token-1 for sale, which is not owned by User2. Must Fail.")
        scenario += c1.sellToken(token_id=1, price=sp.mutez(1)
                                 ).run(sender=u2, valid=False)
        scenario.p(
            "User 2 Puts Token-12 for sale, which does not exist. Must Fail.")
        scenario += c1.sellToken(token_id=12,
                                 price=sp.mutez(1)).run(sender=u2, valid=False)
        scenario.p("User 2 Puts Token-3 for sale for 0xtz. Must Fail.")
        scenario += c1.sellToken(token_id=3, price=sp.mutez(0)
                                 ).run(sender=u2, valid=False)

        scenario.h4("Unlist Tokens")
        scenario.p(
            "User 2 Unlists Token-0 (not owned) from marketplace. Must Fail.")
        scenario += c1.unlistToken(token_id=0).run(sender=u2, valid=False)
        scenario.p("User 3 Unlists Token-0 from marketplace.")
        scenario += c1.unlistToken(token_id=0).run(sender=u3)

        scenario.p(
            "User 3 Puts Token-0 for sale, which is already on sale. Must Fail.")
        scenario.h4("Buy Tokens")
        scenario.p(
            "User 1 Buys Token-0 form User3 wihout pariny proper amount. Must Fail.")
        scenario += c1.buyToken(token_id=0).run(sender=u1,
                                                amount=sp.mutez(0), valid=False)
        scenario.p("User 1 Tries to buy Token-3 an unlisted Token. Must Fail.")
        scenario += c1.buyToken(token_id=4).run(sender=u1,
                                                amount=sp.mutez(1), valid=False)
        scenario.p("User 3 Tries to buy already owned token. Must Fail.")
        scenario += c1.buyToken(token_id=0).run(sender=u3,
                                                amount=sp.mutez(1), valid=False)
        scenario.p("User 1 Buys Token-3 form User2.")
        scenario += c1.buyToken(token_id=3).run(sender=u1, amount=sp.mutez(1))
        scenario += c1.transfer(
            [
                c1.batch_transfer.item(from_=u2.address,
                                       txs=[
                                           sp.record(to_=u3.address,
                                                     token_id=4)
                                       ])
            ]).run(sender=u2)
        scenario += c1.transfer(
            [
                c1.batch_transfer.item(from_=u1.address,
                                       txs=[
                                           sp.record(to_=u3.address,
                                                     token_id=3)
                                       ])
            ]).run(sender=u1)
        # Mint Five Tokens to U1 & U2 for Testing Select Teams
        scenario += c1.mint(address=u1.address,
                            amount=1,
                            player_id=0,
                            token_id=5
                            ).run(sender=admin)
        scenario += c1.mint(address=u1.address,
                            amount=1,
                            player_id=0,
                            token_id=6
                            ).run(sender=admin)
        scenario += c1.mint(address=u1.address,
                            amount=1,
                            player_id=1,
                            token_id=7
                            ).run(sender=admin)
        scenario += c1.mint(address=u1.address,
                            amount=1,
                            player_id=2,
                            token_id=8
                            ).run(sender=admin)
        scenario += c1.mint(address=u1.address,
                            amount=1,
                            player_id=0,
                            token_id=9
                            ).run(sender=admin)
        scenario += c1.mint(address=u2.address,
                            amount=1,
                            player_id=0,
                            token_id=10
                            ).run(sender=admin)
        scenario += c1.mint(address=u2.address,
                            amount=1,
                            player_id=0,
                            token_id=11
                            ).run(sender=admin)
        scenario += c1.mint(address=u2.address,
                            amount=1,
                            player_id=2,
                            token_id=12
                            ).run(sender=admin)
        scenario += c1.mint(address=u2.address,
                            amount=1,
                            player_id=0,
                            token_id=13
                            ).run(sender=admin)
        scenario += c1.mint(address=u2.address,
                            amount=1,
                            player_id=0,
                            token_id=14
                            ).run(sender=admin)
        scenario += c1.mint(address=u2.address,
                            amount=1,
                            player_id=1,
                            token_id=15
                            ).run(sender=admin)
        scenario += c1.mint(address=u2.address,
                            amount=1,
                            player_id=0,
                            token_id=16
                            ).run(sender=admin)
        scenario += c1.mint(address=u2.address,
                            amount=1,
                            player_id=2,
                            token_id=17
                            ).run(sender=admin)
        scenario += c1.mint(address=u2.address,
                            amount=1,
                            player_id=0,
                            token_id=18
                            ).run(sender=admin)
        scenario += c1.mint(address=u2.address,
                            amount=1,
                            player_id=1,
                            token_id=19
                            ).run(sender=admin)
        scenario += c1.mint(address=u2.address,
                            amount=1,
                            player_id=23335,
                            token_id=20
                            ).run(sender=admin)

        scenario += c1.feedData(array=[sp.record(player_id=0, points=369, rank=1), sp.record(
            player_id=1, points=284, rank=2), sp.record(player_id=2, points=260, rank=3)]).run(sender=admin)

        scenario.h2("Fantasy League")
        scenario.h4("Add Match")
        scenario.p("Add Match without Admin Account. Must Fail.")
        scenario += c1.addMatch(teamA="CSK", teamB="RCB",
                                match_id=0, date="3 Spet 2020").run(sender=u1, valid=False)
        scenario.p("Add Match using Admin Account.")
        scenario += c1.addMatch(teamA="CSK", teamB="RCB",
                                match_id=0, date="3 Spet 2020").run(sender=admin)
        scenario.p("Add Match using Admin Account.")
        scenario += c1.addMatch(teamA="MI", teamB="RCB",
                                match_id=1, date="3 Spet 2020").run(sender=admin)
        scenario.p("Add already existing Match. Must Fail.")
        scenario += c1.addMatch(teamA="CSK", teamB="RCB",
                                match_id=0, date="3 Spet 2020").run(sender=admin, valid=False)

        scenario.h4("Activate Match.")

        scenario.p("Activate a Match using Admin Account")
        scenario += c1.activateMatch(match_id=0).run(sender=admin)
        scenario.p("Activate a another match while a match is active. Must Fail.")
        scenario += c1.activateMatch(match_id=1).run(sender=admin, valid=False)
        scenario.p("Activate a another match that does not exist. Must Fail.")
        scenario += c1.activateMatch(match_id=2).run(sender=admin, valid=False)

        scenario.h4("Select Team Tokens.")
        scenario.p("User 1 puts 5 owned tokens in Match.")
        scenario += c1.selectTeam(tokens=[5, 6,
                                          7, 8, 9], match_id=0).run(sender=u1)
        scenario.p("User 2 puts 4 tokens for Match. Must Fail.")
        scenario += c1.selectTeam(tokens=[10, 11, 12, 13],
                                  match_id=0).run(sender=u2, valid=False)
        scenario.p(
            "User 2 puts 5 tokens for a InValid Match ( that does not exixst in the matches Map).Must Fail. ")
        scenario += c1.selectTeam(tokens=[10, 11, 12, 13, 14],
                                  match_id=1).run(sender=u2, valid=False)
        scenario.p("User 2 puts 5 owned tokens for Match")
        scenario += c1.selectTeam(tokens=[10, 11,
                                          12, 13, 14], match_id=0).run(sender=u2)
        scenario.p("User 2 puts another 5 owned tokens for Match. Must Fail.")
        scenario += c1.selectTeam(tokens=[15, 16, 17, 18, 19],
                                  match_id=0).run(sender=u2, valid=False)
        scenario.p(
            "User 2 puts 5 owned tokens (already staked) for Match. Must Fail")
        scenario += c1.selectTeam(tokens=[10, 11, 12, 13, 14],
                                  match_id=0).run(sender=u2, valid=False)
        scenario.p("User 3 puts not owned token for Match. Must Fail.")
        scenario += c1.selectTeam(tokens=[0, 1, 2, 3, 6],
                                  match_id=0).run(sender=u3, valid=False)
        scenario.p("User 3 puts owned token for Match.")
        scenario += c1.selectTeam(tokens=[0, 1,
                                          2, 3, 4], match_id=0).run(sender=u3)

        scenario.h4("End Compete")
        scenario += c1.endCompete(match_id=0).run(sender=admin)

        scenario.h4("End Match / Update Card Scores.**")
        scenario += c1.endMatch(match_id=0).run(sender=admin)

##
# Global Environment Parameters
##
# The build system communicates with the python script through
# environment variables.
# The function `environment_config` creates an `FA2_config` given the
# presence and values of a few environment variables.


def global_parameter(env_var, default):
    try:
        if os.environ[env_var] == "true":
            return True
        if os.environ[env_var] == "false":
            return False
        return default
    except:
        return default


def environment_config():
    return FA2_config(
        debug_mode=global_parameter("debug_mode", False),
        single_asset=global_parameter("single_asset", False),
        non_fungible=global_parameter("non_fungible", True),
        add_mutez_transfer=global_parameter("add_mutez_transfer", False),
        readable=global_parameter("readable", True),
        force_layouts=global_parameter("force_layouts", True),
        support_operator=global_parameter("support_operator", True),
        assume_consecutive_token_ids=global_parameter(
            "assume_consecutive_token_ids", True),
        add_permissions_descriptor=global_parameter(
            "add_permissions_descriptor", False),
        lazy_entry_points=global_parameter("lazy_entry_points", False),
        lazy_entry_points_multiple=global_parameter(
            "lazy_entry_points_multiple", False),
    )


# Standard “main”
##
# This specific main uses the relative new feature of non-default tests
# for the browser version.
if "templates" not in __name__:
    add_test(environment_config())
    if not global_parameter("only_environment_test", False):
        add_test(FA2_config(debug_mode=True), is_default=not sp.in_browser)
        add_test(FA2_config(single_asset=True), is_default=not sp.in_browser)
        # add_test(FA2_config(non_fungible = True, add_mutez_transfer = True),
        #          is_default = not sp.in_browser)
        add_test(FA2_config(readable=False), is_default=not sp.in_browser)
        add_test(FA2_config(force_layouts=False),
                 is_default=not sp.in_browser)
        add_test(FA2_config(debug_mode=True, support_operator=False),
                 is_default=not sp.in_browser)
        add_test(FA2_config(assume_consecutive_token_ids=False),
                 is_default=not sp.in_browser)
        add_test(FA2_config(add_mutez_transfer=True),
                 is_default=not sp.in_browser)
        add_test(FA2_config(lazy_entry_points=True),
                 is_default=not sp.in_browser)
        add_test(FA2_config(lazy_entry_points_multiple=True),
                 is_default=not sp.in_browser)
