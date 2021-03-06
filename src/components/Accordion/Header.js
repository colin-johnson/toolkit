/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import collectionOf from '../../prop-types/collectionOf';
import generateTabIndex from '../../utility/generateTabIndex';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Header extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    active: PropTypes.bool.isRequired,
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    onClick: collectionOf.func,
  };

  @bind
  handleOnClick(e) {
    e.preventDefault();

    this.getContext().toggleItem(this.props.index);
    this.handleEvent('click', e);
  }

  render() {
    const { children, index, active } = this.props;

    return (
      <header
        role="tab"
        id={this.formatID('accordion-header', index)}
        className={this.formatChildClass('header', {
          'is-active': active,
        })}
        tabIndex={generateTabIndex(this)}
        aria-controls={this.formatID('accordion-section', index)}
        aria-selected={active}
        aria-expanded={active}
      >
        <a href="" onClick={this.handleOnClick}>{children}</a>
      </header>
    );
  }
}
