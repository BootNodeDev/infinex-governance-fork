const { ethers } = hre;
const assert = require('assert/strict');
const assertBn = require('@synthetixio/core-js/utils/assert-bignumber');
const assertRevert = require('@synthetixio/core-js/utils/assert-revert');
const { bootstrap } = require('@synthetixio/deployer/utils/tests');
const initializer = require('../../helpers/initializer');

describe('CoreOwnerModule', () => {
  const { proxyAddress } = bootstrap(initializer);

  let CoreOwnerModule, SampleOwnedModule;
  let owner, user;

  before('identify signers', async () => {
    [owner, user] = await ethers.getSigners();
  });

  before('identify modules', async () => {
    CoreOwnerModule = await ethers.getContractAt('CoreOwnerModule', proxyAddress());
    SampleOwnedModule = await ethers.getContractAt('SampleOwnedModule', proxyAddress());
  });

  it('shows that the owner is set', async () => {
    assert.equal(await CoreOwnerModule.owner(), owner.address);
  });

  describe('when a regular user attempts to interact with the protected function', () => {
    it('reverts', async () => {
      await assertRevert(SampleOwnedModule.connect(user).setProtectedValue(42), 'Unauthorized()');
    });
  });

  describe('when the owner interacts with the protected function', () => {
    before('set value', async () => {
      await (await SampleOwnedModule.connect(owner).setProtectedValue(42)).wait();
    });

    it('sets the value', async () => {
      assertBn.eq(await SampleOwnedModule.getProtectedValue(), 42);
    });
  });
});
