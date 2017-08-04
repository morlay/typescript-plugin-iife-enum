import * as ts from "typescript"

const dropExport = (statement: ts.Statement): ts.Statement => {
  if (statement.modifiers) {
    return {
      ...statement,
      modifiers: undefined,
    }
  }
  return statement
}

export const createIIFEEnumTransformer = (): ts.TransformerFactory<ts.SourceFile> => {
  return (context: ts.TransformationContext) => {
    const visitor: ts.Visitor = (node) => {
      if (ts.isEnumDeclaration(node)) {
        return ts.createVariableStatement(
          node.modifiers,
          ts.createVariableDeclarationList([
            ts.createVariableDeclaration(
              ts.createIdentifier(node.name.text),
              undefined,
              ts.createCall(
                ts.createParen(
                  ts.createArrowFunction(
                    undefined,
                    undefined,
                    [],
                    undefined,
                    undefined,
                    ts.createBlock([
                      dropExport(node),
                      ts.createReturn(node.name),
                    ])),
                ),
                undefined,
                [],
              ),
            ),
          ], ts.NodeFlags.Const))

      }
      return ts.visitEachChild(node, visitor, context)
    }

    return (node) => ts.visitNode(node, visitor)
  }
}
