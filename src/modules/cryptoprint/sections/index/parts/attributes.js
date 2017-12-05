import React, { Component } from 'react'

const properties = [
  {
    title: 'Paper Wallets, Evolved',
    text: 'Looking for the best way to store cryptocurrencies, we found that there is nothing out there that we can truly stand behind. \nIntroducing the Cryptoprint paper wallets, the best way to store, carry and use cryptocurrencies today.',
    image: '/images/product/render-a.png'
  },
  {
    title: 'The Safest Way to Store Crypto',
    text: 'Keeping your cryptocurrency in an online exchange or wallet leaves your private key vulnerable to theft. \nWith our wallets, your private key exists only on the physical wallet in your possesion and has never been online. \nNo one can hack, steal or do anything with your funds without your explicit permission.',
    image: '/images/product/render-both.png'
  },
  {
    title: 'Fold to See',
    text: 'By employing visual cryptography techniques, your private key is hidden in plain sight and can only be revealed by folding the wallet a certain way. \nThis way, you don\'t have to worry about using it in public.',
    image: '/images/product/slide.gif'
  },
  {
    title: 'Making the Digital, Tangible',
    text: 'Designed to look like familiar currency bills, our wallets are easy to use and understand for anyone, bringing cryptocurrencies to the masses.',
    image: '/images/product/comparison2.png'
  },
  {
    title: 'Standard as a Standard',
    text: 'By using standardized formatting (QR code, base58…), our wallets are universally compatible with any other wallet or hardware from day one.',
    image: '/images/product/isomorphic-layers.png'
  },
  {
    title: 'Not Just Bitcoin',
    text: 'We offer wallets for each of the top 10 most popular cryptocurrencies today, and we\'re just getting started.',
    image: '/images/product/alts.png'
  },
  {
    title: 'Something Special',
    text: 'Need branded wallets for an ICO? \nA personalized wallet as a gift for a wedding? \nWhatever it is, we can do it. Contact us for options.',
    image: '/images/product/render-a.png'
  }
]

export class AttributesSection extends Component {
  render () {
    return <section className='attributes' id='attributes'>
      <ul>
        {properties.map(({title, text, image}, index) => (
          <li key={index} className={index % 2 ? 'darkd' : ''}>
            <div>
              <h3>{title}</h3>
              {text.split('\n').map(e => <p>{e}</p>)}
            </div>
            <img src={image} alt={title} />
          </li>
        ))}
      </ul>
    </section>
  }
}

export default AttributesSection
