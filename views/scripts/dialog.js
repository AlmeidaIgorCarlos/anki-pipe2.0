function DialogControl () {

	const dialog = document.getElementById('dialog');
	const dialogButton1 = document.getElementById('dialog-button1');
	const dialogButton2 = document.getElementById('dialog-button2');
	const dialogTitle = document.getElementById('dialog-title');
	const dialogBody = document.getElementById('dialog-body');
	const dialogContainer = document.getElementById('dialog-container');

	if (!dialog) {
		alert('The dialog component is not present on the page.');
		return;
	}

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
		dialogTitle.textContent = text;
		this.props.title = text;
	},
	this.setMessage = (text) => {
		dialogBody.textContent = text;
		this.props.message = text;
	},
	this.show = () => {
		if (!dialogContainer) {
			alert('The dialog component is not present on the page.');
			return;
		}
		this.init();
		dialogContainer.style.display = 'flex';
	},
	this.hide = () => {
		dialogContainer.style.display = 'none';
		Object.assign(this.props, this.defaultProps);
	},
	this.setButton1 = (title, action) => {
		dialogButton1.textContent = title;
		this.props.titleButton1 = title;
		this.props.callbackButton1 = action;
		this.initButton1();
	},
	this.setButton2 = (title, action) => {
		dialogButton2.textContent = title;
		this.props.titleButton2 = title;
		this.props.callbackButton2 = action;
		this.initButton2();
	};
	this.setWidth = (width) => {
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
		this.initButton1();
		this.initButton2();
	};
	this.initButton1 = () => {
		if (this.props.titleButton1)
			document.getElementById('dialog-button1').style.visibility = 'visible';
		else
			document.getElementById('dialog-button1').style.visibility = 'hidden';
	};
	this.initButton2 = () => {
		if (this.props.titleButton2)
			document.getElementById('dialog-button2').style.visibility = 'visible';
		else
			document.getElementById('dialog-button2').style.visibility = 'hidden';
	};
	this.init = () => {
		this.initValues();
		this.initActionButtons();
		this.initDialogAnimation();
	};
}