import React, { Component } from 'react'

export class TeamSection extends Component {
  render () {
    return <section className='team' id='team'>
      <h2>Team</h2>
      <p>Cryptoprint is the brainchild of a passionate crypto- designers, developers and advocates.</p>
      <p>Our vision is to make cryptocurrencies accessible, easy, and as secure as possible by combining the technical advances of the cryptographic currencies with the convenience of a 400+ year old technology: Paper notes.</p>
      <ul>
        <TeamMemeber
          id='elis'
          name='Eli Sklar'
          photo='/images/team/elis.jpg'
        >
          <p>Avid Bitcoin advocate since 2011</p>
        </TeamMemeber>
        <TeamMemeber
                  id='danielb'
                  name='Daniel Blank'
                  photo='/images/team/daniel.jpg'
                >
                  <p>Passionate for great products, into cryptocurrencies since 2013</p>
                </TeamMemeber>
        <TeamMemeber
          id='shimond'
          name='Shimon Doodkin'
          photo='/images/team/shimon.jpg'
        >
          <p>Multidisciplinary software developer and problem solver</p>
        </TeamMemeber>
      </ul>
    </section>
  }
}

const TeamMemeber = ({id, name, photo, children, ...props}) => <li className={`team-member tid-${id}`}>
  <div className='avatar'><img src={photo} alt={`Photo of ${name}`} /></div>
  <div>
    <h3>{name}</h3>
  </div>
  {children}
</li>

export default TeamSection
