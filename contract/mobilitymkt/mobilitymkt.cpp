#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <eosiolib/asset.hpp>

using namespace eosio;
using std::string;

const name mobilitymkt_account = "mobilitymkt"_n;

class [[eosio::contract]] mobilitymkt : public contract {
public:
    using contract::contract;

    // How do i issue "eos" to users on nodeos
    mobilitymkt( eosio::name receiver, eosio::name code,
        eosio::datastream<const char*> ds ):
            eosio::contract(receiver, code, ds),
            _balances(receiver, code.value),
            _tokens(receiver, code.value)
    {}


    [[eosio::action]]
    void hello( name user ) {
       require_auth( user );
       print( "hello, ", name{user} );
    }

    [[eosio::action]]
    void issue( name user, name provider, string ticket_id, asset amount ) {
        /* inputs:
            ticket_id (id, sig)
            amount/price(eos)

        */
       // require_auth( user );
       print( "issue, ", name{user} );

       // Verify offer is from valid user

       // Verify user has price in eos

       // Transfer eos to escrow

       // Record token in user list
       // update the table to include a new poll
        _tokens.emplace(get_self(), [&](auto& p) {
            p.id = _tokens.available_primary_key();
            p.owner = user;
            p.provider = provider;
            p.value = amount;
            p.ticket_id = ticket_id;
            p.authorized = false;
        });
    }

    [[eosio::action]]
    void authorize(name user, string ticket_id) {
        /* inputs:
            token id
        */
       require_auth( user );
       print( "authorize, ", name{user} );

       // Use clunky search methodology from
       // https://developers.eos.io/eosio-cpp/docs/using-multi-index-tables
       // Not sure what indexes are for if lookup requires full list transversal

        std::vector<uint64_t> keysForModify;
        // find all poll items
        for(auto& item : _tokens) {
            if (item.ticket_id == ticket_id &&
                item.owner == user) {
                keysForModify.push_back(item.id);
            }
        }

        // update the status in each poll item
        for (uint64_t key : keysForModify) {
            eosio::print("modify _tokens status", key);
            auto itr = _tokens.find(key);
            if (itr != _tokens.end()) {
                _tokens.modify(itr, get_self(), [&](auto& p) {
                    p.authorized = true;
                    // FIXME send funds
                });
            }
        }

       // verify token exists
       // transfer eos from escrow to provider
    }


    void deposit(name from, name to, asset quantity, std::string memo)
    {
        print( "deposit, ", name{from}, name{to}, "\n");

        // In case the tokens are from us, or not to us, do nothing
        if(from == _self || to != _self)
            return;

        // const char* digest = "c0dfb9cd89a0feb765b93de6718e11c00dbe335d700f268a4084a220f294b71f";
        // string sig("SIG_K1_K9vJsvFxMf1YAHQcKqmV68a3ttJoukBorWxjwuhtuohbrnqgLw28NAV2R5Xp1WdqnrbfEgRC8Ak8dwq9WZH25N9Kh1pWzw");
        // string pub("EOS78yJxETkWfZF5Mjj4HQ5N5t6KnoCjnh767J1ufit7bVbL9EBSX");
        // recover_key( (capi_checksum256*)digest, sig.c_str(), sig.size(), pub.c_str(), pub.size());

        // print("Sig verify!!!!\n");

        // This should never happen as we ensured transfer action belongs to "infinicoinio" account
        // eosio_assert(quantity.symbol == inf_symbol, "The symbol does not match");
        eosio_assert(quantity.is_valid(), "The quantity is not valid");
        eosio_assert(quantity.amount > 0, "The amount must be positive");

        // deposit_table deposits(_self, _self.value);
        // auto deposits_itr = deposits.find(from.value);
        // eosio_assert(deposits_itr != deposits.end(), "User does not have a deposit opened");

        // deposits.modify(deposits_itr, same_payer, [&](auto &row){
        //     row.balance += quantity;
        // });
    }

    struct [[eosio::table]] balance {
        name owner;
        asset amount;

        uint64_t primary_key() const { return owner.value; }
    };
    typedef eosio::multi_index<"balance"_n, balance> balance_index;


    typedef uint64_t id_type;
    struct [[eosio::table]] token {
        id_type id;
        name owner;
        name provider;
        std::string ticket_id;
        asset value;
        bool authorized;

        id_type primary_key() const { return id; }
        uint64_t get_owner() const { return owner.value; }
    };

    using token_index = eosio::multi_index<"tokens"_n, token,
                    indexed_by< "byowner"_n,
                        const_mem_fun< token,
                            uint64_t, &token::get_owner> > >;

    balance_index _balances;
    token_index _tokens;

};
//EOSIO_DISPATCH( mobilitymkt, (authorize)(issue))
//*
extern "C" {
    void apply(uint64_t receiver, uint64_t code, uint64_t action) {
        print( "apply, code:", code, " receiver", receiver, " mobilitymkt:", mobilitymkt_account.value, " eosio.token", "eosio.token"_n.value);
        if(code==receiver)
        {
            switch(action)
            {
                EOSIO_DISPATCH_HELPER( mobilitymkt, (authorize)(issue) )
            }
        }
        else if(code=="eosio.token"_n.value &&
            receiver== mobilitymkt_account.value &&
            action=="transfer"_n.value) {
            execute_action( name(receiver), name(code), &mobilitymkt::deposit );
        }
    }
};
/**/

