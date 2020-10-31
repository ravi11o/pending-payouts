const axios = require("axios");

const baseURL = "http://localhost:8080";

const accountID = process.argv[2];
const depth = process.argv[3] || 3;

const accountPendingPayoutURL = `/accounts/${accountID}/staking-payouts?depth=${depth}`;

async function main() {
  let response = await axios
    .get(baseURL + accountPendingPayoutURL)
    .then((res) => res.data);

  let pendingAmount;
  let hasError = false;
  if (response.erasPayouts[0].message) {
    pendingAmount = "You have no pending payout!";
    hasError = true;
  } else {
    pendingAmount = response.erasPayouts.reduce((acc, cv) => {
      acc = cv.payouts.reduce((totalPayout, payout) => {
        if (!payout.claimed) {
          totalPayout = totalPayout + Number(payout.nominatorStakingPayout);
        }
        return totalPayout;
      }, 0);
      return acc;
    }, 0);
  }

  console.log(
    hasError ? "" : "Your pending payout is::",
    pendingAmount,
    hasError ? "" : "Planck"
  );
}

try {
  main();
} catch (error) {
  console.error(error);
}
