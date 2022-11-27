pragma solidity ^0.8.17;
 
struct Vehicle {
   uint256 id;
   string model;
   string chassi;
   uint256 year;
   //preco em ether
   uint256 price;
   address owner;
   bool toSale;
}
 
contract Sale {
   // cria o array de veiculos cadastrados no contrato
  Vehicle[] public vehicles;
 
   //cria um contador para auxiliar no incremento do identificador do veiculo
   uint256 public vehicleCount;
 
   //dono do contrato
   address public owner;
 
   //construtor que inicializa o dono do contrato
   constructor() {
       owner = msg.sender;
   }
 
   //funcao que adiciona os detalhes dos veiculos no array
   function addVehicle(string memory _model, string memory _chassi, uint256 _year, uint256 _price) public {
       require(msg.sender == owner, "Voce nao eh o dono do contrato");
       vehicleCount++;
       vehicles.push(Vehicle(vehicleCount, _model, _chassi, _year, _price, msg.sender, true));
   }
    //funcao de transferencia de posse
   function buyVehicle(uint256 _id) public payable {
     
      //id-1 porque o array começa em zero e o id em 1.
       Vehicle storage vehicle = vehicles[_id - 1];
 
       if(vehicle.owner == msg.sender){
           revert("Voce ja e dono do veiculo");
       }
       if((msg.value/ 1 ether)  < vehicle.price){
           revert("Saldo insuficiente");
       }
          if((msg.value/ 1 ether) > vehicle.price){
           revert("Valor Excedente");
 
       }
       //retira do valor enviado a taxa de 5% do contrato
       uint256 tax = msg.value * 5 / 100;
       uint256 valueToOwner = msg.value - tax;
       payable(vehicle.owner).transfer(valueToOwner);
       vehicle.owner = msg.sender;
       vehicle.price = msg.value;
   }
 
     //funcao que retorna os veiculos cadastrados no contrato
   function getVehicles() public view returns (Vehicle[] memory) {
       return vehicles;
   }
 
   //funcao que retorna o saldo do contrato
   function getBalance() public view returns (uint256) {
       return address(this).balance/ 1 ether;
   }
}