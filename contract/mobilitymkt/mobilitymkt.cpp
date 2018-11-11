#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <eosiolib/asset.hpp>

using namespace eosio;
using std::string;

class mobilitymkt : public contract {
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
            p.value = amount;
            p.ticket_id = ticket_id;
            p.authorized = false;
        });
    }

    [[eosio::action]]
    void list( name user ) {
        /* inputs:
            ticket_id (id, sig)
            amount/price(eos)

        */
        // require_auth( user );
        print( "List tokens, ", name{user} );
        for(auto& item : _tokens) {
            if (item.owner == user) {
                print(item.id, ", ",
                    name{item.owner}, ", ",
                    item.ticket_id, ", ",
                    item.value, ", ",
                    item.authorized, ", ",
                    "\n");
            }
        }
    }

    [[eosio::action]]
    void authorize(name user, string ticket_id) {
        /* inputs:
            token id
        */
       // require_auth( user );
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
EOSIO_DISPATCH( mobilitymkt, (authorize)(issue)(list))

