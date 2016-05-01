/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

export default Object.freeze({
    expanded: PropTypes.bool.isRequired,
    hideOverlay: PropTypes.func.isRequired,
    showOverlay: PropTypes.func.isRequired,
    toggleOverlay: PropTypes.func.isRequired,
    uid: PropTypes.string.isRequired
});