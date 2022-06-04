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
	name: "tegumai"
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

}

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

			if (keyIsDown(39)) {
				let x = game[user].x + speed
				if (x >= width) {
					x = 0
				}
				let userRef = database.ref("main/" + user)
				userRef.set({
					name: game[user].name,
					x: x,
					y: game[user].y,
					color: game[user].color
				})
			}
			if (keyIsDown(37)) {
				let x = game[user].x - speed
				if (x <= 0) {
					x = width
				}
				let userRef = database.ref("main/" + user)
				userRef.set({
					name: game[user].name,
					x: x,
					y: game[user].y,
					color: game[user].color
				})
			}
			if (keyIsDown(40)) {
				let y = game[user].y + speed
				if (y >= height) {
					y = 0
				}
				let userRef = database.ref("main/" + user)
				userRef.set({
					name: game[user].name,
					x: game[user].x,
					y: y,
					color: game[user].color
				})
			}
			if (keyIsDown(38)) {
				let y = game[user].y - speed
				if (y <= 0) {
					y = height
				}
				let userRef = database.ref("main/" + user)
				userRef.set({
					name: game[user].name,
					x: game[user].x,
					y: y,
					color: game[user].color
				})
			}
		} catch (e) {}
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
