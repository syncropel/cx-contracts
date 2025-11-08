// STUB RULE: Placeholder until we implement strict CSL compliance checking
// TODO: Implement actual detection of .transform() calls on Zod schemas

import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow .transform() calls on Zod schemas (CSL compliance)",
      category: "Best Practices",
      recommended: true,
    },
    messages: {
      noTransforms:
        "CSL does not support .transform() - use only static schema definitions",
    },
    schema: [], // no options
  },
  create(context: Rule.RuleContext) {
    // STUB: Return empty visitor object - doesn't check anything yet
    // When ready to enforce, implement AST visitor to detect .transform() calls
    return {};
  },
};

export default rule;
