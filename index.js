let canvas = $('#c')[0]
let ctx = canvas.getContext('2d')
ctx.msImageSmoothingEnabled = false
ctx.mozImageSmoothingEnabled = false
ctx.webkitImageSmoothingEnabled = false
ctx.imageSmoothingEnabled = false

const pxWidth = 30
const pxHeight = 30
const scale = 20
const fontSize = 10
ctx.font = fontSize + 'px Arial'
ctx.fillStyle = '#FFFFFF'

function reduce(val, factor) {
    return val - val % factor
    //return Math.round(val / factor) * factor
}

function reduceColors(context, width, height, factor) {
    let imageData = context.getImageData(0, 0, width, height)
    for(let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i]     = reduce(imageData.data[i], factor)
        imageData.data[i + 1] = reduce(imageData.data[i + 1], factor)
        imageData.data[i + 2] = reduce(imageData.data[i + 2], factor)
    }

    context.putImageData(imageData, 0, 0)
}

let img = new Image()
img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, img.width, img.height,
                       0, 0, pxWidth, pxHeight)
    
    reduceColors(ctx, pxWidth, pxHeight, 75)
    
    ctx.drawImage(canvas, 0, 0, pxWidth, pxHeight,
                          0, 0, pxWidth * scale, pxHeight * scale)

    let colors = {}
    
    for (let y = 0; y < pxHeight; y++) {
        for (let x = 0; x < pxWidth; x++) {
            let p = ctx.getImageData(x * scale, y * scale, 1, 1).data
            if (!(p in colors)) {
                colors[p] = Object.keys(colors).length + 1
            }

            if (!($("#hide_nums")[0].checked)) {
                ctx.fillText(colors[p], x * scale, y * scale + fontSize)
            }
        }
    }
}

$("#in").change(() => {
    let input = $("#in")[0]
    if (input.files && input.files[0]) {
        let reader = new FileReader()
        reader.onload = (e) => {
            img.src = e.target.result
        }
        reader.readAsDataURL(input.files[0])
    }
})

$("#hide_nums").change(() => img.onload())
