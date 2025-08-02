import { ConnectButton } from "@mysten/dapp-kit";
import { Coins } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {

    return (
        <div className="absolute top-0 left-0 w-full z-50 fixed">
            <header className="backdrop-blur-lg">
                <div className="max-w-screen mx-auto px-6 py-4 mx-auto">
                    <div className="flex justify-between items-center mx-10">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-500 rounded-lg flex items-center justify-center">
                                <Coins className="w-6 h-6 text-amber-950" />
                            </div>
                            <Link to="/" className="text-2xl font-bold text-amber-950 hover:pointer">
                                SUI NFT Minter
                            </Link>
                        </div>
                        <div className="self-start">
                            <ConnectButton />
                        </div>
                    </div>
                </div>
            </header>

        </div>
    );
}