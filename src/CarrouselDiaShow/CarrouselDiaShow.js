import React, {
	Component
} from 'react';
import {
	withRouter
} from "react-router-dom";
import './CarrouselDiaShow.css';

class CarrouselDiaShow extends Component {
	constructor(props) {
		super(props);

		this.setHiddenImagePaths = this.setHiddenImagePaths.bind(this);
		this.rotateLeft = this.rotateLeft.bind(this);
		this.rotateRight = this.rotateRight.bind(this);
		this.autoplay = this.autoplay.bind(this);
		this.rotateToImage = this.rotateToImage.bind(this);
		this.resetImagesTransitionDuration = this.resetImagesTransitionDuration.bind(this);
		this.layoutImgs = this.layoutImgs.bind(this);
		this.layoutLeftImg = this.layoutLeftImg.bind(this);
		this.layoutRightImg = this.layoutRightImg.bind(this);
		this.layoutCentralImg = this.layoutCentralImg.bind(this);

		this.ROTATION_DURATION = 1500;
		this.curRotationDur = this.ROTATION_DURATION;
		this.AUTOPLAY_TIMEOUT = 3000;
		this.DEFAULT_ASPECT_RATIO = [4, 3];

		this.imgs = [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()];

		this.mainDiv = React.createRef();

		this.inLeftRotation = true;
		this.setIsUpdating(false);
		this.state = {
			centralImg: 1,
			centralImgPathId: 0
		};
	}
	componentDidMount() {
		const imgPaths = this.props.imgPaths;
		this.imgs[0].current.src = imgPaths[imgPaths.length - 1];
		this.imgs[1].current.src = imgPaths[0];
		this.imgs[2].current.src = imgPaths[1];

		this.resetImagesTransitionDuration(0);
		this.onAnimationRotationFinished = () => {
			setTimeout(() => {
				this.onAnimationRotationFinished = null;
				this.resetImagesTransitionDuration();
			}, this.ROTATION_DURATION);
		}
		this.layoutImgs();

		setTimeout(this.autoplay, this.AUTOPLAY_TIMEOUT);

		// set resize listener:
		try {
			if (ResizeObserver) {
				this.resizeObserver = new ResizeObserver(entries => {
					this.layoutImgs();
				});
				this.resizeObserver.observe(this.mainDiv.current);
			}
		} catch (error) {
			console.log('ResizeObserver error: ', error);
		}
	}
	componentWillUnmount() {
		// exit autoplay-timeout-loop:
		this.exitAutoplay = true;

		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}
	}
	componentDidUpdate() {
		this.layoutImgs();
	}
	autoplay() {
		if (this.exitAutoplay) {
			return;
		}
		if (this.props.autoplay && !this.isUpdating && (new Date().getTime() - this.lastIsUpdatingEnded) > this.AUTOPLAY_TIMEOUT) {
			this.rotateLeft();
		}
		setTimeout(this.autoplay, this.AUTOPLAY_TIMEOUT);
	}
	allowedToSpinCarrousel() {
		if (this.isUpdating) {
			return false;
		}
		this.setIsUpdating(true);
		setTimeout((() => {
			this.setIsUpdating(false);
		}).bind(this), this.ROTATION_DURATION * 0.5);
		return true;
	}
	setHiddenImagePaths() {
		let leftLeftImgId = this.evalLeftLeftId();
		let rightrightImgId = this.evalRightRightId();

		let nextNextImgPath = this.evalNextNextPath();
		let prevPrevImgPath = this.evalPrevPrevPath();

		this.setImagePath(leftLeftImgId, prevPrevImgPath);
		this.setImagePath(rightrightImgId, nextNextImgPath);
	}
	setLeftRightImagesSelectable() {
		this.imgs.forEach((img, i) => {
      if(!img){
        return;
      }
			img.current.classList.remove('selectableCDS');
		});

		let leftId = this.evalLeftId();
		let rightId = this.evalRightId();

    let leftImg = this.imgs[leftId].current;
    let rightImg = this.imgs[rightId].current;
    if(!leftImg || !rightImg){
      return;
    }
	  leftImg.classList.add('selectableCDS');
	  rightImg.classList.add('selectableCDS');
	}
	rotateLeft() {
		this.inLeftRotation = true;
		if (!this.inRotateToTargetImageAnimation && !this.allowedToSpinCarrousel()) {
			return;
		}
		this.incrementCentralIds();
	}
	rotateRight() {
		this.inLeftRotation = false;
		if (!this.inRotateToTargetImageAnimation && !this.allowedToSpinCarrousel()) {
			return;
		}
		this.decrementCentralIds();
	}
	setImagePath(imgId, imgPath) {
    const img = this.imgs[imgId].current;
    if(!img){
      return;
    }
		img.src = imgPath;
	}
	incrementCentralIds() {
		this.setState({
			centralImg: (this.state.centralImg + 1) % this.imgs.length,
			centralImgPathId: (this.state.centralImgPathId + 1) % this.props.imgPaths.length
		});
	}
	decrementCentralIds() {
		let oldVal = this.state.centralImg;
		let newImgId = this.state.centralImg - 1;
		if (newImgId < 0) {
			newImgId = this.imgs.length - 1;
		}
		let newPathImgId = this.state.centralImgPathId - 1;
		if (newPathImgId < 0) {
			newPathImgId = this.props.imgPaths.length - 1;
		}
		this.setState({
			centralImg: newImgId,
			centralImgPathId: newPathImgId
		});
	}
	layoutImgs() {
		let id = this.state.centralImg;

		let leftId = this.evalLeftId();
		let leftLeftId = this.evalLeftLeftId();

		let rightId = this.evalRightId();
		let rightRightId = this.evalRightRightId();

		// console.log('layoutImgs - centralId: ', id, 'leftId: ', leftId, 'leftLeftId: ', leftLeftId, 'rightId: ', rightId, 'rightRightId: ', rightRightId);

		this.layoutCentralImg(id);
		this.layoutRightImg(rightId);
		this.layoutLeftImg(leftId);
		if (this.inLeftRotation) {
			this.layoutLeftToBackgroundImg(leftLeftId);
			this.layoutBackgroundImg(rightRightId)
		} else {
			this.layoutRightToBackgroundImg(rightRightId);
			this.layoutBackgroundImg(leftLeftId);
		}

		this.setHiddenImagePaths();
		this.setLeftRightImagesSelectable();

		const onAnimationRotationFinished = this.onAnimationRotationFinished;
		if (onAnimationRotationFinished) {
			setTimeout(onAnimationRotationFinished, this.curRotationDur);
		}
	}
	evalAspectRatio(tarWidthFrctn = 0.8) {
		let mainDiv = this.mainDiv.current;
    if(!mainDiv){
      return 0;
    }
		let mdw = mainDiv.offsetWidth;
		let mdh = mainDiv.offsetHeight;

		let [xratio, yratio] = this.props.aspectRatio ?
			this.props.aspectRatio :
			this.DEFAULT_ASPECT_RATIO;
		let [aspectWidth, aspectHeight] = [0, 0];

		aspectWidth = tarWidthFrctn * 100;
		aspectHeight = (mdw * tarWidthFrctn / xratio * yratio) / mdh * 100;
		if (aspectHeight > 100) {
			aspectHeight = 100;
			aspectWidth = (mdh / yratio * xratio) / mdw * 100;
		}

		return [aspectWidth, aspectHeight];
	}
	genCentralLayout() {
		let aspectRatio = this.evalAspectRatio(0.6);
		let animationName = this.inLeftRotation ?
			'rightToCenterCDS' :
			'leftToCenterCDS';
		let style = {
			zIndex: '2',
			left: '50%',
			height: '' + aspectRatio[1] + '%',
			width: '' + aspectRatio[0] + '%',
			transform: 'translate(-50%, -50%)',
			webkitTransform: 'translate(-50%, -50%)',
			animationName: animationName,
			webkitAnimationName: animationName,
			opacity: '1'
		};
		return style;
	}
	genLeftLayout() {
		let aspectRatio = this.evalAspectRatio(0.2);
		let animationName = this.inLeftRotation ?
			'centerToLeftCDS' :
			'backgroundToLeftCDS';
		let style = {
			zIndex: '1',
			left: '20%',
			height: '' + aspectRatio[1] + '%',
			width: '' + aspectRatio[0] + '%',
			transform: 'translate(-50%, -30%)',
			webkitTransform: 'translate(-50%, -30%)',
			animationName: animationName,
			webkitAnimationName: animationName,
			opacity: '1'
		};
		return style;
	}
	genRightLayout() {
		let aspectRatio = this.evalAspectRatio(0.2);
		let animatonName = this.inLeftRotation ?
			'backgroundToRightCDS' :
			'centerToRightCDS';
		let style = {
			zIndex: '1',
			left: '80%',
			height: '' + aspectRatio[1] + '%',
			width: '' + aspectRatio[0] + '%',
			transform: 'translate(-50%, -70%)',
			webkitTransform: 'translate(-50%, -70%)',
			animationName: animatonName,
			webkitAnimationName: animatonName,
			opacity: '1'
		};
		return style;
	}
	genLeftToBackgroundLayout() {
		let aspectRatio = this.evalAspectRatio(0.2);
		let style = {
			zIndex: '0',
			left: '50%',
			height: '0%', //'' + aspectRatio[1] + '%',
			width: '0%', //'' + aspectRatio[0] + '%',
			transform: 'translate(-50%, -50%)',
			webkitTransform: 'translate(-50%, -50%)',
			animationName: 'leftToBackgroundCDS',
			webkitAnimationName: 'leftToBackgroundCDS',
			opacity: '0'
		};
		return style;
	}
	genRightToBackgroundLayout() {
		let aspectRatio = this.evalAspectRatio(0.2);
		let style = {
			zIndex: '0',
			left: '50%',
			height: '0%', //'' + aspectRatio[1] + '%',
			width: '0%', //'' + aspectRatio[0] + '%',
			transform: 'translate(-50%, -50%)',
			webkitTransform: 'translate(-50%, -50%)',
			animationName: 'rightToBackgroundCDS',
			webkitAnimationName: 'rightToBackgroundCDS',
			opacity: '0'
		};
		return style;
	}
	genBackgroundLayout() {
		let aspectRatio = this.evalAspectRatio(0.2);
		let style = {
			zIndex: '0',
			left: '50%',
			height: '0%', //'' + aspectRatio[1] + '%',
			width: '0%', //'' + aspectRatio[0] + '%',
			transform: 'translate(-50%, -50%)',
			webkitTransform: 'translate(-50%, -50%)',
			animationName: 'backgroundFakeAnimCDS',
			webkitAimationName: 'backgroundFakeAnimCDS',
			opacity: '0'
		};
		return style;
	}
	layoutCentralImg(id) {
		this.setLayoutToImg(id, this.genCentralLayout());
	}
	layoutRightImg(id) {
		this.setLayoutToImg(id, this.genRightLayout());
	}
	layoutLeftImg(id) {
		this.setLayoutToImg(id, this.genLeftLayout());
	}
	layoutLeftToBackgroundImg(id) {
		this.setLayoutToImg(id, this.genLeftToBackgroundLayout());
	}
	layoutRightToBackgroundImg(id) {
		this.setLayoutToImg(id, this.genRightToBackgroundLayout());
	}
	layoutBackgroundImg(id) {
		this.setLayoutToImg(id, this.genBackgroundLayout());
	}
	setLayoutToImg(imgId, style) {
		let img = this.imgs[imgId].current;
    if(!img){
      return;
    }
		Object.assign(img.style, style);
	}
	onImgClicked(id) {
		if (this.isUpdating) {
			return;
		}
		let leftId = this.evalLeftId();
		let rightId = this.evalRightId();

		if (id === this.evalLeftId()) {
			this.rotateRight();
		} else {
			this.rotateLeft();
		}
	}
	evalLeftId() {
		return this.evalLeftOffsetId(1);
		// return (this.centralImg - 1) < 0 ? 2 : this.centralImg - 1;
	}
	evalRightId() {
		return this.evalRightOffsetId(1);
	}
	evalLeftLeftId() {
		return this.evalLeftOffsetId(2);
	}
	evalRightRightId() {
		return this.evalRightOffsetId(2);
	}
	evalLeftOffsetId(offset) {
		let x = this.state.centralImg - offset;
		while (x < 0) {
			x = this.imgs.length + x;
		}
		return x;
	}
	evalRightOffsetId(offset) {
		return (this.state.centralImg + offset) % this.imgs.length;
	}
	evalPrevPath() {
		return this.props.imgPaths[this.evalPrevPathId()];
	}
	evalPrevPathId() {
		return this.evalPrevPathIdOffset(1);
		// return (this.centralImgPathId - 1) < 0 ? this.props.imgPaths.length - 1 : this.centralImgPathId - 1;
	}
	evalPrevPrevPath() {
		return this.props.imgPaths[this.evalPrevPrevPathId()];
	}
	evalPrevPrevPathId() {
		return this.evalPrevPathIdOffset(2);
	}
	evalNextPath() {
		return this.props.imgPaths[this.evalNextPathId()];
	}
	evalNextPathId() {
		return this.evalNextPathIdOffset(1);
		// return (this.centralImgPathId + 1) % this.props.imgPaths.length;
	}
	evalNextNextPath() {
		return this.props.imgPaths[this.evalNextNextPathId()];
	}
	evalNextNextPathId() {
		return this.evalNextPathIdOffset(2);
	}
	evalPrevPathIdOffset(offset) {
		let x = this.state.centralImgPathId - offset;
		while (x < 0) {
			x = this.props.imgPaths.length + x;
		}
		return x;
	}
	evalNextPathIdOffset(offset) {
		return (this.state.centralImgPathId + offset) % this.props.imgPaths.length;
	}
	resetImagesTransitionDuration(duration) {
		if (duration === undefined || duration === null) {
			duration = this.ROTATION_DURATION;
		}

		this.curRotationDur = duration;

		const cssDurStr = '' + duration / 1000 + 's';

		this.imgs.forEach(img => {
      img = img.current;
      if(!img){
        return;
      }
			img.style.transitionDuration = cssDurStr;
			img.style.animationDuration = cssDurStr;
		});
	}
	setIsUpdating(isUpdating) {
		this.isUpdating = isUpdating;
		if (!isUpdating) {
			this.lastIsUpdatingEnded = new Date().getTime();
		}
	}
	rotateToImage(tarImgId) {
		let imgPathId = this.state.centralImgPathId;
		let imgCount = this.props.imgPaths.length;

		if (tarImgId === imgPathId) {
			return;
		}

		this.inRotateToTargetImageAnimation = true;
		this.setIsUpdating(true);

		const rotationDuration = 500;
		this.resetImagesTransitionDuration(rotationDuration);

		let offset = tarImgId - imgPathId;

		if (Math.abs(offset) > Math.floor(imgCount * 0.5)) {
			let vorz = offset > 0 ?
				-1 :
				1;
			offset = vorz * (imgCount - Math.abs(offset));
		}

		let loopCounter = 0;
		let rotator = () => {
			loopCounter += 1;
			let exitLoop = loopCounter >= Math.abs(offset);

			if (exitLoop) {
				this.onAnimationRotationFinished = () => {
					this.onAnimationRotationFinished = null;
					setTimeout(() => {
						this.inRotateToTargetImageAnimation = false;
						this.setIsUpdating(false);
						this.resetImagesTransitionDuration();
					}, this.ROTATION_DURATION);
				};
			} else {
				this.onAnimationRotationFinished = () => {
					this.onAnimationRotationFinished = null;
					rotator();
				};
			}

			if (offset > 0) {
				this.rotateLeft();
			} else {
				this.rotateRight();
			}
		};
		rotator();
	}
	render() {
		return ( < div className = "MainDivCDS"
			ref = {
				this.mainDiv
			} >
			<
			img ref = {
				this.imgs[0]
			}
			className = "ImgCDS"
			onClick = {
				() => {
					this.onImgClicked(0);
				}
			}
			/> <
			img ref = {
				this.imgs[1]
			}
			className = "ImgCDS"
			onClick = {
				() => {
					this.onImgClicked(1);
				}
			}
			/> <
			img ref = {
				this.imgs[2]
			}
			className = "ImgCDS"
			onClick = {
				() => {
					this.onImgClicked(2);
				}
			}
			/> <
			img ref = {
				this.imgs[3]
			}
			className = "ImgCDS"
			onClick = {
				() => {
					this.onImgClicked(3);
				}
			}
			/> <
			img ref = {
				this.imgs[4]
			}
			className = "ImgCDS"
			onClick = {
				() => {
					this.onImgClicked(4);
				}
			}
			/> <
			div id = "IndicatorsCDS" > {
				this.props.imgPaths.map((imgPath, id) => {
						let cls = (id === this.state.centralImgPathId) ?
							"IndicatorCDS focused" :
							"IndicatorCDS";
						return ( < div className = {
								cls
							}
							key = {
								id
							}
							onClick = {
								() => {
									this.rotateToImage(id)
								}
							} > < /div>);
						})
				} <
				/div> < /
				div > );
		}
	}

	export default withRouter(CarrouselDiaShow);
