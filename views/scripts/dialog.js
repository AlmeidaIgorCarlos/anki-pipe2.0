function DialogControl () {

	const dialogButton1 = document.getElementById('dialog-button1');
	const dialogButton2 = document.getElementById('dialog-button2');
	dialogButton1.addEventListener('click', () => this.props.callbackButton1());
	dialogButton2.addEventListener('click', () => this.props.callbackButton2());

	this.defaultProps = {
		width: 200,
		title: 'Example',
		message: 'Example',
		titleButton1: 'Example',
		callbackButton1: () => {},
		titleButton2: 'Example',
		callbackButton2: () => {}
	},
	this.props = Object.assign({}, this.defaultProps),
	this.setTitle = (text) => {
		this.title = text;
		const dialogTitle = document.getElementById('dialog-title');
		dialogTitle.textContent = text;
		this.props.title = text;
	},
	this.setMessage = (text) => {
		const dialogBody = document.getElementById('dialog-body');
		dialogBody.textContent = text;
		this.props.message = text;
	},
	this.show = () => {
		const dialogContainer = document.getElementById('dialog-container');
		if (!dialogContainer) {
			alert('The dialog component is not present on the page.');
			return;
		}
		this.init();
		dialogContainer.style.display = 'flex';
	},
	this.hide = () => {
		const dialogContainer = document.getElementById('dialog-container');
		dialogContainer.style.display = 'none';
		Object.assign(this.props, this.defaultProps);
	},
	this.setButton1 = (title, action) => {
		const dialogButton1 = document.getElementById('dialog-button1');
		dialogButton1.textContent = title;
		this.props.titleButton1 = title;
		this.props.callbackButton1 = action;
		this.initActionButtons();
	},
	this.setButton2 = (title, action) => {
		const dialogButton2 = document.getElementById('dialog-button2');
		dialogButton2.textContent = title;
		this.props.titleButton2 = title;
		this.props.callbackButton2 = action;
		this.initActionButtons();
	};
	this.setWidth = (width) => {
		const dialog = document.getElementById('dialog');
		dialog.style.width = `${width}px`;
		dialog.style.marginLeft = `-${width / 2}px`;
		this.props.width = width;
	};
	this.initValues = () => {
		this.setTitle(this.props.title);
		this.setMessage(this.props.message);
		this.setButton1(this.props.titleButton1, this.props.callbackButton1);
		this.setButton2(this.props.titleButton2, this.props.callbackButton2);
		this.setWidth(this.props.width);
	};
	this.initDialogAnimation = () => {
		const dialogContainer = document.getElementById('dialog-container');
		const dialog = document.getElementById('dialog');
		dialog.addEventListener('click', (e) => e.stopPropagation());
		dialogContainer.addEventListener('click', (e)=> {
			dialog.classList.remove('swing-animation');
			setTimeout(() => {
				dialog.classList.remove('swing-animation');
				dialog.classList.add('swing-animation');
			}, 100);
		});
	};
	this.initActionButtons = () => {
		if (this.props.titleButton1)
			document.getElementById('dialog-button1').style.display = 'block';
		else
			document.getElementById('dialog-button1').style.display = 'none';

		if (this.props.titleButton2)
			document.getElementById('dialog-button2').style.display = 'block';
		else
			document.getElementById('dialog-button2').style.display = 'none';
	};
	this.init = () => {
		this.initValues();
		this.initActionButtons();
		this.initDialogAnimation();
	};
}