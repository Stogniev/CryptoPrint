import React, { Component } from 'react'

export class TeamSection extends Component {
  render () {
    return <section className='team' id='team'>
      <h3 className='title'>Team</h3>
      <ul>
        <TeamMemeber
          id='elis'
          name='Eli Sklar'
          photo='/images/team/eli.png'
        >
          <p>Eli Sklar is a Bitcoin ambassador and a veteran member of the Israeli crypto-community, active since 2011. Eli has over ten years of experience developing software products that reached more than 500,000,000 users cumulatively.</p>
        </TeamMemeber>
        <TeamMemeber
          id='danielb'
          name='Daniel Blank'
          photo='/images/team/daniel.png'
                >
          <p>Daniel is an IDF Intelligence unit alum (81) coder and an experienced project and product manager. Active in the crypto-community since 2013.</p>
        </TeamMemeber>
        <TeamMemeber
          id='shimond'
          name='Shimon Doodkin'
          photo='/images/team/shimon.png'
        >
          <p>Shimon is an interdisciplinary coder involved in the crypto space since 2013, contributing to a variety of community projects. He has an array of impressive software projects behind him for a variety of industries, and is adept at solving complex problems quickly and efficiently.</p>
        </TeamMemeber>
        {/* <TeamMemeber
          id='travis'
          name='Travis Purrington'
          photo='/images/team/shimon.png'
        >
          <p>With security being our top priority, we have created a special manufacturing process that is designed to ensure that the private keys printed on the wallets are never seen by anyone but the future owners.</p>
        </TeamMemeber>
        <TeamMemeber
          id='sagi'
          name='Sagi Katz'
          photo='/images/team/shimon.png'
        >
          <p>With security being our top priority, we have created a special manufacturing process that is designed to ensure that the private keys printed on the wallets are never seen by anyone but the future owners.</p>
        </TeamMemeber> */}
      </ul>
    </section>
  }
}

const TeamMemeber = ({id, name, photo, children, ...props}) => <li className={`team-member tid-${id}`}>
  <div className='avatar'><img src={photo} alt={`${name}`} /></div>
    <h3>{name}</h3>
    {children}
</li>

export default TeamSection
