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
