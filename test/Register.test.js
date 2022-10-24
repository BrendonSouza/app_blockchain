const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, evm } = require("../compile.js");

let register;
let contas;

beforeEach(async () => {
  contas = await web3.eth.getAccounts();

  register = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: contas[0], gas: "3000000" });
});

describe("Contrato Register", () => {
  it("Deploy a contract", () => {
    // console.log(inbox);
    assert.ok(register.options.address);
  });

  it("Teste geral do contrato", async () => {
    //testa register passando a tupla como parametro ([{nome},{cpf(int)}, {idade(int)}])


    await register.methods.registry(["Joao", 79885526335, 29012000]).send({
      from: contas[0],
      gas: "3000000",
    });

    const people = await register.methods.findByCpf(79885526335).call({
      from: contas[0]
    });

    assert.strictEqual("Joao", people.name);

    await register.methods.registry(["Jean", 79885526337, 29011999]).send({
      from: contas[0],
      gas: "3000000",
    });

    const peoples = await register.methods.getAllPeople().call({
      from: contas[0]
    });
    assert.strictEqual(2, peoples.length);

    const caminhoTriste = await register.methods.findByCpf(79885526222).call({
      from: contas[0]
    });
    assert.strictEqual("Nao encontrado", caminhoTriste.name);
    
  });

  
  


});