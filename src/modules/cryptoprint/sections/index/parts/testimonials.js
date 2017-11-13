import React, { Component } from 'react'

export class TestimonialsSection extends Component {
  render () {
    return <section className='testimonials'>
      <h2>Testimonials</h2>
      <ul>
        <li>
          <div>
            <img src='http://via.placeholder.com/60X60' alt='avatar' />
            <h3>Nulla ac ipsum</h3>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ex lacus, varius eget ornare vitae, tristique id lorem. Aenean consequat, eros quis venenatis posuere.</p>
          <p>September 11, 2017</p>
        </li>
        <li>
          <div>
            <img src='http://via.placeholder.com/60X60' alt='avatar' />
            <h3>Nulla ac ipsum</h3>
          </div>
          <p>Quisque ut dui quis nisi scelerisque fringilla elementum vel sem. In in tortor vel ipsum eleifend ultricies id quis sapien.</p>
          <p>September 11, 2017</p>
        </li>
        <li>
          <div>
            <img src='http://via.placeholder.com/60X60' alt='avatar' />
            <h3>Nulla ac ipsum</h3>
          </div>
          <p>Nam dapibus massa condimentum enim accumsan, ac convallis est gravida. Aliquam quis commodo erat. In fermentum finibus nisi at semper.</p>
          <p>September 9, 2017</p>
        </li>
        <li>
          <div>
            <img src='http://via.placeholder.com/60X60' alt='avatar' />
            <h3>Nulla ac ipsum</h3>
          </div>
          <p>Pellentesque suscipit vel nisl ac pretium. Cras eget felis vel orci</p>
          <p>September 11, 2017</p>
        </li>
      </ul>
    </section>
  }
}

export default TestimonialsSection
