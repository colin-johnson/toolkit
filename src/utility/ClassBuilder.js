/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import formatBEM from './formatBEM';
import invariant from './invariant';

/**
 * The `ClassBuilder` is a proper mechanism for building a list of possible
 * CSS class names that follow the BEM specification (Titon's version).
 * It should support all possible variations in a simple format.
 *
 * Instantiate with a primary class name:
 *
 *      let className =
 *          new ClassBuilder('unique');         // .unique
 *          new ClassBuilder('unique', 'pre-');   // .pre-unique
 *
 * Add secondary classes:
 *
 *      className
 *          .addClass('foo')                    // .foo
 *          .addClass('foo', 'element');        // .foo-element
 *          .addClass('foo', '', 'modifier');   // .foo--modifier
 *          .addClass(['foo', 'element'])       // .foo-element
 *          .addClass({                         // .foo--modifier
 *              block: 'foo',
 *              modifier: 'modifier'
 *          });
 *
 * Add modifier classes that append to the primary class:
 *
 *      className
 *          .addModifier('inverse')             // .unique--inverse
 *          .addModifier('reverse');            // .unique--reverse
 *
 * Map modifier (@) and tertiary classes that evaluate to true:
 *
 *      className.mapClasses({
 *          'is-active': true,
 *          'is-disabled': false,
 *          'no-scroll': true,
 *          '@inverse': true
 *      });
 *
 * Cast to a string or call `toString()`:
 *
 *      String(className)
 *      className.toString()
 *
 */
export default class ClassBuilder {

  /**
   * Setup the primary class and prefix.
   *
   * @param {String} primaryClass     Primary class to utilizie with modifiers
   * @param {String} prefix           Prefix to prepend to all classes
   */
  constructor(primaryClass, prefix = '') {
    invariant(primaryClass, '`%s` requires a primary class name.', this.constructor.name);

    this.prefix = prefix;
    this.classes = [];

    // Add the primary class and then save a reference
    this.addClass(primaryClass);
    this.primaryClass = this.classes[0];
  }

  /**
   * Add a secondary BEM compatible class name.
   *
   * @param {String|Array|Object} block
   * @param {String} [element]
   * @param {String} [modifier]
   * @param {Boolean} [prefix]
   * @returns {ClassBuilder}
   */
  addClass(block, element = '', modifier = '', prefix = true) {
    this.classes.push(
            (prefix ? this.prefix : '') + formatBEM(block, element, modifier),
    );

    return this;
  }

  /**
   * Add a modifier class based on the current primary class.
   *
   * @param {String} modifier
   * @returns {ClassBuilder}
   */
  addModifier(modifier) {
    this.addClass(this.primaryClass, '', modifier, false);

    return this;
  }

  /**
   * Map a list of secondary classes and append all who's value evaluates to true.
   * Classes mapped this way must be literal strings and will not be prefixed or BEM-ed,
   * unless defined as a modifier.
   *
   * @param {Object} classes
   * @returns {ClassBuilder}
   */
  mapClasses(classes) {
    Object.keys(classes).forEach((key) => {
      if (classes[key]) {
        if (key.charAt(0) === '@') {
          this.addModifier(key.substr(1));
        } else {
          this.classes.push(key);
        }
      }
    });

    return this;
  }

  /**
   * Loop through a list of possible classes and either add a secondary class,
   * add a modifier class, or map multiple classes.
   *
   * @param {...String|Array|Object} params
   * @returns {ClassBuilder}
   */
  mapParams(...params) {
    params.forEach((param) => {
      if (typeof param === 'string' || Array.isArray(param)) {
        this.addClass(param);
      } else if (typeof param === 'object') {
        if (param.block) {
          this.addClass(param);
        } else {
          this.mapClasses(param);
        }
      }
    });

    return this;
  }

  /**
   * Return all classes as a CSS valid string.
   *
   * @returns {String}
   */
  toString() {
    return this.classes.join(' ').trim();
  }
}
