const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, evm } = require("../compile.js");

let sale;
let contas;

beforeEach(async () => {
    contas = await web3.eth.getAccounts();

    sale = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ from: contas[0], gas: "3000000" });
});

describe("Contrato SaleVehicle", () => {
    it("Deploy a contract", () => {
        assert.ok(sale.options.address);
    });

    it("Teste function addVehicl and getVehicles", async () => {
        await sale.methods.addVehicle("Fiat uno", "12A236598", 2000, 1).send({
            from: contas[0],
            gas: "3000000",
        });
        const vehicles = await sale.methods.getVehicles().call({
            from: contas[0]
        });
        assert.strictEqual(1, vehicles.length);
    });
    
    it("Test function buyVehicle", async () => {
        await sale.methods.addVehicle("Fiat uno", "12A236598", 2000, 2).send({
            from: contas[0],
            gas: "3000000",
        });
        await sale.methods.buyVehicle(1).send({
            from: contas[1],
            value: web3.utils.toWei("2", "ether"),
        });
        const vehicles = await sale.methods.getVehicles().call({
            from: contas[0]
        });
        assert.strictEqual(contas[1], vehicles[0].owner);
    });

    it("Test Exceptions buyVehicle", async () => {
        await sale.methods.addVehicle("Fiat uno", "12A236598", 2000, 2).send({
            from: contas[0],
            gas: "3000000",
        });
        //expect revert
        await sale.methods.buyVehicle(1).send({
            from: contas[0],
            value: web3.utils.toWei("2", "ether"),
        }).catch((err) => {
            assert(err);
        });

        await sale.methods.buyVehicle(1).send({
            from: contas[1],
            value: web3.utils.toWei("1", "ether"),
        }).catch((err) => {
            assert(err);
        });

        await sale.methods.buyVehicle(1).send({
            from: contas[0],
            value: web3.utils.toWei("3", "ether"),
        }).catch((err) => {
            assert(err);
        });

        const vehicles = await sale.methods.getVehicles().call({
            from: contas[0]
        });
        assert.strictEqual(contas[0], vehicles[0].owner);
    });

    //test addVehicle sad way
    it("Test Exceptions addVehicle", async () => {

        await sale.methods.addVehicle("Fiat uno", "12A236598", 2000, 1).send({
            from: contas[1],
            gas: "3000000",
        }).catch((err) => {
            assert(err);
        });
        const vehicles = await sale.methods.getVehicles().call({
            from: contas[0]
        });
        assert.strictEqual(0, vehicles.length);
    })

});