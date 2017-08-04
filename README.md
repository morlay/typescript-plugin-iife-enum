## typescript-plugin-iife-enum

A TypeScript transform to wrapper enum in IIFE.

### Purpose

For now TypeScript will transform enum from

```ts
enum Test {
    Key = 1
}
```
to

```ts
var Test;
(function (Test) {
    Test[Test["Key"] = 1] = "Key";
})(Test || (Test = {}));
```

This result is not friendly for uglyify.

So just wrapper IIFE for enum

```
const Test = (() => {
    enum Test {
        Key = 1
    }
  
    return Test
})
```

## Usage 

```ts
// 1. import default from the plugin module
import { createIIFEEnumTransformer } from 'typescript-plugin-iife-enum');

// 2. add getCustomTransformer method to the loader config
var config = {
    ...
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    ... // other loader's options
                    getCustomTransformers: () => ({ before: [createIIFEEnumTransformer()] })
                }
            }
        ]
    }
    ...
};
```

## Know Issue

TypeScript will drop leading comments of call expression, 
can use babel with [plugin](https://github.com/morlay/babel-plugin-annotate-pure-call-in-variable-declarator) to annotate `#__PURE__```