import { mount } from 'vue-test-utils'
import Register from '@components/Auth/Register.vue'
import expect from 'expect'
import Form from '@utils/Form'

/* eslint-disable no-undef */
describe('Register', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Register)
  })

  it('does not contain error alert', () => {
    expect(wrapper.html()).not.toContain('Whoops, looks like something went wrong. Please try again.')
  })

  it('enables the register button', () => {
    wrapper.setData({
      form: new Form({
        name: 'frodo',
        email: 'frodo@baggins.sh',
        password: 'my_precious',
        password_confirmation: 'my_precious'
      })
    })

    let button = wrapper.find('button')

    expect(button.attributes().disabled).not.toBe('disabled')
  })

  it('disables the register button', () => {
    let button = wrapper.find('button')

    expect(button.attributes().disabled).toBe('disabled')
  })
})
