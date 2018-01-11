import { mount } from 'vue-test-utils'
import Login from '@/components/auth/Login.vue'
import expect from 'expect'

/* eslint-disable no-undef */
describe('Login', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Login)
  })

  it('does not contain error alert', () => {
    expect(wrapper.html()).not.toContain('Incorrect username or password.')
  })

  it('enables the sign in button', () => {
    wrapper.setData({
      email: 'frodo@baggins.sh',
      password: 'my_precious'
    })

    let button = wrapper.find('button')

    expect(button.attributes().disabled).not.toBe('disabled')
  })

  it('disables the sign in button', () => {
    let button = wrapper.find('button')

    expect(button.attributes().disabled).toBe('disabled')
  })
})
