document.onreadystatechange = function () {
  if (document.readyState == 'interactive') {
    var body = document.getElementById('body');
    body.style.fontFamily = 'Merriweather'
    body.style.fontSize = '26px'
    Array.prototype.forEach.call(document.getElementsByTagName('input'), (el) => {
      el.style.fontFamily = 'Merriweather'
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
          document.getElementById('side1').removeEventListener('click', handleClick);
          document.getElementById('side2').removeEventListener('click', handleClick);
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
       
      document.getElementById('side1').style.backgroundColor = colorPair[0]
      document.getElementById('side2').style.backgroundColor = colorPair[1]
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

    // document.getElementById('side1').addEventListener('click', handleClick);
    // document.getElementById('side2').addEventListener('click', handleClick);

    // setNewRoundVotes()
    // setNewColors()
  }
}