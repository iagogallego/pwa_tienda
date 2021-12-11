const tienda = artifacts.require("tienda");

module.exports = function (deployer) {
  deployer.deploy(tienda);
};
