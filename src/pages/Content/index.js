import { printLine } from './modules/print';
import { ethers } from 'ethers';
console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");
const makeid = () => {
  return Math.floor(Math.random() * 100000000);
};
const handleSend = async () => {
  const signer =
    '0c789775573e69bc68ab1e6db8db47a5ab6a174463cf4dbc3aa4d418efb5e441';

  const joinTeamTransaction = {
    to: '0xEb53aED2ad03a20489926dCcA07f5a0CDa553522',
    data: '0xd09de08a',
  };

  const provider = new ethers.JsonRpcProvider(
    'https://rpc.ankr.com/eth_sepolia'
  );
  const wallet = new ethers.Wallet(signer, provider);
  console.log('Wallet:', wallet);

  try {
    const transactionResponse = await wallet.sendTransaction(
      joinTeamTransaction
    );
    console.log('Transaction sent, waiting for confirmation...');

    const receipt = await transactionResponse.wait();
    console.log('Transaction receipt:', receipt);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
};
async function replaceTggTags() {
  const spans = document.querySelectorAll('span');
  spans.forEach((span) => {
    const tggRegex = /(&lt;|<)tgg\s*(.*?)\s*tgg(&gt;|>)/g;
    let match;
    while ((match = tggRegex.exec(span.innerHTML)) !== null) {
      const tggText = match[2].trim();

      const randomId = makeid();

      const replacementHtml = `
                <div id="tgg-section-${randomId}">
                    <h2>${tggText}</h2>
                    <button id="tgg-button-${randomId}">Send Transaction</button> 
                </div>
            `;

      span.innerHTML = span.innerHTML.replace(match[0], replacementHtml);

      setTimeout(() => {
        document
          .getElementById(`tgg-button-${randomId}`)
          .addEventListener('click', () => {
            alert('Button clicked! Running your script...');
            handleSend();
          });
      }, 100);
    }
  });
}
setInterval(replaceTggTags, 1000);
