import React, { Component } from 'react'

const properties = [
    {
    title: 'Paper Wallets, Evolved',
    text: 'While looking for the best way to store cryptocurrencies we found that there is nothing out there that we can truly stand behind. Introducing the Cryptoprint paper wallets, the best way to store, carry and use cryptocurrencies today.',
    image: '/images/Back.png'
  },
  {
    title: 'Ultimate Security',
    text: 'Keeping your cryptocurrency in an online exchange or wallet leaves your private key online, and thus vulnerable to theft. With our wallets, your private key exists only on the physical wallet in your possesion and has never been online. No one can hack, steal or do anything with your funds without your explicit permission. We also take extreme measures to ensure no one has access to your private key before you receive the wallet, ensuring you are the only person to see it.',
    image: '/images/Back.png'
  },
   {
    title: 'Fold to See',
    text: 'By employing visual cryptography techniques, your private key is hidden in plain sight and can only be revealed by folding the wallet a certain way. This way, you don\'t have to worry about using it in public.',
    image: '/images/drmakete-lab-57353.png'
  },
  {
    title: 'Making the Digital, Tangible',
    text: 'Designed to look like familiar currency bills, our wallets are easy to use and understand for anyone, bringing cryptocurrencies to the masses.',
    image: '/images/drmakete-lab-57353.png'
  },
  {
    title: 'Standard as a Standard',
    text: 'By using standardized formatting (QR code, base58…), our wallets are universally compatible with any other wallets or hardware from day one.',
    image: '/images/cristina-gottardi-177261 (1).png'
  },
  {
    title: 'Not Just Bitcoin',
    text: 'We offer wallets for each of the top 10 most popular cryptocurrencies today, and we\'re just getting started.',
    image: '/images/Front.png'
  },
  {
    title: 'Something Special',
    text: 'Need branded wallets for an ICO? A personalized wallet as a gift for a wedding? Whatever it is, we can do it. Contact us for options.',
    image: '/images/cristina-gottardi-177261 (1).png'
  },
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
