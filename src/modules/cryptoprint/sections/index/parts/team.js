import React, { Component } from 'react'

export class TeamSection extends Component {
  render () {
    return <section className='team' id='team'>
      <h2>Team</h2>
      <ul>
        <li>
          <img src='http://via.placeholder.com/150X150' alt='avatar' />
          <div>
            <h3>Eli</h3>
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
        <li>
          <img src='http://via.placeholder.com/60X60' alt='avatar' />
          <div>
            <h3>Shimon</h3>
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
      </ul>
    </section>
  }
}

export default TeamSection
