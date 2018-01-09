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
          <p>With security being our top priority, we have created a special manufacturing process that is designed to ensure that the private keys printed on the wallets are never seen by anyone but the future owners.</p>
        </TeamMemeber>
        <TeamMemeber
          id='danielb'
          name='Daniel Blank'
          photo='/images/team/daniel.png'
                >
          <p>With security being our top priority, we have created a special manufacturing process that is designed to ensure that the private keys printed on the wallets are never seen by anyone but the future owners.</p>
        </TeamMemeber>
        <TeamMemeber
          id='shimond'
          name='Shimon Doodkin'
          photo='/images/team/shimon.png'
        >
          <p>With security being our top priority, we have created a special manufacturing process that is designed to ensure that the private keys printed on the wallets are never seen by anyone but the future owners.</p>
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
