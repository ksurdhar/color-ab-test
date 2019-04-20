document.onreadystatechange = function () {
  if (document.readyState == 'interactive') {
    const colorObjs = [] // hex to vote count
    const colors = [
      '#fff9f4', 
      '#fff6f2',
      '#fffaf4',
      '#fff8f4',
      '#2d4975'
    ]
    // initialize colorObjs
    colors.forEach((color) => {
      colorObjs.push({ color: color, votes: 0, showCount: 0 })
    })

    var body = document.getElementById('body');
    body.style.fontFamily = 'Merriweather'
    body.style.fontSize = '40px'

    function findLowestColor(arr) {
      let lowestColorCount = Number.POSITIVE_INFINITY
      let lowestColor
      arr.forEach((colorObj) => {
        if (lowestColorCount > colorObj.showCount) {
          lowestColor = colorObj
          lowestColorCount = colorObj.showCount
        }
      })
      return lowestColor
    }

    function getNextColors() {
      color1 = findLowestColor(colorObjs)
      color2 = findLowestColor(colorObjs.filter((clr) => clr !== color1))

      colorObjs.forEach((clrObj) => {
        if (clrObj === color1 || clrObj === color2) {
          clrObj.showCount += 1
        }
      })
      const newColors = [color1, color2]
      return newColors
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
      const colorSet = getNextColors()
      document.getElementById('side1').style.backgroundColor = colorSet[0].color
      document.getElementById('side2').style.backgroundColor = colorSet[1].color
    }

    function upVoteClickedColor (evt) {
      const hexColor = getHexColorFromEvtTarget(evt)
      const colorObj = colorObjs.find((clrObj) => clrObj.color === hexColor)
      colorObj.votes += 1
      console.log(colorObjs)
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