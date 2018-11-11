

mobilitymkt.wasm: mobilitymkt.cpp
	eosio-cpp -I include -o mobilitymkt.wasm mobilitymkt.cpp --abigen


deploy: mobilitymkt.wasm
	bash -c 'cleos set contract mobilitymkt /project/mobilitymkt --abi mobilitymkt.abi -p mobilitymkt@active'

clean:
	rm *.wasm *.abi