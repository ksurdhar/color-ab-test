import chroma from 'chroma-js'

document.onreadystatechange = function () {
  if (document.readyState == 'interactive') {
    const $ = document.getElementById.bind(document)
    const get = (arg) => document.getElementsByClassName(arg)[0]
    window.chroma = chroma
    const body = $('body')
    body.style.fontFamily = 'Merriweather'
    body.style.fontSize = '26px'

    Array.prototype.forEach.call(document.getElementsByTagName('input'), (el) => {
      el.style.fontFamily = 'Merriweather'
    })

    const OGColor = '#FFD662'
    body.style.backgroundColor = OGColor
    const colorInput = $('color-text')
    colorInput.value = OGColor
  
    $('goBtn').addEventListener('click', () => {
      const colorContainer = get('colorContainer')
      while (colorContainer.firstChild) {
        colorContainer.removeChild(colorContainer.firstChild);
      }

      const chromaClr = chroma(colorInput.value)
      const varients = $('varients').value
      const intensity = $('intensity').value

      const valArr = []
      for (var x = varients / 2; x > 0; x -= 1) {
        const val = intensity * (x / (varients / 2))
        valArr.push(val)
        valArr.push(-val)
      }
      valArr.sort()
      valArr.forEach((val) => {
        // if this, saturate
        // if this, darken
        // if this, hue shift
        const newClr = chromaClr.darken(val).saturate(-val)
        // randomly darken, saturate, hue shift
        const newNode = document.createElement("div")
        newNode.style.backgroundColor = newClr.hex()
        colorContainer.appendChild(newNode)
      })
    })
    
    let pairs = null
    const roundResults = []
    let roundVotes = {} // hex color -> vote count
    let colorVals = [
      '#fff9f4', 
      '#fff6f2',
      '#fffaf4',
      '#fff8f4',
      '#2d4975'
    ]

    function setNewRoundVotes() {
      roundVotes = {}
      colorVals.forEach((colorVal) => {
        roundVotes[colorVal] = 0
      })
    }

    function generateColorPairs(arr) {
      const colorSet = []
      const colorsExamined = []

      arr.forEach((colorX) => {
        colorsExamined.push(colorX)

        arr.forEach((colorY) => {
          if (!colorsExamined.includes(colorY)) {
            colorSet.push([colorX, colorY])    
          }
        })
      })

      return colorSet
    }

    function rgbToHex(red, green, blue) {
      var rgb = blue | (green << 8) | (red << 16);
      return '#' + (0x1000000 + rgb).toString(16).slice(1)
    }

    function getHexColorFromEvtTarget(evt) {
      const rgbColor = evt.target.style.backgroundColor
      const rgbColorArr = rgbColor.substring(4, rgbColor.length - 1).replace(/ /g, '').split(',')
      return rgbToHex(rgbColorArr[0], rgbColorArr[1], rgbColorArr[2])
    }

    function refineColors() {
      colorVals.sort((a, b) => {
        return roundVotes[b] - roundVotes[a]
      })
      const cutOff = colorVals % 2 === 0 
        ? (colorVals.length / 2) - 1 
        : ((colorVals.length + 1) / 2)
      colorVals = colorVals.slice(0, cutOff)
    }

    function setNewColors() {
      if (!pairs) {
        pairs = generateColorPairs(colorVals)
      }

      let colorPair
      if (pairs.length) {
        colorPair = pairs.pop()
      } else {
        console.log('generating next round!')
        roundResults.push(roundVotes)
        refineColors()
        if (colorVals.length === 1) {
          console.log('winning color', colorVals[0])
          console.log('all round results', roundResults)
          $('side1').removeEventListener('click', handleClick);
          $('side2').removeEventListener('click', handleClick);
          return
        } else {
          setNewRoundVotes()
          pairs = generateColorPairs(colorVals)
          colorPair = pairs.pop()

          console.log('new color vals', colorVals)
          console.log('new votes', roundVotes)
          console.log('new pairs', pairs)
        }
      }
       
      $('side1').style.backgroundColor = colorPair[0]
      $('side2').style.backgroundColor = colorPair[1]
    }

    function upVoteClickedColor (evt) {
      const hexColor = getHexColorFromEvtTarget(evt)
      roundVotes[hexColor] += 1

      console.log(roundVotes)
    }
    
    function handleClick(evt) {
      upVoteClickedColor(evt)
      setNewColors()
    }

    // $('side1').addEventListener('click', handleClick);
    // $('side2').addEventListener('click', handleClick);

    // setNewRoundVotes()
    // setNewColors()
  }
}