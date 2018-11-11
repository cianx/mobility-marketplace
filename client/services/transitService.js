import '../shim.js'
import { Api, JsonRpc, RpcError, JsSignatureProvider } from 'eosjs';
const { TextDecoder, TextEncoder } = require('text-encoding');
import ecc from 'eosjs-ecc';

const userPrivateKey = "5Kcra1qW1PzVt4VZfzyPb5n6dDqL4BzEsNRer6JirSWsDzUNTie"; // alice
//const scooterPrivateKey = "5JN9KjDxu47SbwB4wMhaocyJiyHYqycix3FJPZVVRadASZRE8Qy"; // scooter
const signatureProvider = new JsSignatureProvider([userPrivateKey]);
const rpc = new JsonRpc('http://127.0.0.1:7777');
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });


export const getTransitBids = async (from, to) => {
  const response = await fetch(`http://localhost:3000/transitMock?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  return await response.json();
}

export const buyTicket = async (ticket) => {
  console.log('data', {
    from: 'alice',
    to: 'mobilitymkt',
    quantity: `${(ticket.fare / 100).toPrecision(5)} SYS`,
    memo: ''
  }
);


  const result = await api.transact({
    actions: [
      {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: 'alice',
          permission: 'active',
        }],
        data: {
          from: 'alice',
          to: 'mobilitymkt',
          quantity: `${(ticket.fare / 100).toPrecision(5)} SYS`,
          memo: ''
        }
      },
      {
      account: 'mobilitymkt',
      name: 'issue',
      authorization: [{
        actor: 'alice',
        permission: 'active',
      }],
      data: {
        user: 'alice',
        provider: ticket.provider,
        ticket_id: ticket.ticketId,
        amount: `${ticket.fare} SYS`,
      },
    }]
  }, {
    blocksBehind: 10,
    expireSeconds: 30,
  });  
}

export const getUserTokens = async () => {
  return rpc.get_table_rows({
    scope: 'mobilitymkt',
    code: 'mobilitymkt',
    table: 'tokens',
    json: true
  });
}

export const getInfo = () => {	
	return rpc.get_info({});
}