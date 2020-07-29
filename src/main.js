import { create, Text, Wrapper } from "./create"

class Carousel {
	constructor() {
		this.root = null
		this.data = null
		this.attribute = new Map()
		this.properties = new Map()
	}

	setAttribute(name, value) {
		this[name] = value
	}

	appendChild(child) {
		this.children.push(child)
	}

	render() {
		const children = this.data.map(url => {
			let element = <img src={url} />
			element.addEventListener("dragstart", event => event.preventDefault())
			return element
		})

		let settimeoutId; // 计时器id

		const root = <div class="carousel">
			{children}
		</div>
		
		let position = 0

		let nexPic = () => {
			let nextPosition = (position + 1) % this.data.length

			let current = children[position]
			let next = children[nextPosition]

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
			settimeoutId = setTimeout(() => {
				nexPic()
			}, 3000);
		}

		settimeoutId = setTimeout(() => {
			nexPic()
		}, 3000)

		root.addEventListener('mousedown', event => {
			// 清理轮播事件
			clearTimeout(settimeoutId)

			const carouselWidth = root.clientWidth
			let startX = event.clientX,
					startY = event.clientY

			let nextPosition = (position + 1) % this.data.length
			let lastPosition = (position - 1 + this.data.length) % this.data.length

			let current = children[position]
			let next = children[nextPosition]
			let last = children[lastPosition]

			current.style.transform = `translateX(${-carouselWidth * position}px)`
			next.style.transform = `translateX(${-carouselWidth -carouselWidth * nextPosition}px)`
			last.style.transform = `translateX(${carouselWidth -carouselWidth * lastPosition}px)`

			current.style.transition = "ease 0s"
			next.style.transition = "ease 0s"
			last.style.transition = "ease 0s"

			let move = event => {
				let offsetX = event.clientX - startX
				console.log(offsetX)
				if (offsetX > carouselWidth) offsetX = 500
				if (offsetX < -carouselWidth) offsetX = -500
				current.style.transform = `translateX(${offsetX  - carouselWidth * position}px)`
				next.style.transform = `translateX(${offsetX  - carouselWidth - carouselWidth * nextPosition}px)`
				last.style.transform = `translateX(${offsetX + carouselWidth - carouselWidth * lastPosition}px)`
			}
			let up = event => {
				const offsetX = event.clientX - startX
				let offsetNum = 0
				console.log(offsetX, carouselWidth)
					// offsetX 属于负数时
					if(offsetX < - carouselWidth * 0.6) {
						offsetNum = -1
						console.log("下一张")
					}else if(offsetX > carouselWidth * 0.6){
						offsetNum = 1
						console.log("上一张")
					}		
					// 判断超过了最大拖拽距离强制播放
					if(offsetNum !== 0) {
						current.style.transition = "" // 使用css规则
						next.style.transition = ""
						last.style.transition = ""
						current.style.transform = `translateX(${offsetNum * carouselWidth  - carouselWidth * position}px)`
						next.style.transform = `translateX(${offsetNum * carouselWidth  - carouselWidth - carouselWidth * nextPosition}px)`
						last.style.transform = `translateX(${offsetNum * carouselWidth + carouselWidth - carouselWidth * lastPosition}px)`
						position = (position + offsetNum + this.data.length)% this.data.length
					} else {
						current.style.transition = "" // 使用css规则
						next.style.transition = ""
						last.style.transition = ""
						current.style.transform = `translateX(${- carouselWidth * position}px)`
						next.style.transform = `translateX(${- carouselWidth - carouselWidth * nextPosition}px)`
						last.style.transform = `translateX(${carouselWidth - carouselWidth * lastPosition}px)`
					}
				document.removeEventListener("mousemove", move)
				document.removeEventListener("mouseup", up)
				settimeoutId = setTimeout(() => {
					nexPic()
				}, 3000);
			}
			document.addEventListener("mousemove", move)
			document.addEventListener("mouseup", up)
		})

		return root
	}

	mountTo(parent) {
		this.render().mountTo(parent)
	}
}

let component = <Carousel
	data={[
		'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
		'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
		'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
		'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
	]}
/>

// mount
component.mountTo(document.querySelector('#container'))