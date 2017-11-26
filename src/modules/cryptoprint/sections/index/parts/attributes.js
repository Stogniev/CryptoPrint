import React, { Component } from 'react'

const properties = [
  {
    title: 'Why paper wallets?',
    text: 'When you keep your cryptocurrency in an online exchange or wallet, your private key remains vulnerable to theft. Introducing paper wallets, the safest way to store cryptocurrency. With a paper wallet, your private key exists only on paper and has never been online. No one can hack it, steal or do anything else with it without your explicit cooperation.',
    image: '/images/Back.png'
  },
  {
    title: 'Why Cryptoprint wallets?',
    text: `Our wallets are affordable.
      Designed to look like familiar fiat bills, our wallets are easy to use and understand for anyone, bringing cryptocurrencies to the masses.
      Perfect for cold-storage: Ever wanted to stash your cryptocurrency somewhere safe? Now you can.`,
    image: '/images/drmakete-lab-57353.png'
  },
  {
    title: 'Not Just Bitcoin',
    text: 'We offer wallets for each of the top 10 most popular cryptocurrencies today and will add support for more blockchains in the future',
    image: '/images/Front.png'
  },
  {
    title: 'Standard as a Standard',
    text: 'By using standardized formatting (QA code, base58…) for the keys, our wallet is universally compatible with any wallets or hardware from day one.',
    image: '/images/cristina-gottardi-177261 (1).png'
  }

]

export class AttributesSection extends Component {
  render () {
    return <section className='attributes' id='attributes'>
      <h2>The World's Safest Paper Wallet</h2>
      <ul>
        <li>
          <img src='/images/Back.png' alt='tmp-img' />
          <div>
            <h3>Why Paper Wallets?</h3>
            <p>When you keep your cryptocurrency in an online exchange or wallet, your private key remains vulnerable to theft.</p>
            <p>Introducing paper wallets, the safest way to store cryptocurrency. With a paper wallet, your private key exists only on paper and has never been online.</p>
            <p>No one can hack it, steal or do anything else with it without your explicit cooperation.</p>
          </div>
        </li>
        <li>
          <img src='/images/cristina-gottardi-177261 (1).png' alt='tmp-img' />
          <div>
            <h3>Why Cryptoprint Wallets?</h3>
            <p>- Our wallets are affordable.</p>
            <p>- Designed to look like familiar fiat bills, our wallets are easy to use and understand for anyone, bringing cryptocurrencies to the masses.</p>
            <p>- Perfect for cold-storage: Ever wanted to stash your cryptocurrency somewhere safe? Now you can.</p>
          </div>
        </li>
        <li>
          <img src='/images/drmakete-lab-57353.png' alt='tmp-img' />
          <div>
            <h3>Trust</h3>
            <p>At CryptoPrint, we go to great length to ensure that your private key is never glimpsed by anyone but you.</p>
            <p>1. Our proprietary printing software runs on a Raspberry Pi, which along with our printer, is disconnected from any networks to ensure that your private key never touches the internet.</p>
            <p>2. The manufacturing process is visually obscured: No one in the office or outside of it can catch a glimpse of your private key while it’s being printed.</p>
            <p>3. As an added layer of protection, we stream our office 24/7 so that you can see firsthand how safe our manufacturing process is.</p>
            <p>4. Before we send them to delivery, the wallets are packaged in special blackened envelopes so that no one can glimpse your private key while your wallet is in transit. Also, the envelopes are closed with a unique seal so that you can be sure your wallet hasn’t been tampered with during delivery.</p>
            <p>5. Our wallets have been reviewed and approved by premier community members.</p>
          </div>
        </li>
        <li>
          <img src='/images/Front.png' alt='tmp-img' />
          <div>
            <h3>Not Just Bitcoin</h3>
            <p>We offer wallets for each of the top 10 most popular cryptocurrencies today.</p>
          </div>
        </li>
        <li>
          <img src='/images/cristina-gottardi-177261 (1).png' alt='tmp-img' />
          <div>
            <h3>Compatible</h3>
            <p>By using standardized formatting (QA code, base58…) for the keys, our wallet is universally compatible with any wallets or hardware from day one.</p>
          </div>
        </li>
        <li>
          <img src='/images/cristina-gottardi-177261 (1).png' alt='tmp-img' />
          <div>
            <h3>Branded Wallets Available</h3>
            <p>- For Businesses - ICO branded wallets, new coins etc...</p>
            <p>- For People - Family wallets, gifts for events (weddings, birthdays…).</p>
          </div>
        </li>
        <li>
          <img src='/images/cristina-gottardi-177261 (1).png' alt='tmp-img' />
          <div>
            <h3>Support for Various Wallet Types</h3>
            <p>Multisig. Shares. Segwit.</p>
          </div>
        </li>
        <li>==============</li>
        {properties.map(({title, text, image}) => (
          <li>
            <img src={image} alt={title} />
            <div>
              <h3>{title}</h3>
              {text.split('\n').map(e => <p>{e}</p>)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  }
}

export default AttributesSection
