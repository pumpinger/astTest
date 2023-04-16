const fs = require('fs');
const path = require('path');
const { parseComponent } = require('vue-template-compiler');
const acorn = require('acorn');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

// 您要修改的 .vue 文件路径
const filePath = path.join(__dirname, './YourComponent.vue');

// 读取 .vue 文件内容
const fileContent = fs.readFileSync(filePath, 'utf-8');

// 使用 vue-template-compiler 解析 .vue 文件
const parsedComponent = parseComponent(fileContent);

// 提取 <script> 内容
const scriptContent = parsedComponent.script.content;

// 使用 Acorn 解析 <script> 内容
const ast = acorn.parse(scriptContent, {
    sourceType: 'module',
    ecmaVersion: 2020,
});

estraverse.traverse(ast, {
    enter(node) {
        if (node.type === 'ExportDefaultDeclaration') {
            const dataNode = node.declaration.properties.find(
                (property) => property.key.name === 'data'
            );

            if (dataNode) {
                const returnNode = dataNode.value.body.body.find(
                    (item) => item.type === 'ReturnStatement'
                );

                if (returnNode) {
                    const listNode = returnNode.argument.properties.find(
                        (property) => property.key.name === 'list'
                    );

                    if (listNode) {
                        listNode.value.elements.forEach((element) => {
                            if (
                                element.type === 'ObjectExpression' &&
                                element.properties.some(
                                    (prop) =>
                                        prop.type === 'Property' &&
                                        prop.key.name === 'name' &&
                                        prop.value.value === 'sam'
                                )
                            ) {
                                let valueProperty = element.properties.find(
                                    (prop) => prop.type === 'Property' && prop.key.name === 'value'
                                );

                                if (valueProperty) {
                                    valueProperty.value.value = 1;
                                } else {
                                    element.properties.push({
                                        type: 'Property',
                                        key: { type: 'Identifier', name: 'value' },
                                        value: { type: 'Literal', value: 1 },
                                    });
                                }
                            }
                        });
                    }
                }
            }
        }
    },
});

// 将更新后的 AST 转回 JavaScript 代码
const updatedScriptContent = escodegen.generate(ast);

// 将更新后的 <script> 内容替换回解析后的组件
const updatedComponentContent = fileContent.replace(
    /<script>[\s\S]*<\/script>/,
    `<script>${updatedScriptContent}</script>`
);

// 将更新后的组件内容写回 .vue 文件
fs.writeFileSync(filePath, updatedComponentContent, 'utf-8');

console.log('已成功更新 list 中的 sam 对象的 value');
