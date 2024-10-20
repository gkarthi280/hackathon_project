import React from "react";
import Header from "../../components/Header";
import WalletHero from "../../components/wallet/WalletHero";
import USDCEarning from "../../components/wallet/USDCEarning";
import BottomSheet from "../../components/wallet/BottomSheet";

const Wallet = () => {
  return (
    <div>
      <div className="background">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          gap: 20,
          overflow: "scroll",
        }}
      >
        <Header />
        <WalletHero />
        <USDCEarning />
        <BottomSheet />
      </div>
    </div>
  );
};

export default Wallet;
