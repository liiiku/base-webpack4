const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

const moduleAnalyser = (filename) => {
  const content = fs.readFileSync(filename, 'utf-8')
  // console.log(content)
  const ast = parser.parse(content, {
    sourceType: 'module' // 如果代码是用es6 module 编写的话，需要增加这个配置
  })
  const dependencies = {}
  traverse(ast, {
    // ast 抽象语法树中的 type: 'ImportDeclaration'
    ImportDeclaration({ node }) {
      // console.log(node)
      const dirname = path.dirname(filename) // 拿到filename 对应的文件夹路径
      const newFile = './' + path.join(dirname, node.source.value)
      dependencies[node.source.value] = newFile
    }
  })
  // console.log(dependencies)
  // console.log(ast.program.body)
  // 这个code 就是可以在浏览器运行的代码
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })
  // console.log(code)
  return {
    filename,
    dependencies,
    code
  }
}


const makeDependenciesGraph = (enrty) => {
  // 首先要对入口文件进行分析
  const entryModule = moduleAnalyser(enrty)
  const graphArray = [entryModule]
  // console.log(entryModule)
  for (let i = 0; i < graphArray.length; i++) {
    const item = graphArray[i]
    const { dependencies } = item
    if (dependencies) {
      for (let j in dependencies) {
        graphArray.push(moduleAnalyser(dependencies[j]))
      }
    }
  }
  const graph = {}
  graphArray.forEach(item => {
    graph[item.filename] = {
      dependencies: item.dependencies,
      code: item.code
    }
  })
  // console.log(graph)
  return graph
}

const generateCode = (entry) => {
  const graph = JSON.stringify(makeDependenciesGraph(entry))
  return `
    (function(graph) {
      function require(module) {
        function localRequire(relativePath) {
          return require(graph[module].dependencies[relativePath])
        }
        var exports = {};
        (function(require, exports, code) {
          eval(code)
        })(localRequire, exports, graph[module].code)
        return exports;
      };
      require('${entry}')
    })(${graph});
  `
}

// const moduleInfo = moduleAnalyser('./src/index.js')
// const graphInfo = makeDependenciesGraph('./src/index.js')
const code = generateCode('./src/index.js')
console.log(code)