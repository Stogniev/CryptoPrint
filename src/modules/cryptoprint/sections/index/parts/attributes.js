import React, { Component } from 'react'

const properties = [
  {
    title: 'Paper Wallets, Evolved',
    text: 'Looking for the best way to store cryptocurrencies, we found that there is nothing out there that we can truly stand behind. \nIntroducing the Cryptoprint paper wallets, the best way to store, carry and use cryptocurrencies today.',
    image: '/images/product/about1.png'
  },
  {
    title: 'The Safest Way to Store Crypto',
    text: 'Keeping your cryptocurrency in an online exchange or wallet leaves your private key vulnerable to theft. \nWith our wallets, your private key exists only on the physical wallet in your possesion and has never been online. \nNo one can hack, steal, or do anything with your funds without your explicit permission.',
    image: '/images/product/about2.png'
  }
]

export class AttributesSection extends Component {
  render () {
    return <section className='attributes' id='attributes'>
      <h3 className='title'>About</h3>
      <ul>
        {properties.map(({title, text, image}, index) => (
          <li key={index} className={index % 2 ? 'darkd' : ''}>
            <div>
              <div className='text-block'>
                <h3>{title}</h3>
                {text.split('\n').map(e => <p>{e}</p>)}
              </div>
            </div>
            <div className='img-wrap'>
              <img src={image} alt={title} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  }
}

export default AttributesSection
