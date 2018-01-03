import React, { Component } from 'react'

const properties = [
  {
    title: 'Fold to See',
    text: 'By employing visual cryptography techniques, your private key is hidden in plain sight and can only be revealed by folding the wallet a certain way. \nThis way, you don\'t have to worry about using it in public.',
    image: '/images/product/features1.jpg'
  },
  {
    title: 'Making the Digital, Tangible',
    text: 'Designed to look like familiar currency bills, our wallets are easy to use and understand for anyone, bringing cryptocurrencies to the masses.',
    image: '/images/product/features2.jpg'
  },
  {
    title: 'Standard as a Standard',
    text: 'By using standardized formatting (QR code, base58…), our wallets are universally compatible with any other wallet or hardware from day one.',
    image: '/images/product/features3.jpg'
  },
  {
    title: 'Not Just Bitcoin',
    text: 'We offer wallets for each of the top 10 most popular cryptocurrencies today, and we\'re just getting started.',
    image: '/images/product/features4.jpg'
  },
  // {
  //   title: 'Something Special',
  //   text: 'Need branded wallets for an ICO? \nA personalized wallet as a gift for a wedding? \nWhatever it is, we can do it. Contact us for options.',
  //   image: '/images/product/render-a.png'
  // }
]

export class FeaturesSection extends Component {
  render () {
    return <section className='features attributes' id='features'>
      <h3 className='title'>Features</h3>
      <ul>
        {properties.map(({title, text, image}, index) => (
          <li key={index} className={index % 2 ? 'darkd' : ''}>
            <div>
              <div className='text-block'>
                <h3>{title}</h3>
                {text.split('\n').map(e => <p>{e}</p>)}
              </div>
            </div>
            <div className="img-wrap">
              <img src={image} alt={title} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  }
}

export default FeaturesSection
