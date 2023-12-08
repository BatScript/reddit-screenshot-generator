const textToImg = require('text-to-image')

window.addEventListener('DOMContentLoaded', () => {
  // const transformScrapedData = (scrapedData) => {
  //   const { REDDIT_SCRAPED_DATA } = scrapedData
  //   console.log(REDDIT_SCRAPED_DATA)
  //   const titleData = REDDIT_SCRAPED_DATA[0]?.data?.children[0]?.data
  //   /* has all the comments. Replies field has all of its children.
  //   Follows the same data structure */
  //   const commentData = REDDIT_SCRAPED_DATA[1]?.data?.children

  //   console.log(titleData, commentData)
  // }

  const generateImage = (text) => {
    // Fetches value
    const selectedResolution = $('#resolution').val()
    const backgroundColor = $('#backgroundColor').val()
    const txtColor = $('#textColor').val()

    let resolution
    switch (selectedResolution) {
      case 'square':
        resolution = { width: 1080, height: 1080 }
        break
      case 'portrait':
        resolution = { width: 1080, height: 1350 }
        break
      case 'landscape':
        resolution = { width: 1080, height: 608 }
        break
      default:
        resolution = { width: 400, height: 200 }
        break
    }
    // Create a canvas element
    const canvas = document.createElement('canvas')
    canvas.width = resolution.width
    canvas.height = resolution.height

    // Get the 2D rendering context
    const ctx = canvas.getContext('2d')

    // Set the background color
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set the text properties
    ctx.fillStyle = txtColor // Text color
    ctx.font = '20px Arial' // Font size and family

    // Calculate text width and height
    const textMetrics = ctx.measureText(text)
    const textWidth = textMetrics.width
    const textHeight = parseInt(ctx.font)

    // Calculate text position for center alignment
    const x = (canvas.width - textWidth) / 2
    const y = (canvas.height - textHeight) / 2 + textHeight

    // Draw the text on the canvas
    ctx.fillText(text, x, y)

    // Convert the canvas to a data URL
    const dataURL = canvas.toDataURL()

    $('#generatedImageContainer').html(
      `<img src="${dataURL}" alt="Generated Image" width="${resolution.width}" height="${resolution.height}">`
    )
  }

  const setDOMInfo = (info) => {
    const isRedditComments = info?.SUCCESS
    if (isRedditComments) {
      $('.non-reddit').hide()
      $('.loader').hide()
      $('.container').show()
      const title = info?.REDDIT_SCRAPED_DATA[0].data.children[0].data.title
      $('.pageTitle').html(title)
    } else {
      $('.loader').hide()
      $('.non-reddit').show()
      $('.container').hide()
    }
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSelectedComments') {
      console.log(request.text)
      generateImage(request.text)
    }
  })

  // ...query for the active tab...
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    (tabs) => {
      // ...and send a request for the DOM info...
      chrome.tabs.sendMessage(
        tabs[0].id,
        { from: 'popup', subject: 'DOMInfo' },
        // ...also specifying a callback to be called
        //    from the receiving end (content script).
        setDOMInfo
      )
    }
  )
})
