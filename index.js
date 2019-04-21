document.onreadystatechange = function () {
  if (document.readyState == 'interactive') {
    let pairs = null
    const colorVotes = {} // hex: vote count
    const colorVals = [
      '#fff9f4', 
      '#fff6f2',
      '#fffaf4',
      '#fff8f4',
      '#2d4975'
    ]

    // initialize colorVotes
    colorVals.forEach((colorVal) => {
      colorVotes[colorVal] = 0
    })

    var body = document.getElementById('body');
    body.style.fontFamily = 'Merriweather'
    body.style.fontSize = '40px'

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

    function setNewColors() {
      // initialize
      if (!pairs) {
        console.log('generating pairs')
        pairs = generateColorPairs(colorVals)
        console.log('pairs')
      }

      let colorPair
      if (pairs.length) {
        colorPair = pairs.pop()
      } else {
        console.log('need to generate next round!')
        // logic around removing lowest colors, redefining colorVals
        // pairs = generateColorPairs(colorVals)
      }
       
      document.getElementById('side1').style.backgroundColor = colorPair[0]
      document.getElementById('side2').style.backgroundColor = colorPair[1]
    }

    function upVoteClickedColor (evt) {
      const hexColor = getHexColorFromEvtTarget(evt)
      colorVotes[hexColor] += 1

      console.log(colorVotes)
    }
    
    function handleClick(evt) {
      upVoteClickedColor(evt)
      setNewColors()
    }

    document.getElementById('side1').addEventListener('click', handleClick);
    document.getElementById('side2').addEventListener('click', handleClick);

    
    setNewColors()
  }
}