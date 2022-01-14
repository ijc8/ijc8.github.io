let capture
let img
let contours

const width = 1920, height = 1080
const cw = 1280, ch = 720

let recording = true
let stick = false
let center, factor, angle
let reference = null
let filter = "h"

function setup() {
    createCanvas(width, height)
    capture = createCapture(VIDEO)
    capture.size(cw, ch)
    capture.hide()
    p5.cv.onComplete = onOpenCVComplete
    frameRate(5)
}

function normdot(u, v) {
    const norm = Math.sqrt(u[0]**2 + u[1]**2 + u[2]**2) * Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2)
    return (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]) / norm
}

function triangleArea(p1, p2, p3) {
    const a = Math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)
    const b = Math.sqrt((p1[0] - p3[0])**2 + (p1[1] - p3[1])**2)
    const c = Math.sqrt((p2[0] - p3[0])**2 + (p2[1] - p3[1])**2)
    // Heron's formula
    const s = (a + b + c) / 2
    return Math.sqrt(s * (s - a) * (s - b) * (s - c))
}

function quadArea(p1, p2, p3, p4) {
    // Assumes quadrilateral is convex.
    return triangleArea(p1, p2, p3) + triangleArea(p1, p4, p3)
}

function findColorSquare(c, offset) {
    offset = [...offset, 0]
    let base = p5.cv.colorToCvScalar(color(...c))

    cv.cvtColor(mat, hsvBuffer, cv.COLOR_RGBA2RGB)
    cv.cvtColor(hsvBuffer, hsvBuffer, cv.COLOR_RGB2HSV)
    base = p5.cv.convertSingleColor(base, cv.COLOR_RGBA2RGB)
    base = p5.cv.convertSingleColor(base, cv.COLOR_RGB2HSV)
    const lowerb = new cv.Mat(hsvBuffer.rows, hsvBuffer.cols, hsvBuffer.type(), cv.Scalar.sub(base, offset))
    const upperb = new cv.Mat(hsvBuffer.rows, hsvBuffer.cols, hsvBuffer.type(), cv.Scalar.add(base, offset))
    // TODO: Handle hue wraparound.
    cv.inRange(hsvBuffer, lowerb, upperb, thresh)
    lowerb.delete()
    upperb.delete()

    finder.findContours(thresh)
    const polylinesSize = finder.polylines.length
    let best = null
    for (let i = 0; i < polylinesSize; i++) {
        // TODO: Use minAreaRect instead?
        const boundingRect = finder.getBoundingRect(i)
        const cArea = cv.contourArea(finder.contours[i])
        const bArea = boundingRect.width * boundingRect.height
        const ratio = boundingRect.width / boundingRect.height
        if (cArea >= 0.5*bArea && ratio < 1.5 && 1/ratio < 1.2) {
            if (best === null || cArea > best[0]) {
                best = [cArea, boundingRect, finder.contours[i]]
            }
        }
    }
    return best ? best[1] : null
}

const config = {
    // HACK: The small blue component here is to compensate for cv.inRange not wrapping around when checking hue bounds.
    r: [[255, 0, 5], [40, 220, 110]],
    g: [[0, 255, 0], [28, 240, 150]],
    b: [[0, 0, 255], [40, 150, 80]],
    w: [[255, 255, 255], [255, 100, 40]],
}

function draw() {
    if (!p5.cv.isReady) return
    background(0)
    // capture.loadPixels()
    // image(img, 0, 0, 1920, 1080)

    stroke("white")
    strokeWeight(2)
    textSize(32)
    textAlign(CENTER, CENTER)

    if (recording) {
        img = capture.get()
        cvCapture.read(mat)
    }

    const r = findColorSquare(...config.r)
    if (filter === "r") p5.cv.drawMat(thresh, 0, 0)
    const g = findColorSquare(...config.g)
    if (filter === "g") p5.cv.drawMat(thresh, 0, 0)
    const b = findColorSquare(...config.b)
    if (filter === "b") p5.cv.drawMat(thresh, 0, 0)
    const w = findColorSquare(...config.w)
    if (filter === "w") p5.cv.drawMat(thresh, 0, 0)
    if (filter === " ") p5.cv.drawMat(mat, 0, 0)
    // finder.draw()
    const squares = [r, g, b, w]
    if (filter !== "h") {
        for (const [i, square] of Object.entries(squares)) {
            if (square !== null) {
                noFill()
                rect(square.x, square.y, square.width, square.height)
                fill("white")
                text(i, square.x + square.width/2, square.y + square.height/2)
            }
        }
    }
    noFill()
    if (squares.every(s => s)) {
        const points = squares.map(b => [b.x + b.width/2, b.y + b.height/2])
        if (filter !== "h") quad(...points.flat())
        const top = [points[3][0] - points[0][0], points[3][1] - points[0][1]]
        const bottom = [points[2][0] - points[1][0], points[2][1] - points[1][1]]
        angle = -(Math.atan2(top[1], top[0]) + Math.atan2(bottom[1], bottom[0]))/2
        const area = quadArea(...points)
        center = [
            points.map(p => p[0]).reduce((a, b) => a + b, 0) / points.length,
            points.map(p => p[1]).reduce((a, b) => a + b, 0) / points.length
        ]
        factor = Math.sqrt((width * height)/area)
        console.log(factor)
    }

    push()
    translate(width/2, height/2)

    if (stick) {
        rotate(angle - reference.angle)
        console.log(reference)
        translate(-(center[0]-reference.center[0])*factor, -(center[1]-reference.center[1])*factor)
        scale(factor/reference.factor)
    }

    line(0, 0, 0, 100)
    line(-20, 20, 0, 0)
    line(20, 20, 0, 0)
    for (let x = -30; x <= 30; x += 10) {
        for (let y = -30; y <= 30; y += 10) {
            point(x, y)
        }
    }
    rect(-50, -50, 100, 100)
    pop()

    noStroke()
    fill("red")
    rect(0, 0, 100, 100)
    fill("blue")
    rect(width - 100, height - 100, 100, 100)
    fill("green")
    rect(0, height - 100, 100, 100)
    fill("white")
    rect(width - 100, 0, 100, 100)
}

function keyPressed(event) {
    console.log(event.key)
    if (event.key === "Enter") {
        recording = !recording
    } else if ("rgbw fh".includes(event.key)) {
        filter = event.key
    } else if (event.key === "s") {
        stick = !stick
        reference = {
            center,
            factor,
            angle,
        }
    }
}


// OpenCV capture helper
let cvCapture
// (RGBA) Mat to store the latest color camera frame
let mat
let hsvBuffer
let thresh
// contour finder
let finder

function onOpenCVComplete() {
  cvCapture = p5.cv.getCvVideoCapture(capture)

  mat = p5.cv.getRGBAMat(cw, ch)
  hsvBuffer = new cv.Mat()
  p5.cv.imitate(hsvBuffer, mat)
  thresh = new cv.Mat()

  finder = new ContourFinder()
  finder.setMinArea(100)
  finder.setMaxArea(10000)
  finder.setAutoThreshold(false)
}
