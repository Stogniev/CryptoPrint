import React, { Component } from 'react'

export class TeamSection extends Component {
  render () {
    return <section className='team' id='team'>
      <h2>Team</h2>
      <ul>
        <TeamMemeber
          id='elis'
          name='Eli Sklar'
          photo='/images/team/elis.png'
        >
          <p>Avid Bitcoin advocate since 2011</p>
        </TeamMemeber>
        <TeamMemeber
                  id='danielb'
                  name='Daniel Blank'
                  photo='/images/team/daniel.jpg'
                >
                  <p>Former IDF and FinTech coder with a deep passion for great products, cryptocurrency enthusiast since 2013</p>
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
  <div>
    <i className='fa fa-linkedin-square' aria-hidden='true' />
    <i className='fa fa-twitter-square' aria-hidden='true' />
    <i className='fa fa-medium' aria-hidden='true' />
    <i className='fa fa-github' aria-hidden='true' />
    <i className='fa fa-quora' aria-hidden='true' />
  </div>
  {children}
</li>

export default TeamSection
