# Flex

[![npm version](https://badge.fury.io/js/meter-flex.svg)](https://badge.fury.io/js/meter-flex)

[Flex Powered Meter Wallets](https://www.meter.io/developers/)

## Introduction

Meter-Flex is the standard interface to connect DApps with Meter blockchain and user. `Flex` is a set of well-designed APIs for developers, with injected `Flex Object` in web applications they can easily build decentralized applications.

## Get Started

[Meter Wallet](https://www.meter.io/developers/) or other compatible clients will expose `flex` API by an injected object on `Window Object`.

### Meter App Bootstrapping

Meter apps are usually web apps. On app load, you always need to detect Flex component. If Flex is not available, you may instruct people to setup Flex environment.

To simplify these steps, simply perform redirection:

```javascript
if (!window.flex) {
  location.href =
    "https://shoal.meter.io/r/#" + encodeURIComponent(location.href);
}
```

Additionally, network can be specified:

```javascript
if (!window.flex) {
  // the app prefers running on test net
  location.href =
    "https://shoal.meter.io/r/#/test/" + encodeURIComponent(location.href);
}
```

### Install

#### TypeScript(Recommended)

```bash
npm install meter-flex --save-dev
```

Place following line in any .ts file of your project

```typescript
import "meter-flex";
```

or

add `meter-flex` to `compilerOptions.types` in `tsconfig.json` then you are good to go!

#### Vanilla JS

No need to set up, just code in your favourite way.

### Usage

```javascript
const el = document.createElement("h1");

const status = flex.meter.status;
el.innerText =
  "You are 'flexed' to meter, the status is " +
  (status.progress === 1 ? "synced" : "syncing");

document.querySelector("body").append(el);
```

## Resource

- [Flex Implementation Test](https://flex-impl-test.meter.io)

## FAQ

#### TypeScript complier does not find Flex

First, check `tsconfig.json` and make sure `meter-flex` is present in `compilerOptions.types`. Furthermore if you are doing an angular project and still get the error, you are probably using a larger project with multiple project roots, just adding `meter-flex` to the root config is not enough in this case. You also have to find all `tsconfig.app.ts` and `tsconfig.spec.ts` files in your sub-projects. While these inherit from the main `tsconfig.json` you have to make sure it does not override the types with for example `"types": []` and that there is no conflict with `typesRoots`

## License

Flex is licensed under the
[GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.html), also included
in _LICENSE_ file in the repository.
