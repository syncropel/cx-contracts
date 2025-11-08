// STUB RULE: Placeholder until we implement strict CSL compliance checking
// TODO: Implement actual detection of z.lazy() calls on Zod schemas

import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow z.lazy() for recursive schemas (CSL compliance)",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      noLazyRecursion:
        "CSL does not support z.lazy() - recursive schemas must use explicit type definitions",
    },
    schema: [], // no options
  },
  create(context: Rule.RuleContext) {
    // STUB: Return empty visitor object - doesn't check anything yet
    // When ready to enforce, implement AST visitor to detect z.lazy() calls
    return {};
  },
};

export default rule;
