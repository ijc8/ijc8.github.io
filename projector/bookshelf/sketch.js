// Populated by starting with in the SETUP state and using mouse to highlight book spines.
let rectangles = [{"start":{"x":284,"y":371},"end":{"x":324,"y":993}},{"start":{"x":353,"y":261},"end":{"x":427,"y":996}},{"start":{"x":498,"y":359},"end":{"x":603,"y":982}},{"start":{"x":642,"y":358},"end":{"x":696,"y":982}},{"start":{"x":698,"y":354},"end":{"x":727,"y":990}},{"start":{"x":732,"y":349},"end":{"x":798,"y":994}},{"start":{"x":814,"y":309},"end":{"x":909,"y":990}},{"start":{"x":922,"y":399},"end":{"x":995,"y":994}},{"start":{"x":1002,"y":403},"end":{"x":1062,"y":1002}},{"start":{"x":1072,"y":328},"end":{"x":1129,"y":1003}},{"start":{"x":1139,"y":330},"end":{"x":1177,"y":1011}},{"start":{"x":1188,"y":316},"end":{"x":1262,"y":999}},{"start":{"x":1272,"y":333},"end":{"x":1341,"y":1011}},{"start":{"x":1356,"y":398},"end":{"x":1395,"y":1000}},{"start":{"x":1438,"y":334},"end":{"x":1547,"y":993}},{"start":{"x":1556,"y":317},"end":{"x":1739,"y":999}}]

// Populated manually.
let titles = [
    "Ebelskivers",
    "Artful Design",
    "Unfaithful Music & Disappearing Ink",
    "I Am Brian Wilson",
    "A Composer's Guide to Game Music",
    "The Beatles",
    "The Indispensable Composers",
    "How Music Works",
    "The Design of Everyday Things",
    "Music in the Twentieth and Twenty-First Centuries",
    "Anthology for Music in the Twentieth and Twenty-First Centuries",
    "what if?",
    "The Ten-Speed Bicycle",
    "Chess To Enjoy",
    "Metamagical Themas",
    "Introduction to Algorithms",
]

// Selected rectangle in SETUP state.
let selection
// Index of highlighted rectangle in SELECT state.
let selected = 0
// Search query in SEARCH state.
let query = ""

const states = {
    SETUP: 0,
    SELECT: 1,
    SEARCH: 2,
}

let state = states.SEARCH

function setup() {
    createCanvas(1920, 1080, WEBGL)
    const font = loadFont("Recursive_VF_1.078.ttf")
    textFont(font)
    noCursor()
}

function drawRect(rectangle) {
    rect(
        rectangle.start.x, rectangle.start.y,
        rectangle.end.x - rectangle.start.x,
        rectangle.end.y - rectangle.start.y,
    )
}

function draw() {
    push()
    background(0)
    translate(-width/2, -height/2, 0)
    // These correct for the projector's orientation relative to the target bookshelf.
    // In the future, it'd be nice to interactively calibrated in the SETUP phase (like the book positions).
    rotateY(-Math.PI/32)
    shearY(-Math.PI/128)

    // For calibration, draw horizontal lines:
    // for (let i = 0; i < 1080; i += 70) {
    //     rect(0, i, 1920, 10)
    // }

    ellipse(mouseX, mouseY, 10, 10)
    if (state === states.SETUP) {
        fill(127)
        for (const rectangle of rectangles) {
            drawRect(rectangle)
        }
        if (selection) {
            fill(255)
            drawRect(selection)
        }
    } else if (state === states.SELECT) {
        if (selected) {
            fill(255)
            drawRect(rectangles[selected - 1])
        }
    } else if (state === states.SEARCH && query) {
        for (const [i, rectangle] of Object.entries(rectangles)) {
            fill(70)
            if (titles[i].toLowerCase().includes(query.toLowerCase())) {
                drawRect(rectangle)
            }
        }
    }
    fill(255)
    textSize(140)
    text(query, 650, 240)
    if (frameCount % 100 > 50) {
        rect(660 + textWidth(query), 115, 10, 130)
    }
    pop()
}

function mousePressed() {
    if (state === states.SETUP) {
        selection = {
            start: { x: mouseX, y: mouseY },
            end: { x: mouseX, y: mouseY },
        }
    }
}

function mouseDragged() {
    if (state === states.SETUP) {
        selection.end.x = mouseX
        selection.end.y = mouseY
    }
}

function mouseReleased() {
    if (state === states.SETUP) {
        rectangles.push(selection)
        console.log(JSON.stringify(rectangles))
    }
}

function keyPressed(event) {
    if (event.key === 'Enter') {
        if (state === states.SETUP) {
            state = states.SELECT
        } else {
            query = ""
        }
    } else if (event.key === 'ArrowLeft') {
        selected = (selected - 1 + rectangles.length) % rectangles.length
    } else if (event.key === 'ArrowRight') {
        selected = (selected + 1) % rectangles.length
    } else if (event.key === 'Backspace') {
        query = query.substr(0, query.length-1)
    } else if (event.ctrlKey || event.altKey || event.metaKey || event.key.length > 1) {
        return true
    } else {
        query += event.key
    }
    return false
}
