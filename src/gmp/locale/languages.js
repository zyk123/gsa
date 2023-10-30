/* Copyright (C) 2018-2022 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

export const BROWSER_LANGUAGE = 'Browser Language';

export const getLanguageCodes = () => Object.keys(Languages);

const Languages = {
  /*de: {
    name: 'German',
    native_name: 'Deutsch',
  },*/
  en: {
    name: 'English',
    native_name: 'English',
  },
  /* zh_TW: {
    name: 'Traditional Chinese', 
    native_name: '繁體中文',
  },*/
  zh_CN: {
    name: 'Simplified Chinese',
    native_name: '简体中文',
  },
};

export default Languages;

// vim: set ts=2 sw=2 tw=80:
