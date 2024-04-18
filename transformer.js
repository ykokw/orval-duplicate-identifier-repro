const filterDeprecated = (schema) =>
  Object.fromEntries(
    Object.entries(schema || {}).filter(
      ([_, schemaContent]) => schemaContent.deprecated !== true
    )
  );

const transformComponentsSchemas = (schemas) =>
  Object.entries(schemas).reduce(
    (acc, [componentName, component]) => ({
      ...acc,
      [componentName]: {
        ...component,
        properties: filterDeprecated(component.properties),
      },
    }),
    {}
  );

const transformRequestBodyContent = (requestBodyContent) =>
  Object.entries(requestBodyContent || {}).reduce(
    (acc, [contentType, content]) => ({
      ...acc,
      [contentType]: {
        ...content,
        schema: {
          ...content.schema,
          properties: filterDeprecated(content.schema.properties),
        },
      },
    }),
    {}
  );

const transformPathItem = (pathItem) =>
  Object.entries(pathItem).reduce(
    (pathItemAcc, [verb, operation]) => ({
      ...pathItemAcc,
      [verb]: {
        ...operation,
        requestBody: {
          ...operation.requestBody,
          content: transformRequestBodyContent(
            (operation.requestBody || {}).content
          ),
        },
      },
    }),
    {}
  );

/**
 * Transformer function for orval.
 *
 * @param {OpenAPIObject} schema
 * @return {OpenAPIObject}
 */
module.exports = (inputSchema) => ({
  ...inputSchema,
  paths: Object.entries(inputSchema.paths).reduce((acc, [path, pathItem]) => {
    return {
      ...acc,
      [path]: transformPathItem(pathItem),
    };
  }, {}),
  components: {
    ...inputSchema.components,
    schemas: transformComponentsSchemas(inputSchema.components.schemas),
  },
});
