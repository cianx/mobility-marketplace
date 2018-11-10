

mobility-marketplace.wasm:
	eosio-cpp -I include -o mobility.mkt.wasm mobility.mkt.cpp --abigen


deploy: mobility.mkt.wasm
	bash -c 'cleos set contract mobility.mkt /project/mobility.mkt --abi mobility.mkt.abi -p mobility.mkt@active'