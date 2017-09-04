import * as ts from "typescript"
import { createIIFEEnumTransformer } from "../"

const transformer = createIIFEEnumTransformer()
const printer = ts.createPrinter()

const cases = [{
  title: "wrapper enum",
  src: `enum Test {
  K = 1
}`,
  dest: `const Test = (() => { enum Test {
    K = 1
} return Test; })();
`,
}, {
  only: true,
  title: "wrapper enum with export",
  src: `export enum Test {
  K = 1
}`,
  dest: `export const Test = (() => { enum Test {
    K = 1
} return Test; })();
`,
}]

describe("test cases", () => {
  cases.forEach((caseItem) => {
    it(caseItem.title, () => {
      const sourceFile = ts.createSourceFile("test.ts", caseItem.src, ts.ScriptTarget.Latest)
      const transformedFile = ts.transform(sourceFile, [
        transformer,
      ]).transformed[0]
      expect(printer.printFile(transformedFile)).toEqual(caseItem.dest)
    })
  })
})
