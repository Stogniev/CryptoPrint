import React, { Component } from 'react'

export class AttributesSection extends Component {
  render () {
    return <section className='attributes' id='attributes'>
      <h2>The World's Safest Paper Wallet</h2>
      <ul>
        <li>
          <img src='/images/Back.png' alt='tmp-img' />
          <div>
            <h3>Why Paper Wallets?</h3>
            <p>When you keep your cryptocurrency in an online exchange or wallet, your private key remains vulnerable to theft. Introducing paper wallets, the safest way to store cryptocurrency. With a paper wallet, your private key exists only on paper and has never been online. No one can hack it, steal or do anything else with it without your explicit cooperation.</p>
          </div>
        </li>
        <li>
          <img src='/images/cristina-gottardi-177261 (1).png' alt='tmp-img' />
          <div>
            <h3>Visual cryptography</h3>
            <p>Talk about printed cryptography, alingment... Why it's safe.</p>
          </div>
        </li>
        <li>
          <img src='/images/drmakete-lab-57353.png' alt='tmp-img' />
          <div>
            <h3>Fold to See</h3>
            <p>How money is sent/received. Fold to reveal... etc...</p>
          </div>
        </li>
        <li>
          <img src='/images/Front.png' alt='tmp-img' />
          <div>
            <h3>Security</h3>
            <p>Secure printing. 24 hour camera stream... Trustbuilding...</p>
          </div>
        </li>
        <li>
          <img src='/images/cristina-gottardi-177261 (1).png' alt='tmp-img' />
          <div>
            <h3>A Variety of Currencies</h3>
            <p>Not just Bitcoin, but any of the top 20 cryptocurrencies today!</p>
          </div>
        </li>
      </ul>
    </section>
  }
}

export default AttributesSection
