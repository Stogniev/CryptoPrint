import React, { Component } from 'react'

export class Newsletter extends Component {
	constructor(props) {
		super(props)
		this.state= {
			email: '',
			emailValid: false,
			inputPlaceholder: 'Enter your email to receive updates'
		}
		this.validateEmail = this.validateEmail.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	validateEmail(e) {
		let regxrTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let mailString = e.target.value;
		if (regxrTest.test(mailString)) {
			this.setState({ emailValid: true, email: mailString })
		} else {
			this.setState({ emailValid: false, email: mailString })
		}
	}
	handleSubmit(e) {
		e.preventDefault()
		if (this.state.emailValid == true) {
			//send email 
			this.setState({ inputPlaceholder: 'Thank you!', email: '' })
		} else {
			this.setState({ inputPlaceholder: 'Please enter a valid email address!', email: '' })
			setTimeout(()=>{
				this.setState({ inputPlaceholder: 'Enter your email to receive updates', email: '' })
			}, 5000)
		}
	}
  render () {
	return (
	<section className='newsletter'>
		<h3>Sing up for our newsletter to stay up to date on Cryptoprint!</h3>
		<div className='form-container'>
			<input type='text' onChange={this.validateEmail} value={this.state.email} placeholder={this.state.inputPlaceholder}/>
			<button className='submit-btn' onClick={this.handleSubmit}>Subscribe</button>
		</div>
	</section>
		)
	}
}

export default Newsletter
