import React, {Component} from 'react';

// local files:
import './SpinningWheel.css';

class RotatedDiv extends Component {
  render() {
    const tag = this.props.tag;

    let lblRot = this.props.labelRotation;
    let rotRad = this.props.rotationRad;
    rotRad %= Math.PI * 2;
    if (rotRad < 0) {
      rotRad = (Math.PI * 2) + rotRad;
    }

    let lblTranslX = '-50%';

    let rotOffs = Math.PI * 0.5;

    let flipRotatinStartRad = rotOffs + Math.PI * 0.5;
    let flipRotatinEndRad = flipRotatinStartRad + Math.PI;

    if ((rotRad > flipRotatinStartRad) && (rotRad < flipRotatinEndRad)) {
      lblRot += Math.PI;
      lblTranslX = '50%';
    }

    let lblStyle = {
      fontSize: this.props.fontSize
        ? this.props.fontSize
        : '20px',
      transform: 'rotate(' + lblRot + 'rad) translateX(' + lblTranslX + ')'
    };
    let lblClass = !!this.props.selected
      ? "SpinningEntryLabel selected"
      : "SpinningEntryLabel";
    this.div = (<button style={lblStyle} className={lblClass} onClick={() => {
        if (!!this.props.onLabelClicked) {
          this.props.onLabelClicked();
        }
      }}>
      {tag}
    </button>);

    let xOffs = this.props.xOffset;
    let yOffs = this.props.yOffset;

    let translateX = this.props.width * 0.5 + Math.sin(rotRad) * (this.props.width * 0.5 * xOffs);
    let translateY = this.props.height * 0.5 - Math.cos(rotRad) * (this.props.height * 0.5 * yOffs);

    let adjRotRad = (rotRad > Math.PI && rotRad < Math.PI * 2)
      ? (rotRad + Math.PI)
      : rotRad;
    const rot = {
      transform: ' translateX(calc(' + translateX + 'px - 50%)) ' + ' translateY(calc(' + translateY + 'px - 50%)) ' + ' rotate(' + rotRad + 'rad)',

      transitionDuration: this.props.transitionDuration
    };

    return (<div style={rot} className="SpinningEntry">
      {this.div}
    </div>);
  }
}

class SpinningWheel extends Component {
  constructor(props) {
    super(props);

    this.spinningWheelDivRef = React.createRef();

    this.state = {
      focusedId: 0,
      transitionDuration: '0.15s',
      spinningWheelDivSize: [0, 0]
    }
    this.initTagAlreadySet = false;

    this.rotateElementsAtOnce = this.rotateElementsAtOnce.bind(this);
    this.rotateElementsIncremental = this.rotateElementsIncremental.bind(this);
    this.setSpinningWheelFontSize = this.setSpinningWheelFontSize.bind(this);
    this.setSpinningWheelSize = this.setSpinningWheelSize.bind(this);
  }
  elementClicked(elmntId) {
    this.rotateToElementId(elmntId);

    this.props.onTagClicked(this.props.tags[elmntId], elmntId);
  }
  rotateToElementId(elmntId) {
    let dx;

    let tagsCount = this.props.tags.length;

    let curFocusedId = this.state.focusedId;

    let clockwise;
    let counterclock;

    if (elmntId > curFocusedId) {
      clockwise = elmntId - curFocusedId;
      counterclock = (tagsCount - elmntId) + curFocusedId;
    } else {
      clockwise = (tagsCount - curFocusedId) + elmntId;
      counterclock = curFocusedId - elmntId;
    }
    dx = clockwise < counterclock
      ? clockwise
      : -counterclock;

    this.rotateElementsIncremental(dx);
  }
  focuseInitTagIfNotAlreadyDone() {
    // on initialization - make sure initSelection is focused:
    if (this.initTagAlreadySet) {
      return;
    }

    const initSelTag = this.props.initSelection;
    if (!initSelTag) {
      return;
    }

    const tags = this.props.tags;
    for (let i = 0; i < tags.length; ++i) {
      if (tags[i] === initSelTag) {
        this.initTagAlreadySet = true;
        if (this.state.focusedId !== i) {
          this.setState({focusedId: i});
        }
        return;
      }
    }
  }
  componentDidMount() {
    this.setSpinningWheelFontSize();

    try {
      if (ResizeObserver) {
        console.log('ResizeObserver available!');
        this.resizeObserver = new ResizeObserver(entries => {
          for (let entry in entries) {
            console.log('observer - entry: ', entry);
            this.setSpinningWheelFontSize();
          }
        });
        this.resizeObserver.observe(this.spinningWheelDivRef.current);
      }
    } catch (e) {
      console.log('ResizeObserver error: ', e);
    }
  }
  componentDidUpdate() {
    this.focuseInitTagIfNotAlreadyDone();
  }
  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.spinningWheelDivRef.current);
    }
  }
  rotateElementsAtOnce(idOffs) {
    this.setState({transitionDuration: '1s'});
    let focusedId = this.state.focusedId;
    let newFocusedId = (focusedId + idOffs) % this.props.tags.length;
    if (newFocusedId < 0) {
      newFocusedId = this.props.tags.length + newFocusedId;
    }

    this.setState({focusedId: newFocusedId});
  }
  rotateElementsIncremental(idOffs) {
    console.log('idOffs: ', idOffs);
    this.setState({transitionDuration: '0s'});
    let totalDuration = Math.abs(idOffs) * 200; // 500;
    let dt = 16;

    let tagCount = this.props.tags.length;
    let fctnToOffs = idOffs / tagCount;

    let steps = totalDuration / dt;

    let rotIncrmnt = idOffs / steps;

    let cntr = 0;

    let incrmntRot = () => {
      let focusedId = this.state.focusedId;

      let newFocusedId = focusedId + rotIncrmnt;
      if (newFocusedId < 0) {
        newFocusedId = tagCount + newFocusedId;
      }
      newFocusedId = newFocusedId % tagCount;

      this.setState({focusedId: newFocusedId});

      cntr += 1;
      if (cntr >= steps) {
        let finalId = Math.round(focusedId) % tagCount;

        this.setState({focusedId: finalId});

        return;
      }
      setTimeout(incrmntRot, dt);
    };
    setTimeout(incrmntRot, dt);
  }

  getRotRadPerTag() {
    const tagsSize = this.props.tags.length;
    return Math.PI * 2 / tagsSize;
  }
  setSpinningWheelFontSize() {
    this.setSpinningWheelSize();
    let sw = this.spinningWheelDivRef.current;
    let w = sw.offsetWidth;
    let h = sw.offsetHeight;
    let mn = w < h
      ? w
      : h;
    if (mn < 300) {
      this.setState({spinningWheelFontSize: '12px'});
    } else if (mn < 500) {
      this.setState({spinningWheelFontSize: '15px'});
    } else if (mn < 800) {
      this.setState({spinningWheelFontSize: '25px'});
    } else {
      this.setState({spinningWheelFontSize: '35px'});
    }
  }
  setSpinningWheelSize() {
    let sw = this.spinningWheelDivRef.current;
    let sze = sw.getBoundingClientRect();
    this.setState({
      spinninWheelSize: [sw.offsetWidth, sw.offsetHeight]
    });
  }
  render() {
    const focusedId = this.state.focusedId;

    const tagsSize = this.props.tags.length;
    const rotRadPerTag = this.getRotRadPerTag();
    const rotRadOffs = -rotRadPerTag * focusedId + Math.PI * 0.5;

    let width = this.props.width;
    let height = this.props.height;

    let rad = 0.9;
    let labelRotation = Math.PI / 2 * 3;

    const testTag = this.props.tags[0];

    let isFocused = (i) => {
      let rng = 0.5
      return i > focusedId - rng && i < focusedId + rng;
    };

    return (<div className="SpinningWheel TextNotSelectable" ref={this.spinningWheelDivRef}>
      {
        this.props.tags.map((tag, i) => {
          return <RotatedDiv key={i} className="SpinningEntry" transitionDuration={this.state.transitionDuration} tag={tag} width={this.state.spinninWheelSize[0]} height={this.state.spinninWheelSize[1]} fontSize={this.state.spinningWheelFontSize} xOffset={rad} yOffset={rad} selected={isFocused(i)} labelRotation={labelRotation} rotationRad={i * rotRadPerTag + rotRadOffs} onLabelClicked={() => {
              this.elementClicked(i)
            }}/>;
        })
      }
    </div>);
  }
}

export default SpinningWheel;
