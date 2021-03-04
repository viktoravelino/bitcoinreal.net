var isMobile =
  (navigator.userAgent || navigator.vendor).toLowerCase().indexOf("mobile") >
  -1;
if (isMobile) {
  document.querySelector("body").classList.add("mobile");
  // document.querySelector(".btcContainer").classList.add("mobile");
}

function renderTable(exchangeArray) {
  const priceTableElement = document.querySelector(".priceTable");
  for (exchange in exchangeArray) {
    const trElement = document.createElement("tr");
    const tdNameElement = document.createElement("td");
    const tdPriceElement = document.createElement("td");
    tdNameElement.innerText = exchangeArray[exchange].name;
    tdPriceElement.innerText =
      "R$ " + exchangeArray[exchange].price.replace(".", ",");
    trElement.appendChild(tdNameElement);
    trElement.appendChild(tdPriceElement);
    priceTableElement.children[1].appendChild(trElement);
  }
}

function renderPriceQtyTable(conversionFee) {
  const array = [1, 2, 5, 10];
  const priceQtyTable = document.querySelector("#priceQtyTable");
  for (qty in array) {
    const trElement = document.createElement("tr");
    const tdQtyElement = document.createElement("td");
    const tdCostElement = document.createElement("td");
    tdQtyElement.innerText = array[qty] + " Bitcoins";
    tdCostElement.innerText =
      "R$ " + (array[qty] * conversionFee).toFixed(2).replace(".", ",");
    trElement.appendChild(tdQtyElement);
    trElement.appendChild(tdCostElement);
    priceQtyTable.children[1].appendChild(trElement);
  }
}

async function getExchangePrices() {
  var exchangeArray = [];
  // Biscoint
  const responseBiscoint = await fetch(
    "https://api.biscoint.io/v1/ticker?base=BTC&quote=BRL"
  );
  const jsonBiscoint = await responseBiscoint.json();
  exchangeArray.push({
    name: "Biscoint",
    price: parseFloat(jsonBiscoint.data.last).toFixed(2),
  });

  // Braziliex
  const responseBraziliex = await fetch(
    "https://braziliex.com/api/v1/public/ticker/btc_brl"
  );
  const jsonBraziliex = await responseBraziliex.json();
  exchangeArray.push({
    name: "Braziliex",
    price: parseFloat(jsonBraziliex.last).toFixed(2),
  });

  // Bitpreco
  const responseBitpreco = await fetch(
    "https://api.bitpreco.com/btc-brl/ticker"
  );
  const jsonBitpreco = await responseBitpreco.json();
  exchangeArray.push({
    name: "Bitpreço",
    price: parseFloat(jsonBitpreco.last).toFixed(2),
  });

  // PagCripto
  const responsePagcripto = await fetch(
    "https://api.pagcripto.com.br/v2/public/ticker/BTCBRL"
  );
  const jsonPagcripto = await responsePagcripto.json();
  exchangeArray.push({
    name: "Pagcripto",
    price: parseFloat(jsonPagcripto.data.last).toFixed(2),
  });

  // MercadoBitcoin
  const responseMercadoBitcoin = await fetch(
    "https://www.mercadobitcoin.net/api/BTC/ticker/"
  );
  const jsonMercadoBitcoin = await responseMercadoBitcoin.json();
  let price = parseFloat(jsonMercadoBitcoin.ticker.last).toFixed(2);
  exchangeArray.push({
    name: "MercadoBitcoin",
    price,
  });
  return exchangeArray;
}

var conversionFee = 0;
const inputBrlElement = document.getElementById("inputBRL");
const inputBtcElement = document.getElementById("inputBTC");

function onBtcInputHandler() {
  const notEmpty = inputBtcElement.value.replace(",", ".") > 0;
  if (notEmpty) {
    inputBrlElement.value = (
      parseFloat(inputBtcElement.value.replace(",", ".")) * conversionFee
    )
      .toFixed(2)
      .replace(".", ",");
  } else {
    inputBrlElement.value = 0;
  }
}
function onBrlInputHandler() {
  const notEmpty = inputBrlElement.value.replace(",", ".") > 0;
  // console.log(empty);
  if (notEmpty) {
    inputBtcElement.value = (
      parseFloat(inputBrlElement.value.replace(",", ".")) / conversionFee
    )
      .toFixed(8)
      .replace(".", ",");
  } else {
    inputBtcElement.value = 0;
  }
}

async function main() {
  const exchangeArray = await getExchangePrices();
  renderTable(exchangeArray);
  conversionFee = exchangeArray[0].price;

  inputBrlElement.value = conversionFee.replace(".", ",");
  renderPriceQtyTable(conversionFee);
}

main();
