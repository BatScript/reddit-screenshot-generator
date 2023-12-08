console.log('DOM load')

chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction'
})

const PAGE_DATA_URL = `https://${window.location.host}${window.location.pathname}.json`

const runDataAnalysis = (data) => {
  // Listen for messages from the popup.
  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (
      window.location.href.includes('https://www.reddit.com/r/') &&
      window.location.href.includes('/comments/')
    ) {
      // * Only for reddit comment pages
      if (msg.from === 'popup' && msg.subject === 'DOMInfo') {
        // * checks the request subject, popup is asking for dom-info here
        var domInfo = {
          SUCCESS: true,
          REDDIT_SCRAPED_DATA: data,
          CURRENT_PAGE_URL: window.location.href
        }
        response(domInfo)
      }
    } else {
      // * In case its not reddit
      var domInfo = {
        SUCCESS: false
      }
    }
  })
}

let selectedComments = []

window.addEventListener('click', (event) => {
  console.log(event.target)
  if (event.target.tagName.toLowerCase() === 'p') {
    chrome.runtime.sendMessage({
      action: 'updateSelectedComments',
      text: event.target.innerHTML
    })
  }
})

// * Fetches the data from page and then calls a function to broadcast message
$.ajax({
  url: PAGE_DATA_URL,
  success: runDataAnalysis
})
