/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {copyProperties} from '../../src/polyfills/custom-elements';

describes.fakeWin('copyProperties', {}, () => {
  it('copies own properties from proto object', () => {
    const obj = {};
    const proto = {test: 1};

    copyProperties(obj, proto);

    expect(obj).to.have.ownPropertyDescriptor('test', {
      value: 1,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  });

  it('copies own descriptor from proto object', () => {
    const obj = {};
    const proto = {};
    Object.defineProperty(proto, 'test', {value: 1});

    copyProperties(obj, proto);

    expect(obj).to.have.ownPropertyDescriptor('test', {
      value: 1,
      configurable: false,
      enumerable: false,
      writable: false,
    });
  });

  it('copies own getter/setter from proto object', () => {
    const obj = {};
    const proto = {};

    let value = 1;
    Object.defineProperty(proto, 'test', {
      get() {
        return value;
      },
      set(v) {
        value = v;
      },
    });

    copyProperties(obj, proto);

    expect(obj).to.have.ownPropertyDescriptor('test');
    expect(obj.test).to.equal(1);
    obj.test = 2;
    expect(obj.test).to.equal(2);
    expect(value).to.equal(2);
  });

  it('does not override already defined property', () => {
    const obj = {test: 1};
    const proto = {test: 2};

    copyProperties(obj, proto);

    expect(obj.test).to.equal(1);
  });

  it('copies own properties from proto.__proto__ object', () => {
    const obj = {};
    const proto = Object.create({test: 1});

    copyProperties(obj, proto);

    expect(obj).to.have.ownPropertyDescriptor('test', {
      value: 1,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  });

  it('copies own descriptor from proto object', () => {
    const obj = {};
    const proto = Object.create(
      {},
      {
        test: {value: 1},
      }
    );

    copyProperties(obj, proto);

    expect(obj).to.have.ownPropertyDescriptor('test', {
      value: 1,
      configurable: false,
      enumerable: false,
      writable: false,
    });
  });

  it('copies own getter/setter from proto object', () => {
    let value = 1;
    const obj = {};
    const proto = Object.create(
      {},
      {
        test: {
          get() {
            return value;
          },
          set(v) {
            value = v;
          },
        },
      }
    );

    copyProperties(obj, proto);

    expect(obj).to.have.ownPropertyDescriptor('test');
    expect(obj.test).to.equal(1);
    obj.test = 2;
    expect(obj.test).to.equal(2);
    expect(value).to.equal(2);
  });

  it('does not override already defined property', () => {
    const obj = {test: 1};
    const proto = Object.create({test: 2});

    copyProperties(obj, proto);

    expect(obj.test).to.equal(1);
  });

  it('does not override closer property with __proto__ property', () => {
    const obj = {};
    const proto = Object.create(
      {test: 2},
      {
        test: {value: 1},
      }
    );

    copyProperties(obj, proto);

    expect(obj.test).to.equal(1);
  });
});
