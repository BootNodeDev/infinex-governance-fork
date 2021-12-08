const { subtask } = require('hardhat/config');
const { SUBTASK_PICK_CONTRACT } = require('../task-names');
const prompts = require('prompts');
const chalk = require('chalk');

subtask(SUBTASK_PICK_CONTRACT, 'Pick contract to interact with').setAction(
  async (taskArguments, hre) => {
    const contracts = Object.entries(hre.deployer.deployment.general.contracts);

    const choices = contracts.map(([contractName, contract]) => {
      const contractAddress = contract.proxyAddress || contract.deployedAddress;

      return { title: `${contractName} ${chalk.gray(contractAddress)}`, value: contractName };
    });

    const { contractName } = await prompts([
      {
        type: 'autocomplete',
        name: 'contractName',
        message: 'Pick a CONTRACT:',
        choices,
      },
    ]);

    if (contractName) {
      hre.cli.contractName = contractName;
    } else {
      // Cancelling exits CLI
      process.exit(0);
    }
  }
);