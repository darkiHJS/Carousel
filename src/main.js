function create() {
	console.log(...arguments)
}
let a = <div>233</div>

class Carousel {
	constructor() {
		this.root = null
		this.data = null
	}
	render() {
		this.root = document.createElement("div")
		this.root.classList.add("carousel")

		for (const d of this.data) {
			let element = document.createElement("img")
			element.src = d
			element.addEventListener("dragstart", event => event.preventDefault())
			this.root.appendChild(element)
		}

		let position = 0
		let nexPic = () => {
			let nextPosition = (position + 1) % this.data.length

			let current = this.root.childNodes[position]
			let next = this.root.childNodes[nextPosition]

			current.style.transition = "ease 0s"
			next.style.transition = "ease 0s"

			current.style.transform = `translateX(${- 100 * position}%)`
			next.style.transform = `translateX(${100 - 100 * nextPosition}%)`

			setTimeout(() => {
				current.style.transition = "" // used css rules
				next.style.transition = ""

				current.style.transform = `translateX(${-100 - 100 * position}%)`
				next.style.transform = `translateX(${- 100 * nextPosition}%)`
				position = nextPosition
			}, 16);
			setTimeout(() => {
				nexPic()
			}, 3000);
		}

		// nexPic()

		this.root.addEventListener('mousedown', event => {
			const carouselWidth = this.root.clientWidth
			let startX = event.clientX,
				startY = event.clientY
			
			let nextPosition = (position + 1) % this.data.length
			let lastPosition = (position - 1 + this.data.length) % this.data.length

			let current = this.root.childNodes[position]
			let next = this.root.childNodes[nextPosition]
			let last = this.root.childNodes[lastPosition]

			current.style.transform = `translateX(${-carouselWidth * position}px)`
			next.style.transform = `translateX(${-carouselWidth -carouselWidth * nextPosition}px)`
			last.style.transform = `translateX(${carouselWidth -carouselWidth * lastPosition}px)`

			current.style.transition = "ease 0s"
			next.style.transition = "ease 0s"
			last.style.transition = "ease 0s"

			let move = event => {
				current.style.transform = `translateX(${event.clientX - startX - carouselWidth * position}px)`
				next.style.transform = `translateX(${event.clientX - startX - carouselWidth - carouselWidth * nextPosition}px)`
				last.style.transform = `translateX(${event.clientX - startX + carouselWidth - carouselWidth * lastPosition}px)`
			}
			let up = event => {
				document.removeEventListener("mousemove", move)
				document.removeEventListener("mouseup", up)
			}

			document.addEventListener("mousemove", move)
			document.addEventListener("mouseup", up)
		})
	}
}

let carousel = new Carousel()

carousel.data = [
	'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
	'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
	'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
	'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
]

carousel.render()

// mount
document.querySelector('#container').appendChild(carousel.root)