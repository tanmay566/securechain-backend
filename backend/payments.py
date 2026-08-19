import os

from x402.http import FacilitatorConfig, HTTPFacilitatorClient, PaymentOption
from x402.http.types import RouteConfig
from x402.mechanisms.evm.exact import ExactEvmServerScheme
from x402.schemas import Network
from x402.server import x402ResourceServer

# ---------------------------------------------------------------------------
# Config — all pulled from backend/.env (see the guide for the exact keys)
# ---------------------------------------------------------------------------

PAY_TO_ADDRESS = os.getenv("X402_PAY_TO_ADDRESS")
FACILITATOR_URL = os.getenv("X402_FACILITATOR_URL", "https://x402.org/facilitator")
NETWORK: Network = os.getenv("X402_NETWORK", "eip155:84532")  # Base Sepolia testnet
VERIFICATION_PRICE = os.getenv("X402_VERIFICATION_PRICE", "$0.01")

if not PAY_TO_ADDRESS:
    raise RuntimeError(
        "X402_PAY_TO_ADDRESS is not set in backend/.env — this is the wallet "
        "that receives payment for each verification call."
    )

# ---------------------------------------------------------------------------
# Facilitator + resource server
# The facilitator is the third-party service that checks a payment signature
# is valid and actually moves the USDC on-chain. We never touch private keys
# or hold funds ourselves — the facilitator does the settlement, and the
# money lands directly in PAY_TO_ADDRESS.
# ---------------------------------------------------------------------------

facilitator = HTTPFacilitatorClient(FacilitatorConfig(url=FACILITATOR_URL))

x402_server = x402ResourceServer(facilitator)
x402_server.register(NETWORK, ExactEvmServerScheme())

# ---------------------------------------------------------------------------
# Protected routes.
#
# NOTE: the route key syntax is x402's own — NOT FastAPI's {asset_id} curly
# braces. x402 uses ":asset_id" (colon-prefixed) to mean "match exactly one
# path segment here". This has been verified against the installed x402
# package: "GET /assets/:asset_id/status" compiles to the regex
# ^/assets/[^/]+/status$, which matches /assets/AST-2026-001/status and
# nothing else (not /assets, not /assets/register, not deeper paths).
#
# Add more entries to this dict the same way to charge for other routes —
# everything not listed here stays completely free and unaffected.
# ---------------------------------------------------------------------------

x402_routes: dict[str, RouteConfig] = {
    "GET /assets/:asset_id/status": RouteConfig(
        accepts=[
            PaymentOption(
                scheme="exact",
                pay_to=PAY_TO_ADDRESS,
                price=VERIFICATION_PRICE,
                network=NETWORK,
            ),
        ],
        mime_type="application/json",
        description="Blockchain-verified chain-of-custody check for one asset",
    ),
}
