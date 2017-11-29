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
        <li>
          <img src='http://via.placeholder.com/60X60' alt='avatar' />
          <div>
            <h3>Daniel</h3>
          </div>
          <div>
            <i className='fa fa-linkedin-square' aria-hidden='true' />
            <i className='fa fa-twitter-square' aria-hidden='true' />
            <i className='fa fa-medium' aria-hidden='true' />
            <i className='fa fa-github' aria-hidden='true' />
            <i className='fa fa-quora' aria-hidden='true' />
          </div>
          <p>Quisque ultricies tristique enim, quis pharetra dui tempor elementum. Praesent ultricies odio dui, ut elementum tellus placerat sit amet. Donec pulvinar pulvinar est vitae feugiat.</p>
        </li>
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
