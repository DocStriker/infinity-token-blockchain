import { expect } from "chai";
import { ethers } from "hardhat";

describe("InfinityToken", function () {
  let InfinityToken;
  let token;
  let owner;
  let addr1;
  let addr2;

  const INITIAL_SUPPLY = ethers.parseEther("1000000"); // 1 milhão

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    InfinityToken = await ethers.getContractFactory("InfinityToken");
    token = await InfinityToken.deploy(INITIAL_SUPPLY);
    await token.waitForDeployment();
  });

  describe("Deploy", function () {
    it("Deve definir o nome corretamente", async function () {
      expect(await token.name()).to.equal("InfinityToken");
    });

    it("Deve definir o símbolo corretamente", async function () {
      expect(await token.symbol()).to.equal("IFT");
    });

    it("Deve usar 18 casas decimais", async function () {
      expect(await token.decimals()).to.equal(18);
    });

    it("Deve atribuir o totalSupply ao owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transferências", function () {
    it("Deve transferir tokens entre contas", async function () {
      await token.transfer(addr1.address, ethers.parseEther("100"));

      const balance = await token.balanceOf(addr1.address);
      expect(balance).to.equal(ethers.parseEther("100"));
    });

    it("Deve emitir evento Transfer", async function () {
      await expect(
        token.transfer(addr1.address, ethers.parseEther("50"))
      )
        .to.emit(token, "Transfer")
        .withArgs(owner.address, addr1.address, ethers.parseEther("50"));
    });

    it("Deve falhar se saldo for insuficiente", async function () {
      await expect(
        token.connect(addr1).transfer(owner.address, 1n)
      ).to.be.revertedWithCustomError(
        token,
        "ERC20InsufficientBalance"
      );
    });
  });

  describe("Allowances (approve / transferFrom)", function () {
    it("Deve permitir aprovação de gasto", async function () {
      await token.approve(addr1.address, ethers.parseEther("200"));

      const allowance = await token.allowance(
        owner.address,
        addr1.address
      );

      expect(allowance).to.equal(ethers.parseEther("200"));
    });

    it("Deve permitir transferFrom após approve", async function () {
      await token.approve(addr1.address, ethers.parseEther("100"));

      await token
        .connect(addr1)
        .transferFrom(
          owner.address,
          addr2.address,
          ethers.parseEther("100")
        );

      const balance = await token.balanceOf(addr2.address);
      expect(balance).to.equal(ethers.parseEther("100"));
    });

    it("Deve falhar se allowance for insuficiente", async function () {
      await expect(
        token
          .connect(addr1)
          .transferFrom(
            owner.address,
            addr2.address,
            ethers.parseEther("1")
          )
      ).to.be.revertedWithCustomError(
        token,
        "ERC20InsufficientAllowance"
      );
    });
  });
});
