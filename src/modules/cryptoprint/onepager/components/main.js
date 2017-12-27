import React from 'react'
import {connect} from 'react-redux'

import FacebookMonoIcon from '../../bits/custom-icons/facebook-mono'
import TwitterIcon from '../../bits/custom-icons/twitter'
import TelegramMonoIcon from '../../bits/custom-icons/telegram-mono'
import SlackIcon from '../../bits/custom-icons/slack'

import {firebaseConnect} from "react-redux-firebase"

const Main = props => {

  const {loading} = props
  // console.log(loading)
  return (
    <main className="op-main">
      <div className="banner header-banner">
        <div className="flex-vertical text-aligned">
          <h3>Foreword</h3>
          <p>Cryptoprint is an Israeli company that creates secure and easy to use paper wallets for top
            cryptocurrencies. </p>
          <p>Being true believers in Bitcoin and cryptocurrencies in general, our mission is to promote mainstream use
            of the technology as a value storage and payment system, in a safe and secure manner.</p>
        </div>
      </div>
      <div className="container">
        <ul className="scope flex-container">
          <li>
            <h3>Secure &amp; Tangible</h3>
            <p>Through visual cryptography, the private key is hidden on the wallet in plain sight and can only be
              revealed by folding the wallet a certain way, making it safe to carry in public.</p>
            <p>Cryptoprint wallets are designed to resemble traditional currency bills to make crypto appear more
              tangible, familiar and approachable to new users.</p>
          </li>
          <li>
            <h3>Inexpensive &amp; Compatible</h3>
            <p>Cryptoprint wallets are universally compatible with any other wallet or hardware on the market.</p>
            <p>Priced at $5 per wallet, they are 20 times cheaper than popular hardware wallets.</p>
          </li>
          <li>
            <h3>Easy &amp; Convenient</h3>
            <p>Being paper wallets, they can be easily kept in your pocket or stashed in a safe place for long-term
              storage.</p>
            <p>Beautifully designed, Cryptoprint wallets are perfect for giving cryptocurrency as a gift for birthdays,
              weddings, and other events.</p>
            <p>Custom designs or branded wallets are also available.</p>
          </li>
        </ul>
        <div className="why-block">
          <div className='img-wrap'>
            <img src="./images/onepager/why.png" alt="why cryptoprint"/>
          </div>
          <div className=" text text-left">
            <h3>Why we are doing this?</h3>
            <p>Established by cryptocurrency enthusiasts and prominent crypto-community members, our product was born
              out of our own need for a safe, secure and comfortable way to store and use Bitcoin and other
              cryptocurrencies.</p>
            <p>While online wallets and exchanges offer some degree of protection, the safest way of holding
              cryptocurrency is by retaining complete control over your private keys, and we believe that paper wallets
              are the best way to do so.</p>
          </div>
        </div>
        <div className="wallets flex-container">
          <div className='img-wrap'>
            <img src="./images/onepager/wallets.png" alt="wallets cryptoprint"/>
          </div>
          <div className="text text-right">
            <h3>Our Wallets</h3>
            <p>To promote widespread use of cryptocurrency, we have made our wallets as practical as possible without
              compromising security.</p>
            <p>Each paper wallet contains both the public and private keys, with the private key hidden through visual
              cryptography and only revealed when the bill is folded in a certain way, thereby allowing wallet owners to
              keep the bills safely and securely. As is critical for such a product, we take security very seriously,
              both in the overall design of the wallet and the manufacturing process itself.</p>
            <p>At Cryptoprint, our wallets are designed to resemble existing currency bills, albeit with a futuristic
              twist.</p>
            <p className="text-bold"><b>This was done for two reasons:</b></p>
            <ol>
              <li>By making the wallets resemble traditional bills, we aim to make cryptocurrencies appear more
                tangible, familiar and approachable to new users.
              </li>
              <li>We believe that designing the wallets to look like the “money of the future” really drives home the
                idea of cryptocurrencies becoming the premier payment medium of the world, the “new money”.
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div className="banner center-banner">
        <div className="flex-vertical text-aligned">
          <img src="./images/onepager/logo-large@svg.svg" alt="logo"/>
          <p className="text-large">So far, everyone who has seen our prototypes has been more than enthusiastic to get
            their hands on one. If you are interested in pre-ordering our wallets or just following our progress, visit
            us here.</p>
        </div>
      </div>
      <div className="container">
        <div className="wallets options flex-container">
          <div className="text text-left">
            <h3>Customize your own paper wallet</h3>
            <p>Established by cryptocurrency enthusiasts and prominent crypto-community members, our product was born
              out of our own need for a safe, secure and comfortable way to store and use Bitcoin and other
              cryptocurrencies.</p>
            <p>While online wallets and exchanges offer some degree of protection, the safest way of holding
              cryptocurrency is by retaining complete control over your private keys, and we believe that paper wallets
              are the best way to do so.</p>
          </div>
          <div className='img-wrap'>
            <img src="./images/onepager/img3.png" alt="wallets options"/>
          </div>
        </div>
        <div className="manufacturing flex-container">
          <div className='img-wrap'>
            <img src="./images/onepager/manufacturing.png" alt="manufacturing"/>
          </div>
          <div className="text text-right">
            <h3>Manufacturing</h3>
            <p>With security being our top priority, we have created a special manufacturing process that is designed to
              ensure that the private keys printed on the wallets are never seen by anyone but the future owners.</p>
            <p>This unique process was designed with the help of premier cyber security experts and cryptographic
              advisors, making sure that your cryptocurrency is as secure as it can be.</p>
          </div>
        </div>
        <div className="team-block">
          <h3>Team</h3>
          <ul className="team-list scope flex-container">
            <li>
              <figure>
                <img src="./images/team/eli.png" alt="Eli Sklar"/>
                <figcaption>
                  <h4>Eli Sklar</h4>
                  <p>With security being our top priority, we have created a special manufacturing process that is
                    designed to ensure that the private keys printed on the wallets are never seen by anyone but the
                    future owners.</p>
                </figcaption>
              </figure>
            </li>
            <li>
              <figure>
                <img src="./images/team/daniel.png" alt="Daniel Blank"/>
                <figcaption>
                  <h4>Daniel Blank</h4>
                  <p>With security being our top priority, we have created a special manufacturing process that is
                    designed to ensure that the private keys printed on the wallets are never seen by anyone but the
                    future owners.</p>
                </figcaption>
              </figure>
            </li>
            <li>
              <figure>
                <img src="./images/team/shimon.png" alt="Shimon Doodkin"/>
                <figcaption>
                  <h4>Shimon Doodkin</h4>
                  <p>With security being our top priority, we have created a special manufacturing process that is
                    designed to ensure that the private keys printed on the wallets are never seen by anyone but the
                    future owners.</p>
                </figcaption>
              </figure>
            </li>
          </ul>
        </div>
        <div className="wallets community flex-container">
          <div className='img-wrap'>
            <img src="./images/onepager/community.png" alt="community"/>
          </div>
          <div className="text text-right">
            <h3>Community</h3>
            <p>Follow us over on any of our community channels, over here, on telegram and on slack.</p>
            <ul className="social-links">
              <li><a href="https://www.facebook.com/"><FacebookMonoIcon/></a></li>
              <li><a href="https://twitter.com/"><TwitterIcon/></a></li>
              <li><a href="https://telegram.org"><TelegramMonoIcon/></a></li>
              <li><a href="www.slack.com/"><SlackIcon/></a></li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
const fbConnectedAppHeader = firebaseConnect([
  'authErrors'
])(Main)


export default connect(
  ({firebase: {auth, authError, profile}}) => ({
    auth,
    authError,
    profile,
    ui: {showMenu: false}
  })
)(fbConnectedAppHeader)