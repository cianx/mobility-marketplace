#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <eosiolib/asset.hpp>

using namespace eosio;
using std::string;

class mobilitymkt : public contract {
public:
    using contract::contract;

    // How do i issue "eos" to users on nodeos

    [[eosio::action]]
    void hello( name user ) {
       require_auth( user );
       print( "hello, ", name{user} );
    }

    [[eosio::action]]
    void issue( name user, string ticket_id, asset amount ) {
        /* inputs:
            ticket_id (id, sig)
            amount/price(eos)

        */
       require_auth( user );
       print( "issue, ", name{user} );

       // Verify offer is from valid user

       // Verify user has price in eos

       // Transfer eos to escrow

       // Record token in user list

    }
    [[eosio::action]]
    void authorize( name user, string ticket_id) {
        /* inputs:
            token id
        */
       require_auth( user );
       print( "authorize, ", name{user} );

       // verify token exists
       // transfer eos from escrow to provider
    }

    struct [[eosio::table]] balance {
        name owner;
        asset amount;

        uint64_t primary_key() const { return owner.value; }
    };

    typedef uint64_t id_type;
    struct [[eosio::table]] token {
        id_type id;
        name owner;
        std::string token_id;
        asset value;

        id_type primary_key() const { return id; }
        uint64_t get_owner() const { return owner.value; }

    };

private:
    // using balance_index = eosio::multi_index<"balances"_n, balance>;

    // using token_index = eosio::multi_index<"tokens"_n, token,
    //                 indexed_by< "byowner"_n,
    //                     const_mem_fun< token,
    //                         uint64_t, &token::get_owner> > >;

    // balance_index balances;
    // token_index tokens;

};
EOSIO_DISPATCH( mobilitymkt, (authorize)(issue))

