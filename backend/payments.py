import os

# ---------------------------------------------------------------------------
# x402 configuration
#
# x402 is OPTIONAL during development.
#
# Set:
#     X402_ENABLED=false
#
# to run the backend without requiring a wallet address or initializing
# the x402 payment server.
#
# Later, for real payments:
#
#     X402_ENABLED=true
#     X402_PAY_TO_ADDRESS=0x...
# ---------------------------------------------------------------------------

X402_ENABLED = os.getenv("X402_ENABLED", "false").strip().lower() in {
    "1",
    "true",
    "yes",
    "on",
}

PAY_TO_ADDRESS = os.getenv("X402_PAY_TO_ADDRESS")
FACILITATOR_URL = os.getenv(
    "X402_FACILITATOR_URL",
    "https://x402.org/facilitator",
)

NETWORK = os.getenv(
    "X402_NETWORK",
    "eip155:84532",
)

VERIFICATION_PRICE = os.getenv(
    "X402_VERIFICATION_PRICE",
    "$0.01",
)


# ---------------------------------------------------------------------------
# Defaults
#
# These are deliberately defined even when x402 is disabled because
# backend/main.py imports these names regardless of whether the middleware
# is enabled.
# ---------------------------------------------------------------------------

x402_routes = {}
x402_server = None


# ---------------------------------------------------------------------------
# Initialize x402 ONLY when explicitly enabled.
# ---------------------------------------------------------------------------

if X402_ENABLED:

    if not PAY_TO_ADDRESS:
        raise RuntimeError(
            "X402_PAY_TO_ADDRESS is not set in backend/.env. "
            "Set it when X402_ENABLED=true."
        )

    from x402.http import (
        FacilitatorConfig,
        HTTPFacilitatorClient,
        PaymentOption,
    )
    from x402.http.types import RouteConfig
    from x402.mechanisms.evm.exact import ExactEvmServerScheme
    from x402.server import x402ResourceServer

    facilitator = HTTPFacilitatorClient(
        FacilitatorConfig(
            url=FACILITATOR_URL
        )
    )

    x402_server = x402ResourceServer(
        facilitator
    )

    x402_server.register(
        NETWORK,
        ExactEvmServerScheme(),
    )

    # -----------------------------------------------------------------------
    # Protected routes
    # -----------------------------------------------------------------------

    x402_routes = {
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
            description=(
                "Blockchain-verified chain-of-custody "
                "check for one asset"
            ),
        ),
    }

    print(
        f"[x402] ENABLED | network={NETWORK} | "
        f"price={VERIFICATION_PRICE}"
    )

else:

    print(
        "[x402] DISABLED | running in development mode "
        "without payment requirements"
    )