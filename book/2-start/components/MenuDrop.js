import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';

class MenuDrop extends React.Component { // eslint-disable-line

    button = undefined;

    static propTypes = {
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(String).isRequired,
    };

  // set initial state
  state = {
    open: false,
    anchorEl: undefined,
  };

  // handle click event
  handleClick = (event) => {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  // handle close event
  handleClose = () => {
    this.setState({
      open: false,
    });
  }

  render() {
    const { options, src, alt } = this.props;

    return (
      <div>
        <Avatar
          role="presentation"
          aria-owns="simple-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
          onKeyPress={this.handleClick}
          src={src}
          alt={alt}
          style={{ margin: '0px 20px 0px auto', curosr: 'pointer' }}
        />
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl} // eslint-disable-line
          open={this.state.open}         // eslint-disable-line
          onClose={this.handleClose}
        >

          <p />
            
          {options.map(option => (
            <div id="wrappingLink" key={option.text}>
              <Link prefetch href={option.href} as={option.as || option.href}>
                <a style={{ padding: '0px 20px' }}>{option.text}</a>
              </Link>
              <p />
            </div>  
          ))}
        </Menu>
      </div>
    );
  }
}

export default MenuDrop;
