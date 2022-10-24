pragma solidity ^0.8.17;


struct Person {

    string name;

    uint64 cpf; 

    uint32 birthdate;
}

// Contrato de registro/cartório
contract Register {

    Person[] public people;

    address public owner;

    constructor() {
        // Irá atribuir o endereço de quem executou o deploy na variável owner
        owner = msg.sender;       
    }
    // Função para registrar uma pessoa
    function registry(Person memory person) public {
        // Se a pessoa que executar essa função não for o dono do contrato irá gerar erro
        require(msg.sender == owner, "Voce nao possui permissao");
        // Se o CPF for menor ou igual a 9999999999 irá gerar erro
        require(person.cpf > 9999999999, "Cpf muito curto");
        // Poe a nova variável no final do array people
        people.push(person);
    }

    function getAllPeople() public view returns (Person[] memory _people){
        return people;
    }
    // Função para buscar uma pessoa a partir de um CPF
    function findByCpf(uint64 cpf) public view returns (Person memory _people)  {
        // Laço de repetição para mapear o array pessoa
        for (uint i = 0; i < people.length; i++) {
            // Caso o cpf for igual ao cpf da pessoa atual então retorna a pessoa
            if(cpf == people[i].cpf){
                return people[i];
            }
            else{
                // Caso não seja igual retorna uma pessoa com o nome "Nao encontrado"
                return Person("Nao encontrado", 0, 0);
            }
        }
    }

}