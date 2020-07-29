/// 解析函数
export function create(Cls, attributes, ...children) {
	let o
	if (typeof Cls === "string") {
		o = new Wrapper(Cls)
	} else {
		o = new Cls({
			timer: {}
		})
	}

	for (let name in attributes) {
		o.setAttribute(name, attributes[name])
	}

	let visit = (children) => {
		for (let child of children) {
			if (child instanceof Array) {
				visit(child)
				continue
			}
			if (typeof child === "string") child = new Text(child)
			o.appendChild(child)
		}
	}

	visit(children)

	return o
}

export class Text {
	constructor(text) {
		this.children = []
		this.root = document.createTextNode(text)
	}
	mountTo(parent) {
		parent.appendChild(this.root)
	}
}

export class Wrapper {
	constructor(type) {
		this.children = []
		this.root = document.createElement(type)
	}

	setAttribute(name, value) {
		this.root.setAttribute(name, value)
	}

	appendChild(child) {
		this.children.push(child)
	}

	addEventListener(type, handle, config) {
		this.root.addEventListener(type, handle, config)
	}

	get style() {
		return this.root.style
	} 

	get clientWidth() {
		return this.root.clientWidth
	}
	
	mountTo(parent) {
		parent.appendChild(this.root)
		for (let child of this.children) {
			if(typeof child === 'string') {
				child = new Text(child)
			}
			child.mountTo(this.root)
		}
	}
}