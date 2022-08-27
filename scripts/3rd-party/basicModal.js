/**
 * The Basic Model component.
 *
 * See: {@link https://github.com/LycheeOrg/basicModal}
 *
 * @namespace basicModal
 */

/**
 * @typedef ModalDialogConfiguration
 * @property {string}                 [body='']       HTML snippet to be inserted into the content
 *                                                    area of the dialog
 * @property {string[]}               [classList=[]]  CSS class to be applied to the content area
 *                                                    of the dialog
 * @property {boolean}                [closable=true] indicates whether the dialog can be closed
 *                                                    via {@link close}
 * @property {ModalDialogButtonsData} buttons         configuration data for the main action and
 *                                                    cancel button
 * @property {ModalDialogReadyCB}     [readyCB=null]  callback to be called after the dialog
 *                                                    has become visible and ready for user input
 */

/**
 * @callback ModalDialogReadyCB
 * @param {ModelDialogFormElements} htmlElements a dictionary that maps names to form elements
 * @param {HTMLDivElement}          dialog       the DIV element that represents the dialog
 * @returns {void}
 */

/**
 * @typedef ModelDialogFormElements
 *
 * A dictionary of names of form elements to those form elements.
 *
 * @type {Object.<string, (HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement)>}
 */

/**
 * @typedef ModalDialogButtonsData
 * @property {ModalDialogButtonData} [action] configuration data for the main action button
 * @property {ModalDialogButtonData} [cancel] configuration data for the cancel button
 */

/**
 * @typedef ModalDialogButtonData
 * @property {string}                  [title]         the caption of the button
 * @property {string[]}                [classList=[]]  CSS class to be applied to the button
 * @property {Object.<string, string>} [attributes={}] a dictionary of arbitrary HTML attributes and their values
 * @property {ModalDialogButtonCB}     fn              callback to be called upon an "on-click" event
 */

/**
 * @callback ModalDialogButtonCB
 * @param {ModalDialogResult} values an associative object with the values of
 *                                   all HTML input elements; see {@link getValues}
 * @returns {void}
 */

/**
 * A dictionary that maps name of form elements to their value.
 *
 * @typedef ModalDialogResult
 * @type {Object.<string,(number|string|boolean|FileList)>}
 */

/**
 * @typedef ModalDialogException
 * @property {string} name
 * @property {string} message
 */

/**
 * Returns an associative object containing the values from all HTML form
 * elements.
 *
 * @function getValues
 * @memberOf basicModal
 * @returns {ModalDialogResult}
 */

/**
 * Constructs and shows a modal dialog.
 *
 * After the dialog has become ready, the callback `confData.readyCB` is
 * invoked.
 *
 * @function show
 * @memberOf basicModal
 * @param {ModalDialogConfiguration} confData configuration data for the dialog
 * @returns {void}
 * @throws {ModalDialogException}
 */

/**
 * Removes (potentially) old error indicators and highlights the indicated
 * input element.
 *
 * @function focusError
 * @memberOf basicModal
 * @param {string} [name] the name of the HTML input element which
 *                        caused the error and shall be highlighted
 * @returns {void}
 */

/**
 * Determines whether a modal dialog is visible or not.
 *
 * @function isVisible
 * @memberOf basicModal
 * @returns {boolean}
 */

/**
 * Triggers a virtual "on-click" event on the main action button.
 *
 * The method closes the dialog and calls the registered callback for the main
 * action.
 *
 * @function action
 * @memberOf basicModal
 * @returns {boolean} `true`, if the main action button exists and a click
 *                     event has been triggered; `false` otherwise
 */

/**
 * Triggers a virtual "on-click" event on the cancel button.
 *
 * The method closes the dialog and calls the registered callback for the
 * cancel action.
 *
 * @function cancel
 * @memberOf basicModal
 * @returns {boolean} `true`, if the main action button exists and a click
 *                     event has been triggered; `false` otherwise
 */

/**
 * Reactivates buttons and removes any (potential) error indicator from the
 * input elements.
 *
 * @function reset
 * @memberOf basicModal
 * @returns {void}
 */

/**
 * Closes the dialog without triggering any action.
 *
 * @function close
 * @memberOf basicModal
 * @param {boolean} [force=false]
 * @returns {void}
 */
