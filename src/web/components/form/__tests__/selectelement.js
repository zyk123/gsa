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
import React from 'react';

import {isFunction} from 'gmp/utils/identity';

import {render} from 'web/utils/testing';
import Theme from 'web/utils/theme';
import PropTypes from 'web/utils/proptypes';

import {
  Box,
  Item,
  Input,
  ItemContainer,
  Menu,
  SelectContainer,
  SelectedValue,
  caseInsensitiveFilter,
} from '../selectelements';

describe('Box tests', () => {
  test('should render', () => {
    const {element} = render(<Box />);

    expect(element).toHaveStyleRule('background-color', Theme.white);
    expect(element).toHaveStyleRule('border-radius', '2px');
    expect(element).toMatchSnapshot();
  });

  test('should render opened', () => {
    const {element} = render(<Box isOpen={true} />);

    expect(element).toHaveStyleRule('border-radius', '2px 2px 0 0');
    expect(element).toMatchSnapshot();
  });

  test('should render disabled', () => {
    const {element} = render(<Box disabled={true} />);

    expect(element).toHaveStyleRule('background-color', Theme.dialogGray);
    expect(element).toMatchSnapshot();
  });
});

describe('Input tests', () => {
  test('should render', () => {
    const {element} = render(<Input />);
    expect(element).toMatchSnapshot();
  });
});

describe('Item tests', () => {
  test('should render', () => {
    const {element} = render(<Item />);

    expect(element).not.toHaveStyleRule('background-color');
    expect(element).not.toHaveStyleRule('color');
    expect(element).toMatchSnapshot();
  });

  test('should render active', () => {
    const {element} = render(<Item isActive={true} />);

    expect(element).toHaveStyleRule('background-color', Theme.mediumBlue);
    expect(element).toHaveStyleRule('color', Theme.white);
    expect(element).toMatchSnapshot();
  });

  test('should render selected', () => {
    const {element} = render(<Item isSelected={true} />);

    expect(element).toHaveStyleRule('background-color', Theme.lightGray);
    expect(element).not.toHaveStyleRule('color');
    expect(element).toMatchSnapshot();
  });
});

describe('ItemContainer tests', () => {
  test('should render', () => {
    const {element} = render(<ItemContainer />);
    expect(element).toMatchSnapshot();
  });
});

describe('SelectContainer tests', () => {
  test('should render', () => {
    const {element} = render(<SelectContainer width="100px" />);

    expect(element).toHaveStyleRule('width', '100px');
    expect(element).toMatchSnapshot();
  });
});

describe('SelectValue tests', () => {
  test('should render', () => {
    const {element} = render(<SelectedValue />);

    expect(element).toHaveStyleRule('cursor', 'pointer');
    expect(element).toMatchSnapshot();
  });

  test('should render disabled', () => {
    const {element} = render(<SelectedValue disabled={true} />);

    expect(element).toHaveStyleRule('cursor', 'default');
    expect(element).toMatchSnapshot();
  });
});

describe('caseInsensitiveFilter tests', () => {
  test('should not filter if search term is undefined', () => {
    const filter = caseInsensitiveFilter();
    const items = [
      {
        value: 'foo',
        label: 'Foo',
      },
      {
        value: 'bar',
        label: 'Bar',
      },
    ];

    expect(isFunction(filter)).toEqual(true);
    expect(items.filter(filter)).toEqual(items);
  });

  test('should not filter if search term is empty', () => {
    const filter = caseInsensitiveFilter();
    const items = [
      {
        value: 1,
        label: 'Foo',
      },
      {
        value: 2,
        label: 'Bar',
      },
    ];

    expect(isFunction(filter)).toEqual(true);
    expect(items.filter(filter)).toEqual(items);
  });

  test('should filter by search term', () => {
    const filter = caseInsensitiveFilter('Foo');
    const items = [
      {
        value: 1,
        label: 'Foo',
      },
      {
        value: 2,
        label: 'Bar',
      },
    ];

    expect(isFunction(filter)).toEqual(true);
    expect(items.filter(filter)).toEqual([
      {
        value: 1,
        label: 'Foo',
      },
    ]);
  });

  test('should filter by search term case insensitive', () => {
    const filter = caseInsensitiveFilter('OO');
    const items = [
      {
        value: 1,
        label: 'Foo',
      },
      {
        value: 2,
        label: 'Bar',
      },
    ];

    expect(isFunction(filter)).toEqual(true);
    expect(items.filter(filter)).toEqual([
      {
        value: 1,
        label: 'Foo',
      },
    ]);
  });
});

class MenuTestComponent extends React.Component {
  constructor(...args) {
    super(...args);

    this.target = React.createRef();
    this.mockBoundingClientRect = this.props.mockBoundingClientRect;
    this.notifyRefAssigned = jest.fn();
  }

  render() {
    const hasTarget = this.target.current !== null;
    if (hasTarget && this.mockBoundingClientRect) {
      const rect = this.target.current.closest('.multiselect-scroll');
      if (rect !== null) {
        jest.spyOn(rect, 'getBoundingClientRect').mockImplementation(() => {
          return {
            top: 100,
            bottom: 50,
            height: 20,
            width: 100,
            right: 10,
            left: 50,
          };
        });
      }
    }
    return (
      <div>
        <div
          ref={this.target}
          className={this.mockBoundingClientRect ? 'multiselect-scroll' : ''}
          style={{width: '200px', height: '100px'}}
        />
        {hasTarget && (
          <Menu
            {...this.props}
            notifyRefAssigned={this.notifyRefAssigned}
            target={this.target}
          />
        )}
      </div>
    );
  }
}

MenuTestComponent.propTypes = {
  mockBoundingClientRect: PropTypes.bool,
};

describe('Menu tests', () => {
  window.innerHeight = 180;
  const renderTest = props => {
    const {rerender, ...other} = render(<MenuTestComponent {...props} />);
    rerender(<MenuTestComponent {...props} />);
    return other;
  };

  test('should render', () => {
    const {getByTestId} = renderTest();
    const menu = getByTestId('select-menu');
    expect(menu).toMatchSnapshot();
  });

  test('should render with position reference to parent element', () => {
    const {getByTestId} = renderTest({mockBoundingClientRect: true});
    const menu = getByTestId('select-menu');
    expect(menu).toHaveStyleRule({top: '120px'});
    expect(menu).toMatchSnapshot();
  });

  test('should render with position adjust', () => {
    const {getByTestId} = renderTest({position: 'adjust'});

    const menu = getByTestId('select-menu');

    expect(menu).toMatchSnapshot();
  });

  test('should render with position right', () => {
    const {getByTestId} = renderTest({position: 'right'});

    const menu = getByTestId('select-menu');

    expect(menu).toMatchSnapshot();
  });

  test('should not render without target', () => {
    const notifyRefAssigned = jest.fn();
    const {queryByTestId} = render(
      <Menu target={null} notifyRefAssigned={notifyRefAssigned} />,
    );

    const menu = queryByTestId('select-menu');

    expect(menu).toBeNull();
  });

  test('should render with open direction upwards', () => {
    const {getByTestId} = renderTest({
      mockBoundingClientRect: true,
      menuHeight: 75,
    });
    const menu = getByTestId('select-menu');
    expect(menu).toMatchSnapshot();
  });

  test('should render with open direction downwards', () => {
    const {getByTestId} = renderTest({
      mockBoundingClientRect: true,
      menuHeight: 55,
    });
    const menu = getByTestId('select-menu');
    expect(menu).toMatchSnapshot();
  });
});

// vim: set ts=2 sw=2 tw=80:
