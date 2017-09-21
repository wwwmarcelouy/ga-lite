import Tracker from '../../src/tracker'
import MockStorage from './mock-storage'
import { expect } from 'chai'
import { assertUrlsEqual } from './utils'

describe('Tracker', () => {
  const localStorage = new MockStorage()
  localStorage.setItem('uid', '12345')

  beforeEach(() => {
    global.window = { screen: {}, localStorage }
    global.navigator = {}
    global.document = { location: {} }
  })

  afterEach(() => {
    delete global.window
    delete global.navigator
    delete global.document
  })

  it('should export a class', () => {
    expect(typeof Tracker).to.eql('function')
    expect(() => Tracker()).to.throw(TypeError, `Class constructor Tracker cannot be invoked without 'new'`)
  })

  it('should send correct URL on "send" method', (done) => {
    const trackingId = 'UA-XXXXXX'
    const tracker = new Tracker(trackingId)
    const timestamp = Date.now()
    tracker._getTime = () => timestamp
    tracker._sendTo = (url) => {
      assertUrlsEqual(
        url,
        (
          'https://www.google-analytics.com/collect' +
          '?v=1&ul=en-us&de=UTF-8' +
          '&t=pageview' +
          '&cid=12345' +
          '&tid=UA-XXXXXX' +
          '&z=' + timestamp
        )
      )
      done()
    }
    tracker.send('pageview')
  })

  it('should get fields', () => {
    const trackingId = 'UA-XXXXXX'
    const tracker = new Tracker(trackingId)

    expect(tracker.get('trackingId')).to.eql(trackingId)
  })

  it('should set fields', () => {
    const trackingId = 'UA-XXXXXX'
    const tracker = new Tracker(trackingId)
    const randomValue = Math.random().toFixed(3)

    tracker.set('randomValue', randomValue)
    expect(tracker.get('randomValue')).to.eql(randomValue)
  })
})
