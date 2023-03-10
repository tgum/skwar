let firebaseConfig = {
	apiKey: "AIzaSyBTczC1CAHM8CoPqOWSEqzqd1xR8p36hZA",
	authDomain: "game-test-82eaa.firebaseapp.com",
	databaseURL: "https://game-test-82eaa-default-rtdb.firebaseio.com",
	projectId: "game-test-82eaa",
	storageBucket: "game-test-82eaa.appspot.com",
	messagingSenderId: "448010741345",
	appId: "1:448010741345:web:2fb24b9b81c7ab96da6c20"
};
firebase.initializeApp(firebaseConfig);

let database = firebase.database()
let ref = database.ref("main")
let speed = 2
let size = 30
let gameOver = false
let data = {
	x: 200,
	y: 300,
	color: [0, 255, 255],
	name: "tegumai",
	last_active: 0
}
let user
ref.on("value", (data) => {
	// console.log(data.val())
	game = data.val()
	// loop()
}, (err) => {
	console.error(err)
})

let game

function setup() {
	createCanvas(windowWidth - 4, windowHeight - 4)
	let num = random([round(random(0, 1000)), 123])
	let data = {
		x: random(0, width),
		y: random(0, height),
		color: [random(0, 255), random(0, 255), random(0, 255)],
		name: "tgum" + num
	}
	user = ref.push(data).getKey()

	joystick.r = height/5
  joystick.pos = createVector(width - joystick.r/1.5, height - joystick.r/1.5)
  joystick.pressed = false
}

let joystick = {}

function draw() {
	background(0)
	noStroke()
	if (game !== undefined) {
		let keys = Object.keys(game)
		let isAlive = false
		for (let k of keys) {
			if (k == user) {
				isAlive = true
			}
		}
		if (!isAlive) {
			textSize(30)
			fill(255)
			text("GAME OVER!", width / 3, height / 2)
			textSize(10)
			text("Click to continue...", width/2.5, height - height/2.4)
			gameOver = true
			noLoop()
		}
		for (let k of keys) {

			if (k !== user) {
				if (game[k].x >= game[user].x && game[k].x <= game[user].x + size) {
					if (game[k].y >= game[user].y && game[k].y <= game[user].y + size) {
						let userRef = database.ref("main/" + user)
						userRef.remove()
					}
				}
				if (game[k].last_active + 1000 < Date.now()) {
					let kref = database.ref("main/" + k)
					kref.remove()
				}
			}

			try {
				fill(...game[k].color)
				rect(game[k].x, game[k].y, size, size, 0, size/4)
				stroke(100)
				strokeWeight(3)
				line(game[k].x, game[k].y, game[k].x + size / 4, game[k].y)
				line(game[k].x, game[k].y, game[k].x, game[k].y + size / 4)
				noStroke()
				text(game[k].name, game[k].x, game[k].y - size / 2)
			} catch (e) {}
		}

		// if (!isAlive) {
		// 	text("GAME OVER!", width / 3, height / 2)
		// 	gameOver = true
		// 	noLoop()
		// }
		try {
			let dir = [0,0]
			if (keyIsDown(39)) {
				dir[0] += 1
			}
			if (keyIsDown(37)) {
				dir[0] -= 1
			}
			if (keyIsDown(40)) {
				dir[1] += 1
			}
			if (keyIsDown(38)) {
				dir[1] -=1
			}

			joy_dir = handleJoystick()
			if (dir[0]==0&&dir[1]==0) dir = joy_dir

			let userRef = database.ref("main/" + user)
			userRef.set({
				name: game[user].name,
				x: game[user].x + dir[0] * speed,
				y: game[user].y + dir[1] * speed,
				color: game[user].color,
				last_active: Date.now()
			})
		} catch (e) {console.error(e)}
	}
}

function mouseClicked() {
	print("mousePressed")
	if (gameOver) {
		location.href = location.href
	}
}

window.onbeforeunload = () => {
	let userRef = database.ref("main/" + user)
	userRef.remove()
}

function handleJoystick() {
	push()
	strokeWeight(10)
	let userRef = database.ref("main/" + user)
	stroke(game[user].color)
	noFill()
	ellipse(joystick.pos.x, joystick.pos.y, joystick.r)

	let mouse = createVector(mouseX, mouseY)
	if (mouse.dist(joystick.pos) < joystick.r/2 && mouseIsPressed) {
		joystick.pressed = true
	}
	if (!mouseIsPressed) {
		joystick.pressed = false
	}

	let dir = [0, 0]
	if (joystick.pressed) {
		let rel = p5.Vector.sub(mouse, joystick.pos).limit(joystick.r/2)
		let new_mouse = p5.Vector.add(joystick.pos, rel)
		ellipse(new_mouse.x, new_mouse.y, joystick.r/3.5)
		dir = [rel.x / joystick.r * 2, rel.y / joystick.r * 2]
	}

	pop()

	return dir
}

function isMobile() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

